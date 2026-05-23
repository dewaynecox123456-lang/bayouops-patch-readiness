import { execSync } from 'child_process';

function run(step, cmd) {

  console.log('');
  console.log(
    `[INFO] ${step}`
  );
  console.log('');

  execSync(cmd, {
    stdio: 'inherit'
  });
}

run(
  'Importing inventory...',
  'node tools/inventory-import.mjs'
);

run(
  'Detecting platform...',
  './tools/platform-detect.sh'
);

run(
  'Collecting reboot intelligence...',
  './tools/reboot-adapter.sh'
);

run(
  'Collecting Linux operational evidence...',
  './tools/linux-health-collector.sh'
);

run(
  'Generating Linux operational findings...',
  'node tools/linux-findings-engine.mjs'
);

run(
  'Running exposure correlation...',
  'node tools/exposure-correlation.mjs'
);

run(
  'Running inventory validation...',
  'node tools/inventory-validation.mjs'
);


run(
  'Running recommendation engine...',
  'node tools/recommendation-engine.mjs'
);

run(
  'Enriching operational ownership context...',
  'node tools/ownership-enrichment.mjs'
);

run(
  'Scoring operational readiness...',
  'node tools/readiness-scoring-engine.mjs'
);


run(
  'Running context enrichment...',
  'node tools/context-enrichment.mjs'
);

run(
  'Running operational priority engine...',
  'node tools/operational-priority-engine.mjs'
);

run(
  'Generating exposure dashboard...',
  'node tools/generate-exposure-dashboard.mjs'
);

run(
  'Generating trend dashboard...',
  'node tools/generate-trend-dashboard.mjs'
);

run(
  'Generating NOC triage dashboard...',
  'node tools/generate-noc-dashboard.mjs'
);

run(
  'Generating executive operational dashboard...',
  'node tools/generate-executive-dashboard.mjs'
);

console.log('');
console.log(
  '[SUCCESS] Operational cycle complete.'
);
console.log('');
