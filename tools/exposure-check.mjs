import fs from 'fs';

console.log('');
console.log('=======================================');
console.log('      BAYOUOPS EXPOSURE CHECK');
console.log('=======================================');
console.log('');

const exposure =
  JSON.parse(
    fs.readFileSync(
      'data/exposure/current-exposure.json',
      'utf8'
    )
  );

const sevRank = {
  Sev1: 1,
  Sev2: 2,
  Sev3: 3
};

exposure.sort((a, b) =>
  sevRank[a.severity] - sevRank[b.severity]
);

console.table(exposure);

const total = exposure.length;

const sev1 =
  exposure.filter(x => x.severity === 'Sev1').length;

const sev2 =
  exposure.filter(x => x.severity === 'Sev2').length;

const sev3 =
  exposure.filter(x => x.severity === 'Sev3').length;

console.log('');
console.log('---------------------------------------');
console.log('Exposure Summary');
console.log('---------------------------------------');
console.log(`Total Findings : ${total}`);
console.log(`Sev1 Findings  : ${sev1}`);
console.log(`Sev2 Findings  : ${sev2}`);
console.log(`Sev3 Findings  : ${sev3}`);
console.log('');

console.log('[SUCCESS] Exposure visibility generated.');
console.log('');
