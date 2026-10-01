#!/usr/bin/env node

/**
 * Elite Agent + Spec-Kit Universal CLI
 * Herramienta de gestión e integración para Spec-Driven Development (SDD)
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const os = require('os');
const { execSync } = require('child_process');

// ==========================================
// Colores y Formato en Terminal
// ==========================================
const colors = {
  reset: '\x1b[0m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  magenta: '\x1b[35m',
  red: '\x1b[31m',
  gray: '\x1b[90m',
  bold: '\x1b[1m'
};

function log(msg, color = colors.reset) {
  console.log(`${color}${msg}${colors.reset}`);
}

function printBanner() {
  log(`
${colors.cyan}${colors.bold}=======================================================
🤖 Elite Agent + Spec-Kit Universal CLI v1.0.0
   Spec-Driven Development (SDD) para Agentes de IA
=======================================================${colors.reset}`);
}

// ==========================================
// Rutas Base de la Plantilla
// ==========================================
const ROOT_DIR = path.resolve(__dirname, '..');
const TEMPLATES_SCAFFOLD_DIR = path.join(ROOT_DIR, '.specify', 'templates', 'scaffold');
const SPECIFY_SRC_DIR = path.join(ROOT_DIR, '.specify');
const PROMPTS_SRC_DIR = path.join(ROOT_DIR, '.github', 'prompts');
const WORKFLOWS_SRC_DIR = path.join(ROOT_DIR, '.github', 'workflows');

// ==========================================
// Funciones Utilitarias
// ==========================================
function ask(questionText) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return new Promise((resolve) => {
    rl.question(`${colors.yellow}${questionText}${colors.reset} `, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

function ensureDirSync(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function copyDirRecursiveSync(src, dest, overwrite = false) {
  ensureDirSync(dest);
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirRecursiveSync(srcPath, destPath, overwrite);
    } else {
      if (!fs.existsSync(destPath) || overwrite) {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }
}

function backupFile(filePath) {
  if (fs.existsSync(filePath)) {
    const bakPath = `${filePath}.bak`;
    fs.copyFileSync(filePath, bakPath);
    log(`  [🛡️ Backup] Creado: ${path.basename(bakPath)}`, colors.gray);
  }
}

// ==========================================
// Detección de Stack y Contexto
// ==========================================
function detectProjectContext(targetDir) {
  const isDirEmpty = !fs.existsSync(targetDir) || fs.readdirSync(targetDir).length === 0;
  const files = fs.existsSync(targetDir) ? fs.readdirSync(targetDir) : [];
  const hasExistingCode = files.some(f => 
    ['package.json', 'pyproject.toml', 'Cargo.toml', 'go.mod', 'pom.xml', 'build.gradle', 'composer.json', 'src', 'app', 'lib'].includes(f)
  );

  let stack = {
    name: 'Genérico / Multi-lenguaje',
    devCmd: 'npm run dev',
    buildCmd: 'npm run build',
    lintCmd: 'npm run lint',
    testCmd: 'npm test',
    srcPath: 'src/',
    componentsPath: 'src/components/',
    projectName: path.basename(targetDir) || 'Proyecto'
  };

  const pkgPath = path.join(targetDir, 'package.json');
  if (fs.existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
      if (pkg.name) stack.projectName = pkg.name;
      stack.name = `Node.js / TypeScript / Web (${stack.projectName})`;
      if (pkg.scripts) {
        if (pkg.scripts.dev) stack.devCmd = 'npm run dev';
        else if (pkg.scripts.start) stack.devCmd = 'npm start';
        if (pkg.scripts.build) stack.buildCmd = 'npm run build';
        if (pkg.scripts.lint) stack.lintCmd = 'npm run lint';
        if (pkg.scripts.test) stack.testCmd = 'npm test';
      }
    } catch (e) {
      stack.name = 'Node.js / JavaScript';
    }
  } else if (fs.existsSync(path.join(targetDir, 'pyproject.toml')) || fs.existsSync(path.join(targetDir, 'requirements.txt'))) {
    stack.name = 'Python (UV / Poetry / Pytest)';
    stack.devCmd = 'uv run python main.py';
    stack.buildCmd = 'uv build';
    stack.lintCmd = 'ruff check .';
    stack.testCmd = 'pytest';
    stack.srcPath = fs.existsSync(path.join(targetDir, 'app')) ? 'app/' : 'src/';
  } else if (fs.existsSync(path.join(targetDir, 'Cargo.toml'))) {
    stack.name = 'Rust (Cargo)';
    stack.devCmd = 'cargo run';
    stack.buildCmd = 'cargo build --release';
    stack.lintCmd = 'cargo clippy';
    stack.testCmd = 'cargo test';
  } else if (fs.existsSync(path.join(targetDir, 'go.mod'))) {
    stack.name = 'Go (Golang)';
    stack.devCmd = 'go run .';
    stack.buildCmd = 'go build';
    stack.lintCmd = 'golangci-lint run';
    stack.testCmd = 'go test ./...';
  }

  const determinedMode = (isDirEmpty || (!hasExistingCode && files.length <= 2)) ? 'new' : 'existing';

  return {
    isDirEmpty,
    hasExistingCode,
    stack,
    defaultMode: determinedMode
  };
}

// ==========================================
// Comando: Verificar Specs (verify)
// ==========================================
function cmdVerify(targetDir) {
  printBanner();
  const specsDir = path.join(targetDir, 'specs');
  if (!fs.existsSync(specsDir)) {
    log(`[-] No se encontró la carpeta 'specs/' en: ${targetDir}`, colors.red);
    return;
  }

  log(`\n🔍 Verificando especificaciones en: ${colors.bold}${specsDir}${colors.reset}\n`);
  const entries = fs.readdirSync(specsDir, { withFileTypes: true })
    .filter(e => e.isDirectory());

  if (entries.length === 0) {
    log(`[INFO] No hay especificaciones creadas aún en 'specs/'. Usa 'agent create <nombre>'`, colors.gray);
    return;
  }

  log(`=== Estado de Especificaciones y Tareas ===\n`, colors.cyan);

  for (const entry of entries) {
    const featureDir = path.join(specsDir, entry.name);
    const hasSpec = fs.existsSync(path.join(featureDir, 'spec.md'));
    const hasPlan = fs.existsSync(path.join(featureDir, 'plan.md'));
    const hasTasks = fs.existsSync(path.join(featureDir, 'tasks.md'));

    log(`[*] Feature: ${colors.bold}${entry.name}${colors.reset}`, colors.yellow);
    log(`   - spec.md:  ${hasSpec ? colors.green + '[OK] Presente' : colors.red + '[X] Faltante'}${colors.reset}`);
    log(`   - plan.md:  ${hasPlan ? colors.green + '[OK] Presente' : colors.red + '[X] Faltante'}${colors.reset}`);
    log(`   - tasks.md: ${hasTasks ? colors.green + '[OK] Presente' : colors.red + '[X] Faltante'}${colors.reset}`);

    if (hasTasks) {
      const tasksContent = fs.readFileSync(path.join(featureDir, 'tasks.md'), 'utf8');
      const lines = tasksContent.split('\n');
      const totalTasks = lines.filter(l => /^- \[( |x)\] \*\*`\[TASK-/.test(l)).length;
      const doneTasks = lines.filter(l => /^- \[x\] \*\*`\[TASK-/.test(l)).length;

      if (totalTasks > 0) {
        const pct = ((doneTasks / totalTasks) * 100).toFixed(1);
        const color = doneTasks === totalTasks ? colors.green : colors.cyan;
        log(`   - Tareas:   ${doneTasks} / ${totalTasks} completadas (${pct}%)`, color);
      } else {
        log(`   - Tareas:   Sin tareas estructuradas [TASK-XXX]`, colors.gray);
      }
    }
    console.log('');
  }

  log(`===========================================`, colors.cyan);
}

// ==========================================
// Comandos de Registro de Agentes (registry)
// ==========================================
function validateAgentRegistry(targetDir) {
  const registryPath = path.join(targetDir, '.agents', 'registry.json');
  if (!fs.existsSync(registryPath)) {
    throw new Error(`No se encontró el archivo de registro en: ${registryPath}`);
  }

  let registry;
  try {
    registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
  } catch (err) {
    throw new Error(`Sintaxis JSON inválida en ${registryPath}: ${err.message}`);
  }

  const requiredRoot = ['version', 'project_name', 'governance_source', 'agents'];
  for (const field of requiredRoot) {
    if (!registry[field]) {
      throw new Error(`Falta el campo requerido '${field}' en la raíz del registro.`);
    }
  }

  if (!Array.isArray(registry.agents) || registry.agents.length === 0) {
    throw new Error(`El campo 'agents' debe ser un array no vacío.`);
  }

  const validRoles = [
    'orchestrator', 'spec-agent', 'implementer', 'tester',
    'security-agent', 'reviewer', 'optimization-agent', 'custom'
  ];
  const validRisks = ['low', 'medium', 'high', 'critical'];

  const requiredAgentProps = [
    'id', 'name', 'description', 'role', 'capabilities',
    'allowed_files', 'forbidden_files', 'risk_level',
    'requires_human_approval', 'can_modify_code', 'can_modify_specs',
    'can_modify_governance', 'can_commit', 'can_merge'
  ];

  const agentIds = new Set();

  for (const agent of registry.agents) {
    for (const prop of requiredAgentProps) {
      if (agent[prop] === undefined || agent[prop] === null) {
        throw new Error(`Agente '${agent.id || 'desconocido'}' carece de la propiedad requerida '${prop}'.`);
      }
    }

    if (agentIds.has(agent.id)) {
      throw new Error(`ID de agente duplicado detectado: '${agent.id}'.`);
    }
    agentIds.add(agent.id);

    if (!validRoles.includes(agent.role)) {
      throw new Error(`Agente '${agent.id}' tiene un rol no válido: '${agent.role}'. Válidos: ${validRoles.join(', ')}`);
    }

    if (!validRisks.includes(agent.risk_level)) {
      throw new Error(`Agente '${agent.id}' tiene un risk_level no válido: '${agent.risk_level}'. Válidos: ${validRisks.join(', ')}`);
    }

    // Regla de Oro de Seguridad: can_modify_governance requiere riesgo crítico y aprobación humana
    if (agent.can_modify_governance && (!agent.requires_human_approval || agent.risk_level !== 'critical')) {
      throw new Error(`Violación de Gobernanza en '${agent.id}': can_modify_governance solo se permite con risk_level='critical' y requires_human_approval=true.`);
    }

    // Regla de Oro de Seguridad: Separación de Funciones (Implementer no puede hacer merge)
    if (agent.role === 'implementer' && agent.can_merge) {
      throw new Error(`Violación de Seguridad en '${agent.id}': El implementador no puede tener permiso de merge directo (can_merge=false).`);
    }
  }

  return registry;
}

function cmdRegistry(targetDir, subAction = 'list') {
  printBanner();
  const registryPath = path.join(targetDir, '.agents', 'registry.json');

  if (subAction === 'validate') {
    log(`\n🔍 Validando registro de agentes en: ${colors.bold}${registryPath}${colors.reset}\n`, colors.cyan);
    try {
      const reg = validateAgentRegistry(targetDir);
      log(`✅ Registro de gobernanza válido (v${reg.version}): ${reg.agents.length} agentes auditados sin violaciones.`, colors.green);
      log(`   Proyecto: ${reg.project_name} | Gobernanza: ${reg.governance_source}\n`, colors.gray);
    } catch (err) {
      log(`❌ Error de validación: ${err.message}\n`, colors.red);
      process.exit(1);
    }
    return;
  }

  // Por defecto: 'list'
  log(`\n📋 Catálogo Oficial de Agentes Registrados:\n`, colors.cyan);
  try {
    const reg = validateAgentRegistry(targetDir);
    log(`Proyecto: ${colors.bold}${reg.project_name}${colors.reset} (v${reg.version}) | Gobernanza: ${reg.governance_source}\n`);

    log(`| ID | Rol | Riesgo | Código | Specs | Aprob. Humana | Commit | Merge |`, colors.yellow);
    log(`|---|---|---|---|---|---|---|---|`, colors.gray);
    for (const a of reg.agents) {
      const modCode = a.can_modify_code ? '✅' : '❌';
      const modSpecs = a.can_modify_specs ? '✅' : '❌';
      const reqHuman = a.requires_human_approval ? '🔒 Sí' : '⚡ No';
      const canCommit = a.can_commit ? '✅' : '❌';
      const canMerge = a.can_merge ? '✅' : '❌';
      log(`| ${colors.bold}${a.id.padEnd(18)}${colors.reset} | ${a.role.padEnd(16)} | ${a.risk_level.padEnd(8)} | ${modCode}     | ${modSpecs}     | ${reqHuman.padEnd(13)} | ${canCommit}      | ${canMerge}     |`);
    }
    console.log('');
  } catch (err) {
    log(`❌ Error al leer el catálogo de agentes: ${err.message}\n`, colors.red);
    process.exit(1);
  }
}

// ==========================================
// Comandos de Handoffs entre Agentes (handoff)
// ==========================================
function validateHandoffs(targetDir) {
  const handoffsDir = path.join(targetDir, '.agents', 'handoffs');
  if (!fs.existsSync(handoffsDir)) {
    return [];
  }

  let knownAgents = new Set();
  const registryPath = path.join(targetDir, '.agents', 'registry.json');
  if (fs.existsSync(registryPath)) {
    try {
      const reg = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
      if (Array.isArray(reg.agents)) {
        reg.agents.forEach(a => knownAgents.add(a.id));
      }
    } catch (_) {}
  }

  const files = fs.readdirSync(handoffsDir).filter(f => f.endsWith('.json'));
  const handoffs = [];

  const requiredProps = [
    'handoff_id', 'from', 'to', 'task_id', 'objective', 'context',
    'inputs', 'constraints', 'completed', 'decisions', 'artifacts',
    'evidence', 'risks', 'next_action', 'required_approval', 'timestamp'
  ];

  for (const file of files) {
    const filePath = path.join(handoffsDir, file);
    let h;
    try {
      h = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (err) {
      throw new Error(`Sintaxis JSON inválida en handoff '${file}': ${err.message}`);
    }

    for (const prop of requiredProps) {
      if (h[prop] === undefined || h[prop] === null) {
        throw new Error(`Handoff '${file}' carece de la propiedad requerida '${prop}'.`);
      }
    }

    if (!/^HO-[0-9]{3}-[a-z0-9-]+$/.test(h.handoff_id)) {
      throw new Error(`Handoff '${file}' tiene un ID inválido: '${h.handoff_id}'. Formato requerido: HO-XXX-descripcion`);
    }

    if (knownAgents.size > 0) {
      if (!knownAgents.has(h.from)) {
        throw new Error(`Handoff '${file}': Agente emisor '${h.from}' no existe en .agents/registry.json.`);
      }
      if (!knownAgents.has(h.to)) {
        throw new Error(`Handoff '${file}': Agente receptor '${h.to}' no existe en .agents/registry.json.`);
      }
    }

    handoffs.push(h);
  }

  return handoffs;
}

function cmdHandoff(targetDir, subAction = 'list') {
  printBanner();
  const handoffsDir = path.join(targetDir, '.agents', 'handoffs');

  if (subAction === 'validate') {
    log(`\n🔍 Validando protocolo de handoffs en: ${colors.bold}${handoffsDir}${colors.reset}\n`, colors.cyan);
    try {
      const handoffs = validateHandoffs(targetDir);
      log(`✅ Protocolo de traspasos válido: ${handoffs.length} handoffs auditados sin violaciones.`, colors.green);
      console.log('');
    } catch (err) {
      log(`❌ Error en validación de handoffs: ${err.message}\n`, colors.red);
      process.exit(1);
    }
    return;
  }

  // Por defecto: 'list'
  log(`\n🤝 Traspasos Registrados entre Agentes (Handoffs):\n`, colors.cyan);
  try {
    const handoffs = validateHandoffs(targetDir);
    if (handoffs.length === 0) {
      log(`[INFO] No hay traspasos registrados aún en '.agents/handoffs/'.`, colors.gray);
      console.log('');
      return;
    }

    log(`| ID | De (From) | Para (To) | Tarea | Aprobación | Timestamp |`, colors.yellow);
    log(`|---|---|---|---|---|---|`, colors.gray);
    for (const h of handoffs) {
      const reqAppr = h.required_approval ? '🔒 Sí' : '⚡ No';
      const timeStr = h.timestamp ? h.timestamp.split('T')[0] : 'N/A';
      log(`| ${colors.bold}${h.handoff_id.padEnd(30)}${colors.reset} | ${h.from.padEnd(14)} | ${h.to.padEnd(14)} | ${h.task_id.padEnd(10)} | ${reqAppr.padEnd(10)} | ${timeStr} |`);
    }
    console.log('');
  } catch (err) {
    log(`❌ Error al listar handoffs: ${err.message}\n`, colors.red);
    process.exit(1);
  }
}

// ==========================================
// Comandos del Sistema de Evidencias (evidence)
// ==========================================
function validateEvidences(targetDir) {
  const evidenceDir = path.join(targetDir, '.evidence');
  if (!fs.existsSync(evidenceDir)) {
    return [];
  }

  let knownAgents = new Set();
  const registryPath = path.join(targetDir, '.agents', 'registry.json');
  if (fs.existsSync(registryPath)) {
    try {
      const reg = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
      if (Array.isArray(reg.agents)) {
        reg.agents.forEach(a => knownAgents.add(a.id));
      }
    } catch (_) {}
  }

  function getJsonFiles(dir) {
    let results = [];
    const list = fs.readdirSync(dir, { withFileTypes: true });
    for (const item of list) {
      const fullPath = path.join(dir, item.name);
      if (item.isDirectory()) {
        results = results.concat(getJsonFiles(fullPath));
      } else if (item.name.endsWith('.json')) {
        results.push(fullPath);
      }
    }
    return results;
  }

  const files = getJsonFiles(evidenceDir);
  const evidences = [];

  const requiredProps = [
    'evidence_id', 'task_id', 'feature_id', 'runner_agent',
    'command', 'exit_code', 'status', 'summary', 'timestamp'
  ];

  for (const filePath of files) {
    const relName = path.relative(evidenceDir, filePath);
    let ev;
    try {
      ev = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (err) {
      throw new Error(`Sintaxis JSON inválida en evidencia '${relName}': ${err.message}`);
    }

    for (const prop of requiredProps) {
      if (ev[prop] === undefined || ev[prop] === null) {
        throw new Error(`Evidencia '${relName}' carece de la propiedad requerida '${prop}'.`);
      }
    }

    if (!['passed', 'failed', 'skipped'].includes(ev.status)) {
      throw new Error(`Evidencia '${relName}' tiene un status no válido: '${ev.status}'.`);
    }

    if (ev.status === 'passed' && ev.exit_code !== 0) {
      throw new Error(`Evidencia '${relName}' inconsistente: status='passed' pero exit_code=${ev.exit_code} (debe ser 0).`);
    }

    if (knownAgents.size > 0 && !knownAgents.has(ev.runner_agent)) {
      throw new Error(`Evidencia '${relName}': El agente ejecutor '${ev.runner_agent}' no existe en .agents/registry.json.`);
    }

    evidences.push(ev);
  }

  return evidences;
}

function cmdEvidence(targetDir, subAction = 'verify') {
  printBanner();
  const evidenceDir = path.join(targetDir, '.evidence');

  if (subAction === 'verify' || subAction === 'validate') {
    log(`\n🔍 Auditando comprobantes de evidencia en: ${colors.bold}${evidenceDir}${colors.reset}\n`, colors.cyan);
    try {
      const evidences = validateEvidences(targetDir);
      log(`✅ Sistema de evidencias verificado: ${evidences.length} comprobantes inmutables válidos.`, colors.green);
      console.log('');
    } catch (err) {
      log(`❌ Error de verificación de evidencias: ${err.message}\n`, colors.red);
      process.exit(1);
    }
    return;
  }

  // 'list'
  log(`\n🛡️ Registro de Evidencias Reproducibles (.evidence):\n`, colors.cyan);
  try {
    const evidences = validateEvidences(targetDir);
    if (evidences.length === 0) {
      log(`[INFO] No hay comprobantes registrados aún en '.evidence/'.`, colors.gray);
      console.log('');
      return;
    }

    log(`| ID | Tarea | Feature | Agente | Estado | Exit | Comando |`, colors.yellow);
    log(`|---|---|---|---|---|---|---|`, colors.gray);
    for (const ev of evidences) {
      const stColor = ev.status === 'passed' ? colors.green + 'passed' : colors.red + ev.status;
      log(`| ${colors.bold}${ev.evidence_id.padEnd(24)}${colors.reset} | ${ev.task_id.padEnd(10)} | ${ev.feature_id.padEnd(28)} | ${ev.runner_agent.padEnd(12)} | ${stColor.padEnd(16)}${colors.reset} | ${String(ev.exit_code).padEnd(4)} | ${ev.command} |`);
    }
    console.log('');
  } catch (err) {
    log(`❌ Error al listar evidencias: ${err.message}\n`, colors.red);
    process.exit(1);
  }
}

// ==========================================
// Comandos del Sistema de Memoria (memory)
// ==========================================
function validateMemory(targetDir) {
  const memoryRoot = path.join(targetDir, 'MEMORY.md');
  const memoryDir = path.join(targetDir, '.agents', 'memory');

  if (!fs.existsSync(memoryRoot)) {
    throw new Error(`No se encontró el índice canónico 'MEMORY.md' en: ${memoryRoot}`);
  }

  if (!fs.existsSync(memoryDir)) {
    throw new Error(`No se encontró el directorio de memorias modulares '.agents/memory' en: ${memoryDir}`);
  }

  let knownAgents = new Set();
  const registryPath = path.join(targetDir, '.agents', 'registry.json');
  if (fs.existsSync(registryPath)) {
    try {
      const reg = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
      if (Array.isArray(reg.agents)) {
        reg.agents.forEach(a => knownAgents.add(a.id));
      }
    } catch (_) {}
  }

  const files = fs.readdirSync(memoryDir, { withFileTypes: true })
    .filter(e => !e.isDirectory() && e.name.endsWith('.md'))
    .map(e => e.name);

  const entries = [];
  const knownIds = new Set();
  const validTypes = ['pattern', 'decision', 'lesson', 'context'];
  const validStatuses = ['active', 'stale', 'archived'];
  const validConfidences = ['high', 'medium', 'low'];

  for (const fileName of files) {
    const fullPath = path.join(memoryDir, fileName);
    const content = fs.readFileSync(fullPath, 'utf8');

    // Parsear bloques de memoria: cada entrada empieza con ### MEM-...
    const sections = content.split(/\n(?=###\s+MEM-)/);

    for (const section of sections) {
      if (!section.trim().startsWith('### MEM-')) continue;

      const headerMatch = section.match(/^###\s+MEM-([0-9]{3})(?::\s*|\s+)([^\n]+)/);
      if (!headerMatch) {
        throw new Error(`Encabezado de memoria inválido en '${fileName}'. Formato esperado: '### MEM-XXX: Título'`);
      }

      const shortId = `MEM-${headerMatch[1]}`;
      const title = headerMatch[2].trim();

      const idMatch = section.match(/- \*\*ID\*\*:\s*`?([a-zA-Z0-9_-]+)`?/);
      const typeMatch = section.match(/- \*\*Tipo\*\*:\s*`?([a-zA-Z0-9_-]+)`?/);
      const statusMatch = section.match(/- \*\*Estado\*\*:\s*`?([a-zA-Z0-9_-]+)`?/);
      const confMatch = section.match(/- \*\*Confianza\*\*:\s*`?([a-zA-Z0-9_-]+)`?/);
      const dateMatch = section.match(/- \*\*Fecha\*\*:\s*`?([0-9]{4}-[0-9]{2}-[0-9]{2})`?/);
      const sourceMatch = section.match(/- \*\*Fuente\*\*:\s*`?([^\n`]+)`?/);
      const authorMatch = section.match(/- \*\*Autor\*\*:\s*`?([a-zA-Z0-9_-]+)`?/);
      const summaryMatch = section.match(/- \*\*Resumen\*\*:\s*([^\n]+)/);

      const memId = idMatch ? idMatch[1].trim() : shortId;

      if (!/^MEM-[0-9]{3}(-[a-z0-9-]+)?$/.test(memId)) {
        throw new Error(`ID de memoria inválido en '${fileName}': '${memId}'. Formato: MEM-XXX o MEM-XXX-slug`);
      }

      if (knownIds.has(memId)) {
        throw new Error(`ID de memoria duplicado detectado: '${memId}' en '${fileName}'.`);
      }
      knownIds.add(memId);

      const memType = typeMatch ? typeMatch[1].trim() : '';
      if (!validTypes.includes(memType)) {
        throw new Error(`Memoria '${memId}' en '${fileName}' tiene un tipo inválido: '${memType}'. Válidos: ${validTypes.join(', ')}`);
      }

      const memStatus = statusMatch ? statusMatch[1].trim() : 'active';
      if (!validStatuses.includes(memStatus)) {
        throw new Error(`Memoria '${memId}' en '${fileName}' tiene un estado inválido: '${memStatus}'. Válidos: ${validStatuses.join(', ')}`);
      }

      const memConf = confMatch ? confMatch[1].trim() : 'medium';
      if (!validConfidences.includes(memConf)) {
        throw new Error(`Memoria '${memId}' en '${fileName}' tiene una confianza inválida: '${memConf}'. Válidos: ${validConfidences.join(', ')}`);
      }

      if (!summaryMatch || summaryMatch[1].trim().length < 10) {
        throw new Error(`Memoria '${memId}' en '${fileName}' requiere un resumen descriptivo (- **Resumen**: ...) de al menos 10 caracteres.`);
      }

      if (authorMatch && knownAgents.size > 0 && !knownAgents.has(authorMatch[1].trim())) {
        throw new Error(`Memoria '${memId}' en '${fileName}': El autor '${authorMatch[1].trim()}' no existe en .agents/registry.json.`);
      }

      let details = '';
      const detailsIndex = section.indexOf('- **Detalles**:');
      if (detailsIndex !== -1) {
        details = section.slice(detailsIndex + '- **Detalles**:'.length).trim();
      }

      entries.push({
        id: memId,
        short_id: shortId,
        title,
        type: memType,
        status: memStatus,
        confidence: memConf,
        created: dateMatch ? dateMatch[1].trim() : '',
        source: sourceMatch ? sourceMatch[1].trim() : '',
        author_agent: authorMatch ? authorMatch[1].trim() : '',
        summary: summaryMatch[1].trim(),
        details,
        file: fileName,
        rawSection: section
      });
    }
  }

  return entries;
}

function cmdMemory(targetDir, subAction = 'list', rawArgs = []) {
  printBanner();
  const memoryDir = path.join(targetDir, '.agents', 'memory');

  if (subAction === 'validate' || subAction === 'verify') {
    log(`\n🔍 Validando sistema de memoria persistente en: ${colors.bold}${memoryDir}${colors.reset}\n`, colors.cyan);
    try {
      const entries = validateMemory(targetDir);
      const activeCount = entries.filter(e => e.status === 'active').length;
      log(`✅ Sistema de memoria persistente verificado: ${entries.length} memorias auditadas (${activeCount} activas) sin violaciones.`, colors.green);
      log(`   Índice raíz: MEMORY.md | Directorio modular: .agents/memory/\n`, colors.gray);
    } catch (err) {
      log(`❌ Error de validación de memoria: ${err.message}\n`, colors.red);
      process.exit(1);
    }
    return;
  }

  if (subAction === 'list' || subAction === 'ls') {
    log(`\n🧠 Memorias Persistentes Registradas (.agents/memory):\n`, colors.cyan);
    try {
      const entries = validateMemory(targetDir);
      if (entries.length === 0) {
        log(`[INFO] No hay memorias registradas aún en '.agents/memory/'.`, colors.gray);
        console.log('');
        return;
      }

      log(`| ID | Tipo | Estado | Confianza | Archivo | Título |`, colors.yellow);
      log(`|---|---|---|---|---|---|`, colors.gray);
      for (const m of entries) {
        const stColor = m.status === 'active' ? colors.green + m.status : colors.yellow + m.status;
        const typeColor = colors.cyan + m.type.padEnd(8) + colors.reset;
        log(`| ${colors.bold}${m.short_id.padEnd(8)}${colors.reset} | ${typeColor} | ${stColor.padEnd(16)}${colors.reset} | ${m.confidence.padEnd(9)} | ${m.file.padEnd(14)} | ${m.title} |`);
      }
      console.log('');
    } catch (err) {
      log(`❌ Error al listar memorias: ${err.message}\n`, colors.red);
      process.exit(1);
    }
    return;
  }

  if (subAction === 'search' || subAction === 'find') {
    const query = rawArgs.slice(2).join(' ').toLowerCase();
    if (!query) {
      log(`[-] Error: Debes especificar un término de búsqueda.`, colors.red);
      log(`    Ejemplo: agent memory search "powershell"`, colors.yellow);
      return;
    }

    log(`\n🔍 Buscando memorias con término: "${query}"...\n`, colors.cyan);
    try {
      const entries = validateMemory(targetDir);
      const matches = entries.filter(m => 
        m.id.toLowerCase().includes(query) ||
        m.title.toLowerCase().includes(query) ||
        m.summary.toLowerCase().includes(query) ||
        m.details.toLowerCase().includes(query)
      );

      if (matches.length === 0) {
        log(`[INFO] No se encontraron memorias que coincidan con "${query}".`, colors.gray);
        console.log('');
        return;
      }

      log(`Se encontraron ${matches.length} coincidencias:\n`, colors.green);
      for (const m of matches) {
        log(`• [${colors.bold}${m.short_id}${colors.reset}] ${colors.yellow}${m.title}${colors.reset} (${m.type} - ${m.status})`);
        log(`  Archivo: .agents/memory/${m.file}`);
        log(`  Resumen: ${m.summary}\n`);
      }
    } catch (err) {
      log(`❌ Error al buscar memorias: ${err.message}\n`, colors.red);
      process.exit(1);
    }
    return;
  }

  if (subAction === 'show') {
    const targetId = rawArgs[2];
    if (!targetId) {
      log(`[-] Error: Debes especificar el ID de la memoria a consultar.`, colors.red);
      log(`    Ejemplo: agent memory show MEM-001`, colors.yellow);
      return;
    }

    try {
      const entries = validateMemory(targetDir);
      const match = entries.find(m => m.short_id.toLowerCase() === targetId.toLowerCase() || m.id.toLowerCase() === targetId.toLowerCase());
      if (!match) {
        log(`[-] No se encontró ninguna memoria con ID '${targetId}'.`, colors.red);
        return;
      }

      log(`\n📋 Detalle de Memoria [${colors.bold}${match.short_id}${colors.reset}]:\n`, colors.cyan);
      log(`• Título:      ${colors.bold}${match.title}${colors.reset}`);
      log(`• ID Canónico: ${match.id}`);
      log(`• Tipo:        ${match.type}`);
      log(`• Estado:      ${match.status}`);
      log(`• Confianza:   ${match.confidence}`);
      log(`• Fecha:       ${match.created || 'N/A'}`);
      log(`• Autor:       ${match.author_agent || 'N/A'}`);
      log(`• Fuente:      ${match.source || 'N/A'}`);
      log(`• Archivo:     .agents/memory/${match.file}`);
      log(`\n• Resumen:\n  ${match.summary}\n`);
      if (match.details) {
        log(`• Detalles Técnicos:\n  ${match.details.split('\n').join('\n  ')}\n`);
      }
    } catch (err) {
      log(`❌ Error al mostrar memoria: ${err.message}\n`, colors.red);
      process.exit(1);
    }
    return;
  }

  if (subAction === 'archive') {
    const targetId = rawArgs[2];
    if (!targetId) {
      log(`[-] Error: Debes especificar el ID de la memoria a archivar.`, colors.red);
      log(`    Ejemplo: agent memory archive MEM-001`, colors.yellow);
      return;
    }

    try {
      const entries = validateMemory(targetDir);
      const match = entries.find(m => m.short_id.toLowerCase() === targetId.toLowerCase() || m.id.toLowerCase() === targetId.toLowerCase());
      if (!match) {
        log(`[-] No se encontró ninguna memoria con ID '${targetId}'.`, colors.red);
        return;
      }

      const archiveDir = path.join(memoryDir, 'archive');
      ensureDirSync(archiveDir);
      const archiveFile = path.join(archiveDir, `${match.short_id.toLowerCase()}.md`);

      const sourceFile = path.join(memoryDir, match.file);
      let sourceContent = fs.readFileSync(sourceFile, 'utf8');

      let archivedSection = match.rawSection.replace(/- \*\*Estado\*\*:\s*`?[a-zA-Z0-9_-]+`?/, `- **Estado**: archived\n- **Fecha Archivado**: ${new Date().toISOString().split('T')[0]}`);

      fs.writeFileSync(archiveFile, `# Memoria Archivada: ${match.title}\n\n${archivedSection}\n`, 'utf8');
      
      sourceContent = sourceContent.replace(match.rawSection, archivedSection);
      fs.writeFileSync(sourceFile, sourceContent, 'utf8');

      log(`\n📦 Memoria [${match.short_id}] archivada con éxito.`, colors.green);
      log(`   Preservada en: .agents/memory/archive/${match.short_id.toLowerCase()}.md\n`, colors.gray);
    } catch (err) {
      log(`❌ Error al archivar memoria: ${err.message}\n`, colors.red);
      process.exit(1);
    }
    return;
  }

  log(`[-] Subacción desconocida para 'memory': '${subAction}'. Opciones: validate, list, search, show, archive`, colors.yellow);
}

// ==========================================
// Comandos de Enrutamiento y Decisión (route)
// ==========================================
async function cmdRoute(targetDir, query) {
  printBanner();
  if (!query) {
    log(`[-] Error: Debes especificar una descripción de la tarea a enrutar.`, colors.red);
    log(`    Ejemplo: agent route "escribir pruebas unitarias con Jest"`, colors.yellow);
    return;
  }

  const { createDecisionProvider } = require('../lib/adapters/DecisionProvider');
  const registryPath = path.join(targetDir, '.agents', 'registry.json');
  const provider = createDecisionProvider({ registryPath });

  log(`\n🎯 Enrutando Tarea a través de la Capa de Decisión:\n`, colors.cyan);
  log(`   Tarea: "${query}"`, colors.bold);

  const decision = await provider.decide(query);
  const approvalBadge = decision.requires_human_approval ? `${colors.red}🔒 Requerida (Agent ≠ Authority)${colors.reset}` : `${colors.green}⚡ No requerida${colors.reset}`;
  const confPct = Math.round((decision.confidence || 0) * 100);

  log(`\n📋 Resultado del Enrutamiento:`, colors.yellow);
  log(`   • Agente ID:         ${colors.bold}${decision.agent_id}${colors.reset}`);
  log(`   • Rol / Nombre:      ${decision.agent_name || decision.agent_id}`);
  log(`   • Nivel de Riesgo:   ${decision.risk_level}`);
  log(`   • Aprobación Humana: ${approvalBadge}`);
  log(`   • Nivel Confianza:   ${confPct}% (${decision.engine})`);
  log(`   • Justificación:     ${decision.reason}`);
  if (decision.allowed_files && decision.allowed_files.length > 0) {
    log(`   • Rutas Permitidas:  ${decision.allowed_files.join(', ')}`);
  }
  console.log('');
}

// ==========================================
// Comando de Evaluación Sintética (eval)
// ==========================================
async function cmdEval(targetDir) {
  printBanner();
  const evalsFile = path.join(targetDir, '.evals', 'scenarios', 'routing-scenarios.json');
  if (!fs.existsSync(evalsFile)) {
    log(`❌ Archivo de escenarios no encontrado en: ${evalsFile}`, colors.red);
    process.exit(1);
  }

  let scenarios;
  try {
    scenarios = JSON.parse(fs.readFileSync(evalsFile, 'utf8'));
  } catch (err) {
    log(`❌ Error al parsear ${evalsFile}: ${err.message}`, colors.red);
    process.exit(1);
  }

  const { createDecisionProvider } = require('../lib/adapters/DecisionProvider');
  const registryPath = path.join(targetDir, '.agents', 'registry.json');
  const provider = createDecisionProvider({ registryPath });

  log(`\n🧪 Ejecutando Suite de Evaluación Sintética (.evals):\n`, colors.cyan);
  log(`Escenarios cargados: ${scenarios.length}\n`, colors.gray);

  let passed = 0;
  let failed = 0;

  for (const sc of scenarios) {
    const res = await provider.decide(sc.input);
    const agentMatch = res.agent_id === sc.expected_agent;
    const approvalMatch = Boolean(res.requires_human_approval) === Boolean(sc.expected_approval);

    if (agentMatch && approvalMatch) {
      passed++;
      log(`  [PASS] ${colors.green}✓${colors.reset} [${sc.id}] ${sc.description} ➔ ${colors.bold}${res.agent_id}${colors.reset} (conf: ${Math.round(res.confidence * 100)}%)`);
    } else {
      failed++;
      log(`  [FAIL] ${colors.red}✗${colors.reset} [${sc.id}] ${sc.description}`);
      log(`         Esperado: agent=${sc.expected_agent}, approval=${sc.expected_approval}`);
      log(`         Obtenido: agent=${res.agent_id}, approval=${res.requires_human_approval}`);
    }
  }

  const pct = Math.round((passed / scenarios.length) * 100);
  console.log('');
  if (failed === 0) {
    log(`✅ Suite de evaluación sintética completada con éxito: ${passed}/${scenarios.length} escenarios superados (${pct}%).`, colors.green);
    
    // Registrar comprobante de evidencia si existe .evidence/
    const evidenceDir = path.join(targetDir, '.evidence');
    if (fs.existsSync(evidenceDir)) {
      const evRecord = {
        evidence_id: "EV-002-evals-routing",
        task_id: "TASK-003",
        feature_id: "005-v2-phase4-decision-adapters",
        runner_agent: "tester",
        command: "npm run test:evals",
        exit_code: 0,
        status: "passed",
        summary: `Evaluación sintética de enrutamiento: ${passed}/${scenarios.length} escenarios superados (100%)`,
        log_artifact: ".evals/scenarios/routing-scenarios.json",
        timestamp: new Date().toISOString()
      };
      try {
        fs.writeFileSync(path.join(evidenceDir, 'EV-002-evals-routing.json'), JSON.stringify(evRecord, null, 2), 'utf8');
        log(`   [+] Comprobante de evidencia generado en: .evidence/EV-002-evals-routing.json`, colors.gray);
      } catch (_) {}
    }
    console.log('');
  } else {
    log(`❌ Fallos en la suite de evaluación sintética: ${failed} escenarios no cumplieron las aserciones.`, colors.red);
    process.exit(1);
  }
}

// ==========================================
// Comando: Crear Feature (create)
// ==========================================
function cmdCreate(targetDir, featureName) {
  printBanner();
  if (!featureName) {
    log(`[-] Error: Debes especificar el nombre de la feature.`, colors.red);
    log(`    Ejemplo: agent create auth-login`, colors.yellow);
    return;
  }

  const specsDir = path.join(targetDir, 'specs');
  ensureDirSync(specsDir);

  // Calcular siguiente ID
  const existing = fs.readdirSync(specsDir, { withFileTypes: true })
    .filter(e => e.isDirectory())
    .map(e => e.name);

  let nextNum = 1;
  for (const name of existing) {
    const match = name.match(/^(\d+)-/);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num >= nextNum) nextNum = num + 1;
    }
  }

  const paddedId = String(nextNum).padStart(3, '0');
  const cleanName = featureName.toLowerCase().replace(/[^a-z0-9_-]/g, '-');
  const slug = `${paddedId}-${cleanName}`;
  const featureDir = path.join(specsDir, slug);

  if (fs.existsSync(featureDir)) {
    log(`[-] La feature ya existe en: ${featureDir}`, colors.red);
    return;
  }

  ensureDirSync(featureDir);
  const templatesDir = path.join(targetDir, '.specify', 'templates');
  const fallbackTemplatesDir = path.join(ROOT_DIR, '.specify', 'templates');
  const actualTemplatesDir = fs.existsSync(templatesDir) ? templatesDir : fallbackTemplatesDir;

  const dateStr = new Date().toISOString().split('T')[0];

  const files = [
    { src: 'spec.md', fallback: 'spec-template.md', dest: 'spec.md' },
    { src: 'plan.md', fallback: 'plan-template.md', dest: 'plan.md' },
    { src: 'tasks.md', fallback: 'tasks-template.md', dest: 'tasks.md' },
    { src: 'clarify.md', fallback: 'clarify-template.md', dest: 'clarify.md' },
    { src: 'checklist.md', fallback: 'checklist-template.md', dest: 'checklist.md' }
  ];

  for (const f of files) {
    let srcPath = path.join(actualTemplatesDir, f.src);
    if (!fs.existsSync(srcPath) && f.fallback) {
      srcPath = path.join(actualTemplatesDir, f.fallback);
    }
    if (fs.existsSync(srcPath)) {
      let content = fs.readFileSync(srcPath, 'utf8');
      content = content
        .replace(/\[NOMBRE_FEATURE\]/g, cleanName)
        .replace(/\[ID_FEATURE\]/g, paddedId)
        .replace(/\[YYYY-MM-DD\]/g, dateStr)
        .replace(/\{\{NOMBRE_FEATURE\}\}/g, cleanName)
        .replace(/\{\{NNN\}\}/g, paddedId)
        .replace(/\{\{FECHA\}\}/g, dateStr);
      fs.writeFileSync(path.join(featureDir, f.dest), content, 'utf8');
    }
  }

  log(`\n✨ Feature creada con éxito en: ${colors.bold}specs/${slug}${colors.reset}`, colors.green);
  log(`Archivos listos para trabajar:`);
  log(`  📄 specs/${slug}/spec.md       - Especificación funcional`);
  log(`  📐 specs/${slug}/plan.md       - Arquitectura técnica`);
  log(`  📝 specs/${slug}/tasks.md      - Desglose de tareas`);
  log(`  ❓ specs/${slug}/clarify.md    - Dudas y casos límite\n`);
}

// ==========================================
// Comando: Integración / Inicialización (init)
// ==========================================
async function cmdInit(options) {
  printBanner();
  const targetDir = options.targetDir;
  ensureDirSync(targetDir);

  log(`\n📂 Directorio Destino: ${colors.bold}${targetDir}${colors.reset}`);
  const context = detectProjectContext(targetDir);
  log(`🔍 Stack Detectado:   ${colors.magenta}${context.stack.name}${colors.reset}`);
  log(`📊 Estado de Proyecto: ${colors.cyan}${context.defaultMode === 'new' ? 'Proyecto Nuevo (Scaffold)' : 'Proyecto Existente (Integración Segura)'}${colors.reset}`);

  let chosenMode = options.mode === 'auto' ? context.defaultMode : options.mode;

  if (!options.nonInteractive) {
    log(`\nSelecciona el modo de instalación:`);
    log(`  [1] Integración Segura (Para proyectos existentes: CERO sobreescritura, añade Spec-Kit)`);
    log(`  [2] Proyecto Nuevo (Scaffold desde cero con estructura limpia)`);
    
    const defaultOption = chosenMode === 'existing' ? '1' : '2';
    const answer = await ask(`¿Opción deseada? [1/2] (por defecto: ${defaultOption}):`);
    if (answer === '1') chosenMode = 'existing';
    else if (answer === '2') chosenMode = 'new';
    else chosenMode = context.defaultMode;
  }

  log(`\n🚀 Ejecutando en modo: ${colors.bold}${chosenMode.toUpperCase()}${colors.reset}\n`);

  // 1. Instalar motor .specify
  const targetSpecify = path.join(targetDir, '.specify');
  ensureDirSync(path.join(targetSpecify, 'memory'));
  ensureDirSync(path.join(targetSpecify, 'templates'));
  ensureDirSync(path.join(targetSpecify, 'scripts'));
  copyDirRecursiveSync(SPECIFY_SRC_DIR, targetSpecify, options.force);
  log(`  [+] Instalado motor: .specify/`, colors.green);

  // 2. Instalar .github/prompts
  const targetPrompts = path.join(targetDir, '.github', 'prompts');
  ensureDirSync(targetPrompts);
  copyDirRecursiveSync(PROMPTS_SRC_DIR, targetPrompts, options.force);
  log(`  [+] Instalados prompts: .github/prompts/`, colors.green);

  // 3. Instalar specs/
  const targetSpecs = path.join(targetDir, 'specs');
  ensureDirSync(targetSpecs);
  const specsReadme = path.join(targetSpecs, 'README.md');
  if (!fs.existsSync(specsReadme) || options.force) {
    const srcSpecsReadme = path.join(ROOT_DIR, 'specs', 'README.md');
    if (fs.existsSync(srcSpecsReadme)) {
      fs.copyFileSync(srcSpecsReadme, specsReadme);
      log(`  [+] Creado: specs/README.md`, colors.green);
    }
  }

  // 4. Manejo de README.md
  const targetReadme = path.join(targetDir, 'README.md');
  if (chosenMode === 'new') {
    if (!fs.existsSync(targetReadme) || options.force) {
      let readmeTpl = fs.readFileSync(path.join(TEMPLATES_SCAFFOLD_DIR, 'README.project.template.md'), 'utf8');
      readmeTpl = readmeTpl
        .replace(/\{\{PROJECT_NAME\}\}/g, context.stack.projectName)
        .replace(/\{\{PROJECT_DESCRIPTION\}\}/g, `Proyecto desarrollado con arquitectura modular y metodología Spec-Driven Development (SDD).`)
        .replace(/\{\{PREREQUISITES\}\}/g, `Entorno configurado para ${context.stack.name}`)
        .replace(/\{\{INSTALL_COMMAND\}\}/g, `npm install`)
        .replace(/\{\{DEV_COMMAND\}\}/g, context.stack.devCmd)
        .replace(/\{\{BUILD_COMMAND\}\}/g, context.stack.buildCmd)
        .replace(/\{\{TEST_COMMAND\}\}/g, context.stack.testCmd)
        .replace(/\{\{LINT_COMMAND\}\}/g, context.stack.lintCmd)
        .replace(/\{\{PROJECT_TREE\}\}/g, `├── src/\n├── specs/\n├── .specify/\n└── PROJECT_LOG.md`);

      fs.writeFileSync(targetReadme, readmeTpl, 'utf8');
      log(`  [+] Generado README.md para nuevo proyecto`, colors.green);
    } else {
      log(`  [INFO] README.md ya existe. Se preserva sin cambios.`, colors.gray);
    }
  } else {
    const guideDest = path.join(targetDir, 'SPECKIT_GUIDE.md');
    const guideSrc = path.join(TEMPLATES_SCAFFOLD_DIR, 'SPECKIT_GUIDE.template.md');
    if (fs.existsSync(guideSrc) && (!fs.existsSync(guideDest) || options.force)) {
      fs.copyFileSync(guideSrc, guideDest);
      log(`  [+] Generado: SPECKIT_GUIDE.md (Tu README.md original ha sido protegido)`, colors.green);
    }
  }

  // 5. Manejo de AGENTS.md
  const targetAgents = path.join(targetDir, 'AGENTS.md');
  let agentsTpl = fs.readFileSync(path.join(TEMPLATES_SCAFFOLD_DIR, 'AGENTS.new.template.md'), 'utf8');
  agentsTpl = agentsTpl
    .replace(/\{\{PROJECT_NAME\}\}/g, context.stack.projectName)
    .replace(/\{\{DEV_COMMAND\}\}/g, context.stack.devCmd)
    .replace(/\{\{BUILD_COMMAND\}\}/g, context.stack.buildCmd)
    .replace(/\{\{LINT_COMMAND\}\}/g, context.stack.lintCmd)
    .replace(/\{\{TEST_COMMAND\}\}/g, context.stack.testCmd)
    .replace(/\{\{SRC_PATH\}\}/g, context.stack.srcPath)
    .replace(/\{\{COMPONENTS_PATH\}\}/g, context.stack.componentsPath)
    .replace(/\{\{SPECIALIZED_AGENTS_LIST\}\}/g, `| **SpecAgent** | Guardián de especificaciones y ciclo SDD | spec-kit |`)
    .replace(/\{\{PHASE_PLAN_CHECKLIST\}\}/g, `- [ ] Fase 1: Integración y validación de especificaciones base.\n- [ ] Fase 2: Desarrollo continuo guiado por specs.`);

  if (!fs.existsSync(targetAgents)) {
    fs.writeFileSync(targetAgents, agentsTpl, 'utf8');
    log(`  [+] Generado: AGENTS.md`, colors.green);
  } else {
    if (options.force) {
      if (options.backup) backupFile(targetAgents);
      fs.writeFileSync(targetAgents, agentsTpl, 'utf8');
      log(`  [!] Actualizado (force): AGENTS.md`, colors.yellow);
    } else {
      const agentsOverlayPath = path.join(targetDir, 'AGENTS.speckit.md');
      fs.writeFileSync(agentsOverlayPath, agentsTpl, 'utf8');
      log(`  [INFO] AGENTS.md ya existía. Generado 'AGENTS.speckit.md' para evitar sobreescritura.`, colors.yellow);
    }
  }

  // 6. Manejo de PROJECT_LOG.md
  const targetLog = path.join(targetDir, 'PROJECT_LOG.md');
  const dateStr = new Date().toISOString().split('T')[0];
  if (!fs.existsSync(targetLog)) {
    let logTpl = fs.readFileSync(path.join(TEMPLATES_SCAFFOLD_DIR, 'PROJECT_LOG.template.md'), 'utf8');
    logTpl = logTpl
      .replace(/\{\{INIT_DATE\}\}/g, dateStr)
      .replace(/\{\{INIT_EVENT\}\}/g, chosenMode === 'new' ? 'Inicialización de nuevo proyecto' : 'Integración no destructiva de Spec-Kit')
      .replace(/\{\{DETECTED_STACK\}\}/g, context.stack.name);
    fs.writeFileSync(targetLog, logTpl, 'utf8');
    log(`  [+] Generado: PROJECT_LOG.md`, colors.green);
  } else {
    const currentLog = fs.readFileSync(targetLog, 'utf8');
    if (!currentLog.includes(`[${dateStr}] - Integración de Spec-Kit`)) {
      const appendEntry = `\n\n## [${dateStr}] - Integración de Spec-Kit (SDD)\n- **Evento**: Integración segura de Spec-Kit.\n- **Stack**: ${context.stack.name}\n- **Estado**: Guardrails y plantillas activadas sin alterar archivos existentes.\n`;
      fs.appendFileSync(targetLog, appendEntry, 'utf8');
      log(`  [+] Añadida nueva entrada de evento a PROJECT_LOG.md`, colors.green);
    }
  }

  // 7. Manejo de .cursorrules
  const targetCursorRules = path.join(targetDir, '.cursorrules');
  const cursorRulesSnippet = `\n# Reglas de Proyecto - Spec-Kit & Elite Agent\n1. Idioma: Toda respuesta, commit y documentación DEBE ser en Español.\n2. Metodología: Spec-Driven Development (SDD). No escribir código sin spec/plan/tasks en specs/.\n3. Guardrails: No comitear ni abrir PRs con errores de lint, typecheck o tests.\n4. Consulta .specify/memory/constitution.md para principios inmutables.\n`;
  if (!fs.existsSync(targetCursorRules)) {
    fs.writeFileSync(targetCursorRules, cursorRulesSnippet.trim() + '\n', 'utf8');
    log(`  [+] Generado: .cursorrules`, colors.green);
  } else {
    const existingRules = fs.readFileSync(targetCursorRules, 'utf8');
    if (!existingRules.includes('Spec-Kit & Elite Agent')) {
      fs.appendFileSync(targetCursorRules, '\n' + cursorRulesSnippet, 'utf8');
      log(`  [+] Añadidas directrices Spec-Kit a .cursorrules existente`, colors.green);
    }
  }

  // 8. Workflow de release-please
  const srcWorkflow = path.join(WORKFLOWS_SRC_DIR, 'release-please.yml');
  const targetWorkflowDir = path.join(targetDir, '.github', 'workflows');
  const targetWorkflow = path.join(targetWorkflowDir, 'release-please.yml');
  if (fs.existsSync(srcWorkflow) && !fs.existsSync(targetWorkflow)) {
    ensureDirSync(targetWorkflowDir);
    fs.copyFileSync(srcWorkflow, targetWorkflow);
    log(`  [+] Configurado workflow: .github/workflows/release-please.yml`, colors.green);
  }

  // 9. Aprovisionar agentes, memoria y Starter Pack de skills en proyectos
  const targetAgentsDir = path.join(targetDir, '.agents');
  ensureDirSync(path.join(targetAgentsDir, 'skills'));
  ensureDirSync(path.join(targetAgentsDir, 'memory'));
  ensureDirSync(path.join(targetAgentsDir, 'handoffs'));
  ensureDirSync(path.join(targetAgentsDir, 'mcp'));
  const srcMcpTemplate = path.join(ROOT_DIR, '.agents', 'mcp', 'mcp_config.template.json');
  const srcMcpReadme = path.join(ROOT_DIR, '.agents', 'mcp', 'README.md');
  if (fs.existsSync(srcMcpTemplate)) {
    fs.copyFileSync(srcMcpTemplate, path.join(targetAgentsDir, 'mcp', 'mcp_config.template.json'));
  }
  if (fs.existsSync(srcMcpReadme)) {
    fs.copyFileSync(srcMcpReadme, path.join(targetAgentsDir, 'mcp', 'README.md'));
  }
  log('  [+] Aprovisionado Pack de Servidores MCP en .agents/mcp/', colors.green);

  const srcSkillsDir = path.join(ROOT_DIR, 'skills');
  if (fs.existsSync(srcSkillsDir)) {
    const starterSkills = ['find-skills', 'grill-me', 'frontend-design', 'web-design-guidelines', 'systematic-debugging', 'speckit-sdd'];
    starterSkills.forEach(s => {
      const srcFile = path.join(srcSkillsDir, s, 'SKILL.md');
      if (fs.existsSync(srcFile)) {
        const destDir = path.join(targetAgentsDir, 'skills', s);
        ensureDirSync(destDir);
        fs.copyFileSync(srcFile, path.join(destDir, 'SKILL.md'));
      }
    });
    log(`  [+] Aprovisionado Starter Pack de Skills en .agents/skills/`, colors.green);
  }

  const srcRegistry = path.join(ROOT_DIR, '.agents', 'registry.json');
  const targetRegistry = path.join(targetAgentsDir, 'registry.json');
  if (fs.existsSync(srcRegistry) && (!fs.existsSync(targetRegistry) || options.force)) {
    fs.copyFileSync(srcRegistry, targetRegistry);
    log(`  [+] Configurado registro de gobernanza v2.2.0: .agents/registry.json`, colors.green);
  }

  const srcMemory = path.join(ROOT_DIR, 'MEMORY.md');
  const targetMemory = path.join(targetDir, 'MEMORY.md');
  if (fs.existsSync(srcMemory) && !fs.existsSync(targetMemory)) {
    fs.copyFileSync(srcMemory, targetMemory);
    log(`  [+] Inicializado sistema de memoria: MEMORY.md`, colors.green);
  }

  log(`
${colors.green}${colors.bold}=======================================================
🎉 ¡Spec-Kit integrado con éxito en modo ${chosenMode.toUpperCase()}!
=======================================================${colors.reset}

${colors.yellow}Comandos disponibles en tu editor / IA:${colors.reset}
  👉 ${colors.bold}/specify (o /speckit.specify)${colors.reset}   - Crear una nueva especificación formal
  👉 ${colors.bold}/clarify (o /speckit.clarify)${colors.reset}   - Resolver ambigüedades técnicas
  👉 ${colors.bold}/plan (o /speckit.plan)${colors.reset}      - Diseñar arquitectura y contratos
  👉 ${colors.bold}/tasks (o /speckit.tasks)${colors.reset}     - Desglosar checklist de tareas atómicas
  👉 ${colors.bold}/implement (o /speckit.implement)${colors.reset} - Desarrollar paso a paso con TDD
  👉 ${colors.bold}/converge (o /speckit.converge)${colors.reset}  - Validar guardrails y preparar PR

${colors.yellow}Comandos CLI disponibles en la terminal:${colors.reset}
  👉 ${colors.bold}agent create <nombre>${colors.reset} - Crea una nueva spec con plantillas
  👉 ${colors.bold}agent verify${colors.reset}          - Comprueba el estado de todas las specs
  👉 ${colors.bold}agent install-skill${colors.reset}   - Instala la skill speckit-sdd en Antigravity
`);
}

// ==========================================
// Comando: Instalar Pack de Servidores MCP Esenciales (install-mcp-pack / mcp-pack)
// ==========================================
function cmdInstallMcpPack(options = {}) {
  printBanner();
  log('\n🔌 Instalando Pack de Servidores MCP Esenciales en Antigravity y Proyecto...\n', colors.cyan);

  const geminiConfigDir = path.join(os.homedir(), '.gemini', 'config');
  const mcpConfigFile = path.join(geminiConfigDir, 'mcp_config.json');
  const projectMcpDir = path.join(process.cwd(), '.agents', 'mcp');

  // 1. Aprovisionar plantilla y documentación local en el proyecto
  log('1. Aprovisionando catálogo y plantillas en el proyecto local (.agents/mcp/)...', colors.yellow);
  ensureDirSync(projectMcpDir);

  const templateSrc = path.join(ROOT_DIR, '.agents', 'mcp', 'mcp_config.template.json');
  const readmeSrc = path.join(ROOT_DIR, '.agents', 'mcp', 'README.md');

  if (fs.existsSync(templateSrc)) {
    fs.copyFileSync(templateSrc, path.join(projectMcpDir, 'mcp_config.template.json'));
    log('   [OK] Plantilla: .agents/mcp/mcp_config.template.json', colors.green);
  }
  if (fs.existsSync(readmeSrc)) {
    fs.copyFileSync(readmeSrc, path.join(projectMcpDir, 'README.md'));
    log('   [OK] Documentación: .agents/mcp/README.md', colors.green);
  }

  // 2. Fusión no destructiva en ~/.gemini/config/mcp_config.json
  log('\n2. Configurando servidores globales en Antigravity (~/.gemini/config/mcp_config.json)...', colors.yellow);
  ensureDirSync(geminiConfigDir);

  let currentConfig = { mcpServers: {} };
  if (fs.existsSync(mcpConfigFile)) {
    try {
      backupFile(mcpConfigFile);
      currentConfig = JSON.parse(fs.readFileSync(mcpConfigFile, 'utf8'));
      if (!currentConfig.mcpServers) currentConfig.mcpServers = {};
    } catch (e) {
      log('   [-] Archivo existente no es JSON válido. Creando respaldo y reinicializando...', colors.red);
      currentConfig = { mcpServers: {} };
    }
  }

  const essentialServers = {
    'chrome-devtools': {
      command: 'npx',
      args: ['-y', 'chrome-devtools-mcp@latest']
    },
    'context7': {
      serverUrl: 'https://mcp.context7.com/mcp',
      headers: {
        CONTEXT7_API_KEY: '${CONTEXT7_API_KEY}'
      }
    },
    'github': {
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-github'],
      env: {
        GITHUB_PERSONAL_ACCESS_TOKEN: '${GITHUB_PERSONAL_ACCESS_TOKEN}'
      }
    },
    'figma': {
      command: 'npx',
      args: ['-y', 'figma-developer-mcp'],
      env: {
        FIGMA_ACCESS_TOKEN: '${FIGMA_ACCESS_TOKEN}'
      }
    },
    'supabase': {
      serverUrl: 'https://mcp.supabase.com/mcp',
      headers: {
        Authorization: 'Bearer ${SUPABASE_ACCESS_TOKEN}'
      }
    }
  };

  let addedCount = 0;
  let preservedCount = 0;

  for (const [key, serverDef] of Object.entries(essentialServers)) {
    if (currentConfig.mcpServers[key]) {
      preservedCount++;
      log('   [PRESERVADO] Servidor \'' + key + '\' ya existe con configuración propia.', colors.gray);
    } else {
      currentConfig.mcpServers[key] = serverDef;
      addedCount++;
      log('   [AÑADIDO] Servidor \'' + key + '\' integrado.', colors.green);
    }
  }

  fs.writeFileSync(mcpConfigFile, JSON.stringify(currentConfig, null, 2) + '\n', 'utf8');

  log(`
${colors.green}${colors.bold}=======================================================
✅ Pack de Servidores MCP instalado con éxito:
   • chrome-devtools (Google)
   • context7 (Upstash)
   • github (GitHub)
   • figma (Figma)
   • supabase (Supabase)
   Servidores añadidos: ${addedCount} | Preservados intactos: ${preservedCount}
=======================================================${colors.reset}
`);
}

// ==========================================
// Comando: Instalar Starter Pack de Skills (install-skills-pack / pack)
// ==========================================
function cmdInstallSkillsPack(options = {}) {
  printBanner();
  log('\n🚀 Instalando Starter Pack de Skills (skills.sh) en Antigravity y Proyecto...\n', colors.cyan);

  const starterSkills = [
    'find-skills',
    'grill-me',
    'frontend-design',
    'web-design-guidelines',
    'systematic-debugging'
  ];

  const geminiConfigDir = path.join(os.homedir(), '.gemini', 'config');
  const antigravityDir = path.join(os.homedir(), '.gemini', 'antigravity');
  const projectAgentsSkillsDir = path.join(process.cwd(), '.agents', 'skills');

  log('1. Aprovisionando habilidades en el proyecto local (.agents/skills/)...', colors.yellow);
  ensureDirSync(projectAgentsSkillsDir);

  starterSkills.forEach(skillName => {
    const srcPath = path.join(ROOT_DIR, 'skills', skillName, 'SKILL.md');
    if (!fs.existsSync(srcPath)) {
      log('   [-] No se encontró origen para skill: ' + skillName, colors.red);
      return;
    }

    const localSkillDir = path.join(projectAgentsSkillsDir, skillName);
    ensureDirSync(localSkillDir);
    fs.copyFileSync(srcPath, path.join(localSkillDir, 'SKILL.md'));
    log('   [OK] Proyecto: .agents/skills/' + skillName + '/SKILL.md', colors.green);
  });

  log('\n2. Aprovisionando habilidades globales en Antigravity (~/.gemini/config y ~/.gemini/antigravity)...', colors.yellow);

  starterSkills.forEach(skillName => {
    const srcPath = path.join(ROOT_DIR, 'skills', skillName, 'SKILL.md');
    if (!fs.existsSync(srcPath)) return;

    // Config global 1: ~/.gemini/config/skills/<skill>/SKILL.md
    const targetGlobalDir1 = path.join(geminiConfigDir, 'skills', skillName);
    ensureDirSync(targetGlobalDir1);
    fs.copyFileSync(srcPath, path.join(targetGlobalDir1, 'SKILL.md'));

    // Config global 2: ~/.gemini/antigravity/skills/<skill>/SKILL.md
    const targetGlobalDir2 = path.join(antigravityDir, 'skills', skillName);
    ensureDirSync(targetGlobalDir2);
    fs.copyFileSync(srcPath, path.join(targetGlobalDir2, 'SKILL.md'));

    log('   [OK] Global Antigravity: ' + skillName, colors.green);
  });

  log(`
${colors.green}${colors.bold}=======================================================
✅ Starter Pack de Skills instalado con éxito:
   • find-skills (Vercel Labs)
   • grill-me (Matt Pocock)
   • frontend-design (Anthropic)
   • web-design-guidelines (Vercel Labs)
   • systematic-debugging (Jesse Vincent / obra)
=======================================================${colors.reset}
`);
}

// ==========================================
// Comando: Instalar Skill en Antigravity (install-skill)
// ==========================================
function cmdInstallSkill() {
  printBanner();
  log(`\n🚀 Instalando Skill Global de Antigravity (speckit-sdd)...\n`, colors.cyan);

  const skillSource = path.join(ROOT_DIR, 'skills', 'speckit-sdd', 'SKILL.md');
  if (!fs.existsSync(skillSource)) {
    log(`[-] No se encontró la skill en: ${skillSource}`, colors.red);
    process.exit(1);
  }

  const geminiConfigDir = path.join(os.homedir(), '.gemini', 'config');
  const targetSkillsDir = path.join(geminiConfigDir, 'skills', 'speckit-sdd');
  const antigravitySkillsDir = path.join(os.homedir(), '.gemini', 'antigravity', 'skills', 'speckit-sdd');

  log(`1. Verificando directorio global de Antigravity (~/.gemini/config)...`, colors.yellow);
  ensureDirSync(targetSkillsDir);
  ensureDirSync(antigravitySkillsDir);

  log(`2. Copiando archivo de Skill (SKILL.md) en directorios globales...`, colors.yellow);
  fs.copyFileSync(skillSource, path.join(targetSkillsDir, 'SKILL.md'));
  fs.copyFileSync(skillSource, path.join(antigravitySkillsDir, 'SKILL.md'));
  log(`   [OK] Skill instalada en: ${targetSkillsDir}`, colors.green);
  log(`   [OK] Skill instalada en: ${antigravitySkillsDir}`, colors.green);

  log(`3. Configurando directrices globales en GEMINI.md...`, colors.yellow);
  const globalRulesFile = path.join(geminiConfigDir, 'GEMINI.md');
  const ruleBlock = `
## Metodología Spec-Driven Development & Elite Agent v2 (GitHub Spec Kit)
- **Detección y Bootstrapping:** Si el espacio de trabajo actual contiene \`.specify/\`, \`specs/\` o \`.agents/registry.json\`, el agente entrará automáticamente en modo **Elite Agent Bootstrap v2 (SDD)**. Si no los contiene y el usuario solicita inicializar gobernanza o arrancar un proyecto, ejecutar o sugerir: \`npx --yes github:BeLc3bU/elite-agent-bootstrap init\`.
- **Lectura Constitucional:** Es obligatorio leer \`.specify/memory/constitution.md\` antes de proponer cambios de arquitectura o código.
- **Separación de Autoridad (Agent ≠ Authority):** Ningún agente puede auto-aprobarse ni realizar merge directo sin aprobación humana. Consultar \`.agents/registry.json\` para roles, permisos y restricciones de rutas.
- **Prohibición de Vibe Coding:** No escribir ni modificar código de producción sin contar con la especificación aprobada en \`specs/NNN-<feature>/\` (\`spec.md\`, \`plan.md\`, \`tasks.md\`).
- **Protocolo de Traspasos y Evidencias:** Traspasos documentados en \`.agents/handoffs/\` y comprobantes de ejecución en \`.evidence/\`. No marcar \`[x]\` sin comprobante de verificación exitoso.
- **Enrutamiento y Decisiones:** Usar \`agent route "<tarea>"\` o la capa de decisión (\`lib/adapters/DecisionProvider.js\` / Kev / Jev) para clasificar y asignar roles.
- **Activación de Skill:** Usar la skill \`speckit-sdd\` para orquestar las fases: specify -> plan -> tasks -> implement -> converge.
`;

  let currentContent = '';
  if (fs.existsSync(globalRulesFile)) {
    currentContent = fs.readFileSync(globalRulesFile, 'utf8');
  }

  // Limpiar bloque antiguo si existía
  if (currentContent.includes('## Metodología Spec-Driven Development')) {
    currentContent = currentContent.replace(/## Metodología Spec-Driven Development[\s\S]*?(?=\n## |\n# |$)/g, '').trim();
  }

  const finalContent = currentContent
    ? currentContent + '\n' + ruleBlock.trim() + '\n'
    : '# Reglas Globales de Antigravity\n' + ruleBlock.trim() + '\n';

  fs.writeFileSync(globalRulesFile, finalContent, 'utf8');
  log(`   [OK] Directrices SDD v2 actualizadas en: ${globalRulesFile}`, colors.green);

  log(`
${colors.green}${colors.bold}=======================================================
✅ Instalación completada con éxito.
Cualquier sesión de Antigravity en este ordenador
cuenta ahora con la skill 'speckit-sdd' activa.
=======================================================${colors.reset}
`);
}

// ==========================================
// Comando: Sincronizar / Actualizar en GitHub (sync / push)
// ==========================================
async function cmdSync(targetDir, commitMsg) {
  printBanner();
  log('\n🔄 Sincronizando repositorio con GitHub...\n', colors.cyan);

  const gitDir = path.join(targetDir, '.git');
  if (!fs.existsSync(gitDir)) {
    log('❌ Error: No se encontró un repositorio Git en ' + targetDir, colors.red);
    process.exit(1);
  }

  // 1. Verificar Quality Gates antes de subir
  log('1. Ejecutando Quality Gates de especificaciones...', colors.yellow);
  try {
    cmdVerify(targetDir);
    log('   [OK] Especificaciones verificadas correctamente.', colors.green);
  } catch (e) {
    log('❌ Falló la verificación de specs: ' + e.message, colors.red);
    process.exit(1);
  }

  // 2. Comprobar estado de Git
  log('\n2. Verificando estado del árbol de trabajo de Git...', colors.yellow);
  let statusOutput = '';
  try {
    statusOutput = execSync('git status --porcelain', { cwd: targetDir, encoding: 'utf8' }).trim();
  } catch (e) {
    log('❌ Error al consultar git status: ' + e.message, colors.red);
    process.exit(1);
  }

  if (!statusOutput) {
    log('ℹ️ No hay cambios locales pendientes de commit.', colors.green);
    log('3. Comprobando y enviando commits pendientes al remoto (git push)...', colors.yellow);
    try {
      execSync('git push', { cwd: targetDir, stdio: 'inherit' });
      log('\n✅ Repositorio sincronizado exitosamente con GitHub.', colors.green);
    } catch (e) {
      log('❌ Error al hacer git push: ' + e.message, colors.red);
      process.exit(1);
    }
    return;
  }

  log('   Cambios detectados:\n' + statusOutput.split('\n').map(l => '   ' + l).join('\n'), colors.gray);

  // 3. Mensaje de commit
  let finalMsg = commitMsg;
  if (!finalMsg) {
    finalMsg = await ask('\n💬 Introduce el mensaje de commit (dejar vacío para auto: "feat: actualización de specs y memoria"):');
    if (!finalMsg) {
      finalMsg = 'feat: actualización de especificaciones, memoria y gobernanza';
    }
  }

  // 4. Agregar, commitear y pushear
  log('\n3. Creando commit y enviando a GitHub...', colors.yellow);
  try {
    execSync('git add -A', { cwd: targetDir, stdio: 'inherit' });
    log('   [OK] Archivos agregados (git add -A)', colors.green);

    const safeMsg = finalMsg.replace(/"/g, '\"');
    execSync('git commit -m "' + safeMsg + '"', { cwd: targetDir, stdio: 'inherit' });
    log('   [OK] Commit creado con éxito', colors.green);

    log('4. Subiendo cambios a GitHub (git push)...', colors.yellow);
    execSync('git push', { cwd: targetDir, stdio: 'inherit' });
    log('\n✅ Repositorio actualizado y subido exitosamente a GitHub.', colors.green);
  } catch (e) {
    log('\n❌ Error durante la sincronización Git: ' + e.message, colors.red);
    process.exit(1);
  }
}

// ==========================================
// Enrutamiento Principal CLI
// ==========================================
async function main() {
  const rawArgs = process.argv.slice(2);
  const command = rawArgs[0] || 'init';

  if (command === '--help' || command === '-h' || command === 'help') {
    printBanner();
    log(`
Uso:
  agent [comando] [opciones]
  speckit [comando] [opciones]

Comandos:
  init [directorio]      Inicializa o integra Spec-Kit en un proyecto (por defecto)
  create <nombre>        Crea una nueva especificación numerada en specs/
  verify                 Comprueba el estado y avance de todas las especificaciones
  registry [list|val]    Consulta ('list') o valida ('validate') el catálogo de agentes
  handoff [list|val]     Lista ('list') o valida ('validate') traspasos entre agentes
  evidence [list|ver]    Lista ('list') o audita ('verify') comprobantes de ejecución
  memory [list|val|...]  Gestiona la memoria persistente ('list', 'validate', 'search', 'show', 'archive')
  route <descripción>    Enruta una tarea al agente idóneo mediante la capa de decisión
  eval                   Ejecuta la suite de evaluación sintética de agentes (.evals/)
  sync [mensaje]         Audita, commitea y sube los cambios a GitHub (push)
  install-skill          Instala la skill speckit-sdd en Antigravity (~/.gemini/config)
  install-skills-pack    Instala el Starter Pack de 5 skills (skills.sh) local y global
  install-mcp-pack       Instala y fusiona el pack de 5 MCPs esenciales en Antigravity
  version                Muestra la versión instalada

Opciones de 'init':
  -t, --target <dir>     Directorio destino (por defecto: carpeta actual)
  -m, --mode <mode>      'auto' | 'new' | 'existing' (por defecto: 'auto')
  -f, --force            Sobrescribe archivos
  -y, --yes              Modo no interactivo
      --no-backup        No genera copias .bak

Ejemplos:
  agent init                          # Asistente interactivo
  agent create auth-jwt               # Crea specs/001-auth-jwt/
  agent verify                        # Valida avance de tareas
  agent registry                      # Lista catálogo oficial de agentes
  agent registry validate             # Valida registro contra esquema JSON
  agent handoff validate              # Valida protocolo de handoffs
  agent evidence verify               # Audita comprobantes de ejecución
  agent route "escribir tests"        # Enruta tarea a agente idóneo
  agent eval                          # Ejecuta suite sintética (.evals)
  agent install-skill                 # Instala skill en Antigravity
`);
    process.exit(0);
  }

  if (command === '--version' || command === '-v' || command === 'version') {
    const pkg = require('../package.json');
    log(`v${pkg.version}`);
    process.exit(0);
  }

  if (command === 'sync' || command === 'push') {
    const commitMsg = rawArgs.slice(1).join(' ');
    await cmdSync(process.cwd(), commitMsg);
    return;
  }

  if (command === 'install-mcp-pack' || command === 'mcp-pack' || command === 'mcp') {
    cmdInstallMcpPack();
    return;
  }

  if (command === 'install-skills-pack' || command === 'pack' || command === 'skills-pack') {
    cmdInstallSkillsPack();
    return;
  }

  if (command === 'install-skill' || command === 'install') {
    cmdInstallSkill();
    return;
  }

  if (command === 'registry' || command === 'agents') {
    const subAction = rawArgs[1] || 'list';
    const targetDir = rawArgs[2] ? path.resolve(rawArgs[2]) : process.cwd();
    cmdRegistry(targetDir, subAction);
    return;
  }

  if (command === 'handoff' || command === 'handoffs') {
    const subAction = rawArgs[1] || 'list';
    const targetDir = rawArgs[2] ? path.resolve(rawArgs[2]) : process.cwd();
    cmdHandoff(targetDir, subAction);
    return;
  }

  if (command === 'evidence' || command === 'evidences') {
    const subAction = rawArgs[1] || 'verify';
    const targetDir = rawArgs[2] ? path.resolve(rawArgs[2]) : process.cwd();
    cmdEvidence(targetDir, subAction);
    return;
  }

  if (command === 'memory' || command === 'mem') {
    const subAction = rawArgs[1] || 'list';
    const targetDir = process.cwd();
    cmdMemory(targetDir, subAction, rawArgs);
    return;
  }

  if (command === 'route' || command === 'decide') {
    const query = rawArgs.slice(1).join(' ');
    await cmdRoute(process.cwd(), query);
    return;
  }

  if (command === 'eval' || command === 'evals') {
    const targetDir = rawArgs[1] ? path.resolve(rawArgs[1]) : process.cwd();
    await cmdEval(targetDir);
    return;
  }

  if (command === 'verify' || command === 'check') {
    const targetDir = rawArgs[1] ? path.resolve(rawArgs[1]) : process.cwd();
    cmdVerify(targetDir);
    return;
  }

  if (command === 'create' || command === 'new') {
    const featureName = rawArgs[1];
    cmdCreate(process.cwd(), featureName);
    return;
  }

  // Parseo de opciones para 'init'
  const options = {
    targetDir: process.cwd(),
    mode: 'auto',
    force: false,
    backup: true,
    nonInteractive: false
  };

  const initArgs = command === 'init' ? rawArgs.slice(1) : rawArgs;
  for (let i = 0; i < initArgs.length; i++) {
    const arg = initArgs[i];
    if (arg === '--force' || arg === '-f') options.force = true;
    else if (arg === '--no-backup') options.backup = false;
    else if (arg === '--yes' || arg === '-y') options.nonInteractive = true;
    else if (arg === '--mode' || arg === '-m') options.mode = initArgs[++i] || 'auto';
    else if (arg === '--target' || arg === '-t') options.targetDir = path.resolve(initArgs[++i] || process.cwd());
    else if (!arg.startsWith('-')) options.targetDir = path.resolve(arg);
  }

  await cmdInit(options);
}

main().catch((err) => {
  log(`\n❌ Error: ${err.message}`, colors.red);
  process.exit(1);
});
