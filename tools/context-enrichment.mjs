import fs from 'fs';

const exposure =
  JSON.parse(
    fs.readFileSync(
      'build/recommendations.json',
      'utf8'
    )
  );

const context =
  JSON.parse(
    fs.readFileSync(
      'data/context/site-context.json',
      'utf8'
    )
  );

const enriched =
  exposure.map(item => {

    const ctx =
      context.find(
        x => x.host === item.host
      ) || {};

    return {
      ...item,
      context: ctx
    };
  });

fs.writeFileSync(
  'build/context-enriched.json',
  JSON.stringify(
    enriched,
    null,
    2
  )
);

console.log('');
console.log(
  '[SUCCESS] Context enrichment complete.'
);

console.log('');
console.log(
  'build/context-enriched.json'
);

console.log('');
