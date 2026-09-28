/**
 * lib/adapters/DecisionProvider.js
 * Capa de Decisión y Adaptadores Desacoplados para Elite Agent Bootstrap v2.
 * 
 * Sigue el principio Core vs. Extended:
 * - DeterministicDecisionProvider: Core, 100% autónomo, reglas léxicas y cruce con .agents/registry.json (cero dependencias).
 * - KevJevDecisionProvider: Extended, adaptador opcional para API /v1/systemone o MCP de Kev/Jev con fallback automático.
 */

const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');

class DecisionProvider {
  /**
   * Evalúa un texto de tarea y determina el agente idóneo y sus restricciones
   * @param {string} taskText
   * @param {object} context
   * @returns {Promise<object>}
   */
  async decide(taskText, context = {}) {
    throw new Error('decide() debe ser implementado por la subclase');
  }
}

/**
 * Proveedor Determinista (Core): Rápido, offline, seguro y basado en reglas constitucionales.
 */
class DeterministicDecisionProvider extends DecisionProvider {
  constructor(registryPath) {
    super();
    this.registryPath = registryPath || path.resolve(process.cwd(), '.agents', 'registry.json');
    this.registry = this._loadRegistry();
  }

  _loadRegistry() {
    if (fs.existsSync(this.registryPath)) {
      try {
        return JSON.parse(fs.readFileSync(this.registryPath, 'utf8'));
      } catch (_) {
        return { agents: [] };
      }
    }
    return { agents: [] };
  }

  async decide(taskText, context = {}) {
    const text = (taskText || '').toLowerCase().trim();
    if (!text) {
      return {
        agent_id: 'orchestrator',
        confidence: 0.1,
        risk_level: 'medium',
        requires_human_approval: false,
        reason: 'Texto de tarea vacío; enrutado a orquestador por defecto.',
        engine: 'deterministic-core'
      };
    }

    // 1. Guardrail de Seguridad: Detección de acciones críticas o de producción
    const escalationTriggers = [
      /merge.*(main|master|producci[oó]n)/i,
      /push.*(main|master|producci[oó]n)/i,
      /deploy.*(producci[oó]n|prod)/i,
      /saltar.*revisi[oó]n/i,
      /bypass.*(review|gate|aprobaci[oó]n)/i,
      /eliminar.*(base de datos|bd|db|producci[oó]n)/i,
      /sin.*aprobaci[oó]n.*humana/i,
      /auto.*aprobar/i,
      /force push/i
    ];

    for (const trigger of escalationTriggers) {
      if (trigger.test(text)) {
        const reviewerAgent = this._getAgent('reviewer') || { risk_level: 'medium', requires_human_approval: true };
        return {
          agent_id: 'reviewer',
          agent_name: reviewerAgent.name || 'Puerta de Revisión',
          confidence: 1.0,
          risk_level: 'high',
          requires_human_approval: true,
          escalate: true,
          reason: 'Acción crítica detectada: violación potencial de regla constitucional (Agent ≠ Authority). Se exige revisión y aprobación humana obligatoria.',
          allowed_files: reviewerAgent.allowed_files || [],
          engine: 'deterministic-core'
        };
      }
    }

    // 2. Diccionario de pesos léxicos por agente canónico
    const agentKeywords = {
      'spec-agent': [
        'especificar', 'especificaci[oó]n', 'spec', 'sdd', 'historias? de usuario',
        'criterios? de aceptaci[oó]n', 'given-when-then', 'requisitos?', 'alcance',
        'clarificar', 'redactar plan', 'casos? l[ií]mite', 'user stories'
      ],
      'tester': [
        'test', 'tests', 'pruebas?', 'cobertura', 'coverage', 'jest', 'vitest',
        'mocha', 'unitarias?', 'e2e', 'integraci[oó]n', 'tdd', 'test-driven',
        'verificar suite', 'testear', 'fallos? de test'
      ],
      'security-agent': [
        'seguridad', 'vulnerabilidad', 'vulnerabilidades', 'owasp', 'cve',
        'auditor[ií]a', 'inyecci[oó]n', 'xss', 'csrf', 'secretos?', 'tokens?',
        'sanitizar', 'auth bypass', 'privilegios', 'permisos'
      ],
      'reviewer': [
        'revisar pr', 'revisi[oó]n de c[oó]digo', 'code review', 'puerta de calidad',
        'quality gate', 'aprobar merge', 'validar pr', 'auditar pull request',
        'checklist de calidad', 'convergencia'
      ],
      'optimization-agent': [
        'optimizar', 'optimizaci[oó]n', 'rendimiento', 'performance', 'bundle',
        'latencia', 'memoria', 'profiling', 'tree-shaking', 'lighthouse', 'speed'
      ],
      'implementer': [
        'implementar', 'escribir c[oó]digo', 'desarrollar', 'refactorizar',
        'programar', 'crear componente', 'crear endpoint', 'modificar l[oó]gica',
        'feature', 'bugfix', 'arreglar bug', 'corregir error'
      ],
      'orchestrator': [
        'orquestar', 'coordinar', 'planificar fases', 'asignar tareas',
        'estado general', 'supervisar equipo', 'distribuir'
      ]
    };

    const scores = {};
    for (const [agentId, patterns] of Object.entries(agentKeywords)) {
      scores[agentId] = 0;
      for (const pattern of patterns) {
        const regex = new RegExp(`\\b${pattern}\\b`, 'i');
        if (regex.test(text)) {
          scores[agentId] += 1;
        }
      }
    }

    // Encontrar agente con mayor puntuación
    let bestAgent = 'implementer';
    let maxScore = 0;
    for (const [agentId, score] of Object.entries(scores)) {
      if (score > maxScore) {
        maxScore = score;
        bestAgent = agentId;
      }
    }

    const confidence = maxScore > 0 ? Math.min(1.0, 0.5 + maxScore * 0.2) : 0.4;
    const agentData = this._getAgent(bestAgent) || {
      id: bestAgent,
      name: bestAgent,
      risk_level: 'medium',
      requires_human_approval: false,
      allowed_files: []
    };

    return {
      agent_id: agentData.id,
      agent_name: agentData.name,
      confidence: Number(confidence.toFixed(2)),
      risk_level: agentData.risk_level,
      requires_human_approval: agentData.requires_human_approval,
      allowed_files: agentData.allowed_files || [],
      reason: maxScore > 0
        ? `Coincidencia léxica determinista (${maxScore} términos identificados para rol '${bestAgent}').`
        : `Enrutamiento por defecto a '${bestAgent}' con confianza heurística.`,
      engine: 'deterministic-core'
    };
  }

