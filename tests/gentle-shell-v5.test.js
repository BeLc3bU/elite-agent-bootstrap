const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { execFileSync } = require('node:child_process');

const ROOT_DIR = path.resolve(__dirname, '..');
const CLI_PATH = path.join(ROOT_DIR, 'bin', 'cli.js');

const {
  SENSITIVE_PATH_PATTERNS,
  isSensitivePath,
  isEnvFilePath,
  classifyDestructiveCommand,
  findConflictMarkersInText,
  validateEditSurfaces,
  isPathInSurfaces
} = require('../lib/guards/GentleGuards');

const {
  DeterministicDecisionProvider,
  HIGH_RISK_ITEMS
} = require('../lib/adapters/DecisionProvider');

test('GentleGuards: política compartida de rutas sensibles (incluye .envrc y .netrc)', () => {
  assert.ok(Array.isArray(SENSITIVE_PATH_PATTERNS) && SENSITIVE_PATH_PATTERNS.length >= 10);

  const blocked = [
    '.env',
    '.env.local',
    '.env.production',
    '.envrc',
    '.netrc',
    '.ssh/id_ed25519',
    '.aws/credentials',
    '.config/gh/hosts.yml',
    'secrets/token.txt',
    'config/auth.json',
    'certs/server.pem',
    'keys/private.key',
    '.credentials/oauth.json'
  ];
  for (const p of blocked) {
    assert.equal(isSensitivePath(p), true, `Debió bloquear ruta sensible: ${p}`);
  }

  const allowed = [
    'src/index.js',
    'README.md',
    'docs/env-guide.md',
    'odd/tasks/009-gentle-shell-v5-sync.md'
  ];
  for (const p of allowed) {
    assert.equal(isSensitivePath(p), false, `No debió bloquear ruta segura: ${p}`);
  }

  assert.equal(isEnvFilePath('.env.local'), true);
  assert.equal(isEnvFilePath('.env/id_rsa'), false);
  assert.equal(isEnvFilePath('.ssh/.env'), false);
});

test('GentleGuards: clasificador de comandos destructivos (git, filesystem, database)', () => {
  const forcePush = classifyDestructiveCommand('git push --force origin main');
  assert.equal(forcePush.kind, 'git');
  assert.equal(forcePush.hardDeny, true);
  assert.equal(forcePush.confirmationPolicy, 'deny');

  const rmCmd = classifyDestructiveCommand('rm -rf ./dist');
  assert.equal(rmCmd.kind, 'filesystem');
  assert.equal(rmCmd.hardDeny, false);
  assert.equal(rmCmd.confirmationPolicy, 'allow_once');

  const dbCmd = classifyDestructiveCommand('DROP TABLE usuarios;');
  assert.equal(dbCmd.kind, 'database');
  assert.equal(dbCmd.hardDeny, true);

  assert.equal(classifyDestructiveCommand('git status && npm test'), null);
  assert.equal(classifyDestructiveCommand('echo "rm -rf /tmp/fake"'), null);
});

test('GentleGuards: detector de marcadores de conflicto', () => {
  const dirty = [
    'const a = 1;',
    '<<<<<<< HEAD',
    'const b = 2;',
    '=======',
    'const b = 3;',
    '>>>>>>> feature/x'
  ].join('\n');

  const lines = findConflictMarkersInText(dirty);
  assert.deepEqual(lines, [2, 4, 6]);
  assert.deepEqual(findConflictMarkersInText('const clean = true;\n'), []);
});

test('GentleGuards: validación de Allowed edit surfaces y coincidencia de rutas', () => {
  assert.equal(validateEditSurfaces([]).valid, false);
  assert.equal(validateEditSurfaces(['.']).valid, false);
  assert.equal(validateEditSurfaces(['/etc/passwd']).valid, false);
  assert.equal(validateEditSurfaces(['C:\\Windows\\System32']).valid, false);

  const ok = validateEditSurfaces(['lib/guards/*.js', 'tests/gentle-shell-v5.test.js']);
  assert.equal(ok.valid, true);

  assert.equal(isPathInSurfaces('lib/guards/GentleGuards.js', ok.surfaces), true);
  assert.equal(isPathInSurfaces('tests/gentle-shell-v5.test.js', ok.surfaces), true);
  assert.equal(isPathInSurfaces('bin/cli.js', ok.surfaces), false);
});

