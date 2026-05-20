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