  _getAgent(agentId) {
    if (!this.registry || !Array.isArray(this.registry.agents)) return null;
    return this.registry.agents.find(a => a.id === agentId) || null;
  }
}

/**
 * Adaptador Extendido para Kev / Jev / System 1 (/v1/systemone o MCP)
 * Si no está configurado, delega con fallback automático a DeterministicDecisionProvider.
 */
class KevJevDecisionProvider extends DecisionProvider {
  constructor(options = {}) {
    super();
    this.apiUrl = options.apiUrl || process.env.KEV_API_URL || process.env.JEV_ENDPOINT || null;
    this.apiKey = options.apiKey || process.env.KEV_API_KEY || null;
    this.fallback = new DeterministicDecisionProvider(options.registryPath);
  }

  async decide(taskText, context = {}) {
    // Si no hay endpoint configurado, usar fallback determinista
    if (!this.apiUrl) {
      const res = await this.fallback.decide(taskText, context);
      res.engine = 'kev-fallback-deterministic';
      return res;
    }

    // Si hay endpoint configurado, consultar API con timeout
    try {
      const payload = JSON.stringify({
        task: taskText,
        options: ['spec-agent', 'implementer', 'tester', 'security-agent', 'reviewer', 'optimization-agent', 'orchestrator'],
        context
      });

      const urlObj = new URL(this.apiUrl);
      const isHttps = urlObj.protocol === 'https:';
      const client = isHttps ? https : http;

      const responseBody = await new Promise((resolve, reject) => {
        const req = client.request(this.apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(payload),
            ...(this.apiKey ? { 'Authorization': `Bearer ${this.apiKey}` } : {})
          },
          timeout: 2000
        }, (res) => {
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => resolve(data));
        });

        req.on('error', reject);
        req.on('timeout', () => {
          req.destroy();
          reject(new Error('Timeout en llamada a Kev API (>2000ms)'));
        });

        req.write(payload);
        req.end();
      });

      const parsed = JSON.parse(responseBody);
      return {
        agent_id: parsed.agent_id || parsed.choice || 'implementer',
        confidence: parsed.confidence || 0.95,
        risk_level: parsed.risk_level || 'medium',
        requires_human_approval: Boolean(parsed.requires_human_approval),
        reason: parsed.reason || 'Clasificación obtenida vía modelo de decisión Kev/Jev',
        engine: 'kev-system1-api'
      };
    } catch (err) {
      // Fallback transparente ante fallo de red
      const fallbackRes = await this.fallback.decide(taskText, context);
      fallbackRes.engine = 'kev-fallback-error';
      fallbackRes.warning = `Fallo en Kev API (${err.message}). Recuperado con motor determinista.`;
      return fallbackRes;
    }
  }
}

/**
 * Fábrica para instanciar el proveedor adecuado según el entorno
 */
function createDecisionProvider(options = {}) {
  const preferExtended = Boolean(process.env.KEV_API_URL || process.env.JEV_ENDPOINT || options.preferExtended);
  if (preferExtended) {
    return new KevJevDecisionProvider(options);
  }
  return new DeterministicDecisionProvider(options.registryPath);
}

module.exports = {
  DecisionProvider,
  DeterministicDecisionProvider,
  KevJevDecisionProvider,
  createDecisionProvider
};
