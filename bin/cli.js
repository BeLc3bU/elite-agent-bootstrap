#!/usr/bin/env node

/**
 * Elite Agent + Spec-Kit Universal CLI
 * Instalador y orquestador seguro de Spec-Driven Development (SDD)
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

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
// Parseo de Argumentos CLI
// ==========================================
const args = process.argv.slice(2);
const options = {
  targetDir: process.cwd(),
  mode: 'auto', // 'auto' | 'new' | 'existing'
  force: false,
  backup: true,
  nonInteractive: false,
  help: false,
  version: false
};

for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  if (arg === '--help' || arg === '-h') {
    options.help = true;
  } else if (arg === '--version' || arg === '-v') {
    options.version = true;
  } else if (arg === '--force' || arg === '-f') {
    options.force = true;
  } else if (arg === '--no-backup') {
    options.backup = false;
  } else if (arg === '--yes' || arg === '-y') {
    options.nonInteractive = true;
  } else if (arg === '--mode' || arg === '-m') {
    options.mode = args[++i] || 'auto';
  } else if (arg === '--target' || arg === '-t') {
    options.targetDir = path.resolve(args[++i] || process.cwd());
  } else if (!arg.startsWith('-')) {
    options.targetDir = path.resolve(arg);
  }
}

if (options.help) {
  printBanner();
  log(`
Uso:
  npx elite-speckit [opciones] [directorio-destino]
  node bin/cli.js [opciones] [directorio-destino]

Opciones:
  -t, --target <dir>    Directorio destino del proyecto (por defecto: carpeta actual)
  -m, --mode <mode>     Modo de instalación: 'auto' | 'new' | 'existing' (por defecto: 'auto')
  -f, --force           Sobrescribe archivos incluso si ya existen
  -y, --yes             Modo no interactivo (acepta valores por defecto sin preguntar)
      --no-backup       No crea copias .bak de archivos existentes
  -h, --help            Muestra esta ayuda
  -v, --version         Muestra la versión instalada

Ejemplos:
  npx elite-speckit                        # Ejecuta asistente interactivo en la carpeta actual
  npx elite-speckit ../mi-app-existente    # Integra Spec-Kit en un proyecto existente
  npx elite-speckit ./nuevo-proyecto -m new -y  # Inicializa un proyecto nuevo desde cero
`);
  process.exit(0);
}

if (options.version) {
  const pkg = require('../package.json');
  log(`v${pkg.version}`);
  process.exit(0);
}

// ==========================================
// Rutas de Plantillas
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
// Detección de Stack y Estado de Proyecto
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

  // Node / Web
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
  } 
  // Python
  else if (fs.existsSync(path.join(targetDir, 'pyproject.toml')) || fs.existsSync(path.join(targetDir, 'requirements.txt'))) {
    stack.name = 'Python (UV / Poetry / Pytest)';
    stack.devCmd = 'uv run python main.py';
    stack.buildCmd = 'uv build';
    stack.lintCmd = 'ruff check .';
    stack.testCmd = 'pytest';
    stack.srcPath = fs.existsSync(path.join(targetDir, 'app')) ? 'app/' : 'src/';
  } 
  // Rust
  else if (fs.existsSync(path.join(targetDir, 'Cargo.toml'))) {
    stack.name = 'Rust (Cargo)';
    stack.devCmd = 'cargo run';
    stack.buildCmd = 'cargo build --release';
    stack.lintCmd = 'cargo clippy';
    stack.testCmd = 'cargo test';
  } 
  // Go
  else if (fs.existsSync(path.join(targetDir, 'go.mod'))) {
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
// Flujo Principal de Ejecución
// ==========================================
async function main() {
  printBanner();
  
  const targetDir = options.targetDir;
  ensureDirSync(targetDir);
  
  log(`\n📂 Directorio Destino: ${colors.bold}${targetDir}${colors.reset}`);
  
  const context = detectProjectContext(targetDir);
  log(`🔍 Stack Detectado:   ${colors.magenta}${context.stack.name}${colors.reset}`);
  log(`📊 Estado de Proyecto: ${colors.cyan}${context.defaultMode === 'new' ? 'Proyecto Nuevo (Scaffold)' : 'Proyecto Existente (Integración Segura)'}${colors.reset}`);

  let chosenMode = options.mode;
  if (chosenMode === 'auto') {
    chosenMode = context.defaultMode;
  }

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

  // 1. Instalar estructura núcleo .specify
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
        .replace(/\{\{PREREQUISITES\}\}/g, `Node.js >= 18, pnpm o npm`)
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
    // Modo Proyecto Existente: NUNCA pisar README.md
    const guideDest = path.join(targetDir, 'SPECKIT_GUIDE.md');
    const guideSrc = path.join(TEMPLATES_SCAFFOLD_DIR, 'SPECKIT_GUIDE.template.md');
    if (fs.existsSync(guideSrc) && (!fs.existsSync(guideDest) || options.force)) {
      fs.copyFileSync(guideSrc, guideDest);
      log(`  [+] Generado: SPECKIT_GUIDE.md (Preservando tu README.md original)`, colors.green);
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
    // Append seguro
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

  // 8. Manejo de .github/workflows/release-please.yml
  const srcWorkflow = path.join(WORKFLOWS_SRC_DIR, 'release-please.yml');
  const targetWorkflowDir = path.join(targetDir, '.github', 'workflows');
  const targetWorkflow = path.join(targetWorkflowDir, 'release-please.yml');
  if (fs.existsSync(srcWorkflow) && !fs.existsSync(targetWorkflow)) {
    ensureDirSync(targetWorkflowDir);
    fs.copyFileSync(srcWorkflow, targetWorkflow);
    log(`  [+] Configurado workflow: .github/workflows/release-please.yml`, colors.green);
  }

  // Finalización
  log(`
${colors.green}${colors.bold}=======================================================
🎉 ¡Spec-Kit integrado con éxito en modo ${chosenMode.toUpperCase()}!
=======================================================${colors.reset}

${colors.yellow}Comandos disponibles en el chat de tu IA:${colors.reset}
  👉 ${colors.bold}/speckit.specify${colors.reset}   - Crear una nueva especificación formal
  👉 ${colors.bold}/speckit.clarify${colors.reset}   - Resolver ambigüedades técnicas
  👉 ${colors.bold}/speckit.plan${colors.reset}      - Diseñar arquitectura y contratos
  👉 ${colors.bold}/speckit.tasks${colors.reset}     - Desglosar checklist de tareas atómicas
  👉 ${colors.bold}/speckit.implement${colors.reset} - Desarrollar paso a paso con TDD
  👉 ${colors.bold}/speckit.converge${colors.reset}  - Validar guardrails y preparar PR
`);
}

main().catch((err) => {
  log(`\n❌ Error durante la instalación: ${err.message}`, colors.red);
  process.exit(1);
});
