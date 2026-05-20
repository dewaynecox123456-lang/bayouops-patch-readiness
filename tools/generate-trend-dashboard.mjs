import fs from 'fs';

const trend =
  JSON.parse(
    fs.readFileSync(
      'build/readiness-trend.json',
      'utf8'
    )
  );

const labels =
  trend.map(t => t.label || t.file);

const values =
  trend.map(t => t.readiness);

const latest =
  values[values.length - 1] || 0;


const latestSnapshot =
  trend[trend.length - 1] || {};

const quickFix =
  latestSnapshot.worstSystems || [];

const quickFixRows =
  quickFix.map(item => `
<tr>
<td>${item.host}</td>
<td><span class="sev ${item.severity.toLowerCase()}">${item.severity}</span></td>
<td>${item.score}%</td>
<td>${item.reboot}</td>
<td>${item.owner}</td>
</tr>
`).join('');


const average =
  values.length
    ? Math.round(
        values.reduce((a,b)=>a+b,0)
        / values.length
      )
    : 0;


const previous =
  values.length > 1
    ? values[values.length - 2]
    : latest;

const delta =
  latest - previous;

let interpretation = [];

if (delta > 0) {
  interpretation.push(
    'Operational readiness improved during the latest maintenance cycle.'
  );
}

if (delta < 0) {
  interpretation.push(
    'Operational readiness regressed during the latest cycle and should be reviewed.'
  );
}

if (latest >= 90) {
  interpretation.push(
    'Environment stability currently falls within high-readiness thresholds.'
  );
}

if (latest < 70) {
  interpretation.push(
    'Operational exposure remains elevated and additional remediation is recommended.'
  );
}

if (interpretation.length === 0) {
  interpretation.push(
    'Operational readiness remained relatively stable across recent cycles.'
  );
}

const interpretationHtml =
  interpretation
    .map(x => `<li>${x}</li>`)
    .join('');


const html = `
<!doctype html>
<html>
<head>
<meta charset="utf-8">

<title>
BayouOps Readiness Trend Dashboard
</title>

<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

<style>

body{
  background:#07111f;
  color:#e6edf6;
  font-family:Arial,sans-serif;
  padding:40px;
}

.wrap{
  max-width:1400px;
  margin:auto;
}

.card{
  background:#122036;
  border-radius:18px;
  padding:24px;
  margin-bottom:24px;
  border:1px solid #243852;
}

.metric{
  font-size:42px;
  font-weight:bold;
}

.sub{
  color:#93a5bf;
}

canvas{
  background:#0e1b2d;
  border-radius:16px;
  padding:20px;
}


table{
  width:100%;
  border-collapse:collapse;
  background:#0e1b2d;
  border-radius:16px;
  overflow:hidden;
}

th{
  background:#1b2a40;
  padding:14px;
  text-align:left;
}

td{
  padding:14px;
  border-bottom:1px solid #1d3048;
}

.sev{
  padding:5px 10px;
  border-radius:999px;
  font-weight:bold;
  font-size:12px;
}

.sev1{
  background:#5a1515;
  color:#ff9f9f;
}

.sev2{
  background:#5a3b08;
  color:#ffd26a;
}

.sev3{
  background:#0d3d31;
  color:#8ff0c6;
}


.footer{
  margin-top:40px;
  color:#8ea2bc;
  font-size:12px;
  text-align:center;
}

</style>
</head>

<body>

<div class="wrap">

<div class="card">
<h1>BayouOps Readiness Trend Dashboard</h1>

<div class="sub">
Historical operational readiness visibility
</div>
</div>

<div class="card">
<div class="metric">
${latest}%
</div>

<div class="sub">
Latest Readiness Score
</div>
</div>

<div class="card">
<div class="metric">
${average}%
</div>

<div class="sub">
Average Historical Readiness
</div>
</div>

<div class="card">
<h2>Operational Trend Summary</h2>

<ul>
${interpretationHtml}
</ul>
</div>

<div class="card">
<h2>Quick Fix Queue</h2>
<div class="sub">
Worst systems first • Designed for morning operational review
</div>

<table>
<thead>
<tr>
<th>Host</th>
<th>Severity</th>
<th>Score</th>
<th>Reboot Pending</th>
<th>Owner</th>
</tr>
</thead>
<tbody>
${quickFixRows}
</tbody>
</table>
</div>

<div class="card">
<canvas id="trendChart"></canvas>
</div>

<div class="footer">
BayouOps Operational Intelligence
</div>

</div>

<script>

const ctx =
  document.getElementById('trendChart');

new Chart(ctx, {
  type: 'line',

  data: {
    labels: ${JSON.stringify(labels)},

    datasets: [{
      label: 'Readiness Score',

      data: ${JSON.stringify(values)},

      borderColor: '#10b981',

      backgroundColor:
        'rgba(16,185,129,0.2)',

      borderWidth: 3,

      tension: 0.3,

      fill: true
    }]
  },

  options: {
    responsive: true,

    plugins: {
      legend: {
        labels: {
          color: '#dce7f3'
        }
      }
    },

    scales: {

      y: {
        min: 0,
        max: 100,

        ticks: {
          color: '#c8d4e3'
        },

        grid: {
          color: '#243852'
        }
      },

      x: {
        ticks: {
          color: '#c8d4e3'
        },

        grid: {
          color: '#243852'
        }
      }
    }
  }
});

</script>

</body>
</html>
`;

const stamp =
  new Date().toISOString().replace(/[:.]/g,'-');

const outfile =
  `reports/bayouops_trend_dashboard_${stamp}.html`;

fs.writeFileSync(outfile, html);

console.log('');
console.log('[SUCCESS] Trend dashboard created:');
console.log('');
console.log(outfile);
console.log('');