test('DecisionProvider: mantiene enrutamiento base y añade rúbrica ODD v5 (Task Size + High Risk 1-6)', async () => {
  assert.equal(Object.keys(HIGH_RISK_ITEMS).length, 6);

  const provider = new DeterministicDecisionProvider(path.join(ROOT_DIR, '.agents', 'registry.json'));

  const smallDecision = await provider.decide('Corregir errata tipográfica en README.md');
  assert.equal(smallDecision.task_size, 'small');
  assert.equal(smallDecision.risk_line, 'Risk: none');
  assert.equal(smallDecision.route, 'inline');

  const highRiskAuth = await provider.decide('Modificar verificación de tokens JWT y credenciales en auth');
  assert.equal(highRiskAuth.escalate, true);
  assert.ok(highRiskAuth.risk_items.includes(2));
  assert.match(highRiskAuth.risk_line, /^Risk: item 2/);

  const fullDelegation = await provider.decide('Implementar nuevo endpoint de pagos', { workflowMode: 'full-delegation' });
  assert.equal(fullDelegation.workflow_mode, 'full-delegation');
  assert.equal(fullDelegation.route, 'delegated');
});

test('CLI Universal: create, verify, init y guard funcionan con odd/tasks sin depender de .specify/', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'elite-odd-test-'));
  try {
    execFileSync(process.execPath, [CLI_PATH, 'init', tmpDir, '--yes', '--mode', 'new'], { encoding: 'utf8' });
    assert.equal(fs.existsSync(path.join(tmpDir, 'odd', 'tasks')), true);
    assert.equal(fs.existsSync(path.join(tmpDir, '.agents', 'registry.json')), true);
    assert.equal(fs.existsSync(path.join(tmpDir, 'MEMORY.md')), true);
    assert.equal(fs.existsSync(path.join(tmpDir, '.evals', 'scenarios', 'routing-scenarios.json')), true);

    execFileSync(process.execPath, [CLI_PATH, 'create', 'auth-oauth'], { cwd: tmpDir, encoding: 'utf8' });
    const createdDoc = path.join(tmpDir, 'odd', 'tasks', '001-auth-oauth.md');
    assert.equal(fs.existsSync(createdDoc), true);

    const docContent = fs.readFileSync(createdDoc, 'utf8');
    assert.match(docContent, /^# Feature: 001-auth-oauth/m);
    assert.match(docContent, /^## Specs/m);
    assert.match(docContent, /^## Tasks/m);
    assert.match(docContent, /^## Log/m);

    const verifyOut = execFileSync(process.execPath, [CLI_PATH, 'verify', tmpDir], { encoding: 'utf8' });
    assert.match(verifyOut, /001-auth-oauth/);
    assert.match(verifyOut, /0 \/ 1 completadas/);

    const safeGuard = execFileSync(process.execPath, [CLI_PATH, 'guard', '--cmd', 'git status'], { encoding: 'utf8' });
    assert.match(safeGuard, /OK|seguro/i);

    assert.throws(() => {
      execFileSync(process.execPath, [CLI_PATH, 'guard', '--path', '.envrc'], { encoding: 'utf8' });
    });

    assert.throws(() => {
      execFileSync(process.execPath, [CLI_PATH, 'guard', '--cmd', 'DROP TABLE users;'], { encoding: 'utf8' });
    });

    const surfacesOk = execFileSync(
      process.execPath,
      [CLI_PATH, 'guard', '--surfaces', 'lib/**,tests/*.js', '--check', 'lib/guards/GentleGuards.js'],
      { encoding: 'utf8' }
    );
    assert.match(surfacesOk, /Allowed edit surfaces válidas/);

    assert.throws(() => {
      execFileSync(
        process.execPath,
        [CLI_PATH, 'guard', '--surfaces', 'lib/**', '--check', 'bin/cli.js'],
        { encoding: 'utf8' }
      );
    });

    fs.writeFileSync(path.join(tmpDir, 'conflict.js'), '<<<<<<< HEAD\nconst x=1;\n=======\nconst x=2;\n>>>>>>> main\n', 'utf8');
    assert.throws(() => {
      execFileSync(process.execPath, [CLI_PATH, 'guard', '--conflicts'], { cwd: tmpDir, encoding: 'utf8' });
    });

    const routeOut = execFileSync(
      process.execPath,
      [CLI_PATH, 'route', 'Implementar endpoint de pagos', '--full-delegation'],
      { cwd: ROOT_DIR, encoding: 'utf8' }
    );
    assert.match(routeOut, /full-delegation/);
    assert.match(routeOut, /Ruta: delegated/);
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});
