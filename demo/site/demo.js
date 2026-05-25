const dataPaths = {
  scenarios: [
    '../scenarios/DEMO_healthy-environment.json',
    '../scenarios/DEMO_medium-risk-environment.json',
    '../scenarios/DEMO_critical-risk-environment.json'
  ],
  readiness: '../data/DEMO_readiness-scoring.csv',
  patch: '../data/DEMO_patch-compliance.csv',
  ssl: '../data/DEMO_ssl-status.csv',
  unsupported: '../data/DEMO_unsupported-os.csv',
  stale: '../data/DEMO_stale-systems.csv'
};

const statusClass = value =>
  String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-');

const numberValue = value =>
  Number.parseInt(value, 10) || 0;

async function loadText(path) {
  const response = await fetch(path);

  if (!response.ok) {
    throw new Error(`Unable to load ${path}`);
  }

  return response.text();
}

async function loadJson(path) {
  const response = await fetch(path);

  if (!response.ok) {
    throw new Error(`Unable to load ${path}`);
  }

  return response.json();
}

function parseCsv(text) {
  const lines = text.trim().split(/\r?\n/).filter(Boolean);
  const headers = lines.shift().split(',');

  return lines.map(line => {
    const values = line.split(',');

    return Object.fromEntries(
      headers.map((header, index) => [
        header,
        values[index] || ''
      ])
    );
  });
}

function badge(label) {
  return `<span class="badge ${statusClass(label)}">${label}</span>`;
}

function metric(label, value) {
  return `
    <div class="metric">
      <strong>${value}</strong>
      <span>${label}</span>
    </div>
  `;
}

function renderScenarios(scenarios) {
  const grid = document.querySelector('#scenarioGrid');

  grid.innerHTML = scenarios.map(scenario => `
    <article class="scenario-card ${statusClass(scenario.executiveStatus)}">
      <h3>${scenario.title}</h3>
      <div class="score">${scenario.readinessScore}%</div>
      ${badge(scenario.executiveStatus)}
      <p>${scenario.summary}</p>
      <p><strong>Action:</strong> ${scenario.recommendedExecutiveAction}</p>
    </article>
  `).join('');
}

function renderReadiness(rows) {
  const summary = document.querySelector('#readinessSummary');
  const body = document.querySelector('#readinessRows');
  const average = Math.round(
    rows.reduce((total, row) => total + numberValue(row.ReadinessScore), 0) / rows.length
  );
  const critical = rows.filter(row => row.ReadinessStatus === 'Critical').length;
  const review = rows.filter(row => row.ReadinessStatus === 'Review').length;
  const healthy = rows.filter(row => row.ReadinessStatus === 'Healthy').length;

  summary.innerHTML = [
    metric('Average readiness', `${average}%`),
    metric('Healthy systems', healthy),
    metric('Review systems', review),
    metric('Critical systems', critical)
  ].join('');

  body.innerHTML = rows
    .sort((a, b) => numberValue(a.ReadinessScore) - numberValue(b.ReadinessScore))
    .map(row => `
      <tr>
        <td>${row.Hostname}</td>
        <td>${row.Environment}</td>
        <td><strong>${row.ReadinessScore}%</strong></td>
        <td>${badge(row.ReadinessStatus)}</td>
        <td>${row.ExecutiveSummary}</td>
      </tr>
    `).join('');
}

function renderPatch(rows) {
  const summary = document.querySelector('#patchSummary');
  const body = document.querySelector('#patchRows');
  const pendingReboots = rows.filter(row => row.PendingReboot === 'Yes').length;
  const criticalMissing = rows.reduce(
    (total, row) => total + numberValue(row.MissingCriticalPatches),
    0
  );
  const average = Math.round(
    rows.reduce((total, row) => total + numberValue(row.PatchCompliancePercent), 0) / rows.length
  );

  summary.innerHTML = [
    metric('Average compliance', `${average}%`),
    metric('Pending reboots', pendingReboots),
    metric('Critical patches missing', criticalMissing),
    metric('Systems in demo', rows.length)
  ].join('');

  body.innerHTML = rows
    .sort((a, b) => numberValue(a.PatchCompliancePercent) - numberValue(b.PatchCompliancePercent))
    .slice(0, 8)
    .map(row => `
      <tr>
        <td>${row.Hostname}</td>
        <td>${row.PatchCompliancePercent}%</td>
        <td>${row.MissingCriticalPatches}</td>
        <td>${row.MissingSecurityPatches}</td>
        <td>${row.PendingReboot}</td>
        <td>${badge(row.PatchStatus)}</td>
      </tr>
    `).join('');
}

function renderSsl(rows) {
  const summary = document.querySelector('#sslSummary');
  const body = document.querySelector('#sslRows');
  const expired = rows.filter(row => row.SslStatus === 'Expired').length;
  const expiring = rows.filter(row => row.SslStatus === 'Expiring').length;

  summary.innerHTML = [
    metric('Expired certificates', expired),
    metric('Expiring certificates', expiring),
    metric('Healthy certificates', rows.filter(row => row.SslStatus === 'Healthy').length),
    metric('Services tracked', rows.length)
  ].join('');

  body.innerHTML = rows
    .sort((a, b) => numberValue(a.DaysRemaining) - numberValue(b.DaysRemaining))
    .map(row => `
      <tr>
        <td>${row.ServiceName}</td>
        <td>${row.Hostname}</td>
        <td>${row.DaysRemaining}</td>
        <td>${badge(row.SslStatus)}</td>
        <td>${row.Owner}</td>
        <td>${row.RecommendedAction}</td>
      </tr>
    `).join('');
}

function renderUnsupported(rows) {
  const body = document.querySelector('#unsupportedRows');

  body.innerHTML = rows.map(row => `
    <tr>
      <td>${row.Hostname}</td>
      <td>${row.OS} ${row.OSVersion}</td>
      <td>${row.Owner}</td>
      <td>${row.OperationalRisk}</td>
      <td>${row.TargetDisposition}</td>
    </tr>
  `).join('');
}

function renderStale(rows) {
  const body = document.querySelector('#staleRows');

  body.innerHTML = rows
    .sort((a, b) => numberValue(b.DaysSinceOwnerValidation) - numberValue(a.DaysSinceOwnerValidation))
    .map(row => `
      <tr>
        <td>${row.Hostname}</td>
        <td>${row.DaysSinceSeen}</td>
        <td>${row.DaysSincePatchScan}</td>
        <td>${row.DaysSinceOwnerValidation}</td>
        <td>${row.StaleReason}</td>
      </tr>
    `).join('');
}

async function boot() {
  const [
    scenarios,
    readinessText,
    patchText,
    sslText,
    unsupportedText,
    staleText
  ] = await Promise.all([
    Promise.all(dataPaths.scenarios.map(loadJson)),
    loadText(dataPaths.readiness),
    loadText(dataPaths.patch),
    loadText(dataPaths.ssl),
    loadText(dataPaths.unsupported),
    loadText(dataPaths.stale)
  ]);

  renderScenarios(scenarios);
  renderReadiness(parseCsv(readinessText));
  renderPatch(parseCsv(patchText));
  renderSsl(parseCsv(sslText));
  renderUnsupported(parseCsv(unsupportedText));
  renderStale(parseCsv(staleText));
}

boot().catch(error => {
  document.body.insertAdjacentHTML(
    'afterbegin',
    `<div class="load-error">DEMO showcase failed to load: ${error.message}</div>`
  );
});
