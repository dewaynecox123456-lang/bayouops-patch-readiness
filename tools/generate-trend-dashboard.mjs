import fs from 'fs';

const trend =
  JSON.parse(
    fs.readFileSync(
      'build/readiness-trend.json',
      'utf8'
    )
  );

const labels =
  trend.map(t => t.file);

const values =
  trend.map(t => t.readiness);

const latest =
  values[values.length - 1] || 0;

const average =
  values.length
    ? Math.round(
        values.reduce((a,b)=>a+b,0)
        / values.length
      )
    : 0;

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
