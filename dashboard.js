document.addEventListener("DOMContentLoaded", () => {
  simulateCardLoad("market-pulse-content", getMarketPulseData);
  simulateCardLoad("greeks-alerts-content", getGreeksAlertsData);
  simulateCardLoad("screener-content", getScreenerData);
  setupTickerPause();
  setInterval(() => simulateCardLoad("market-pulse-content", getMarketPulseData), 60000);
});

function simulateCardLoad(elementId, dataFn) {
  const container = document.getElementById(elementId);
  if (!container) return;
  container.innerHTML = "<div class='loader'></div>";
  setTimeout(async () => {
    container.innerHTML = await dataFn();
  }, 1000);
}

function setupTickerPause() {
  const ticker = document.querySelector('.ticker');
  if (!ticker) return;
  ticker.addEventListener('mouseenter', () => ticker.style.animationPlayState = 'paused');
  ticker.addEventListener('mouseleave', () => ticker.style.animationPlayState = 'running');
}

async function getMarketPulseData() {
  try {
    const response = await fetch('/api/market-pulse');
    const data = await response.json();
    return `
      <ul>
        <li>📉 NIFTY PCR: ${data.niftyPCR} (${data.niftyPCR > 1 ? "Bullish" : "Bearish"})</li>
        <li>📈 BANKNIFTY PCR: ${data.bankNiftyPCR} (${data.bankNiftyPCR > 1 ? "Bullish" : "Bearish"})</li>
        <li>🔥 VIX Alert: ${data.vix}</li>
      </ul>
    `;
  } catch (error) {
    console.error("Error loading Market Pulse:", error);
    return `<p class="error-msg">Error loading Market Pulse</p>`;
  }
}

async function getGreeksAlertsData() {
  try {
    const response = await fetch('/api/greeks-alerts');
    const data = await response.json();
    return `
      <ul>${data.alerts.map(alert => `<li>${alert}</li>`).join("")}</ul>
    `;
  } catch (error) {
    console.error("Error loading Greeks Alerts:", error);
    return `<p class="error-msg">Error loading Greeks Alerts</p>`;
  }
}

async function getScreenerData() {
  try {
    const response = await fetch('/api/screener');
    const data = await response.json();
    return renderScreenerTable(data.rows);
  } catch (error) {
    console.error("Error loading Screener:", error);
    return `<p class="error-msg">Error loading Screener</p>`;
  }
}

function renderScreenerTable(rows) {
  return `
    <table class="data-table">
      <thead>
        <tr>
          <th>Symbol</th>
          <th>OI Change %</th>
          <th>IV %</th>
          <th>PCR</th>
          <th>Delta</th>
        </tr>
      </thead>
      <tbody>
        ${rows.map(row => `
          <tr>
            <td>${row.symbol}</td>
            <td>${row.oiChange}</td>
            <td>${row.iv}</td>
            <td>${row.pcr}</td>
            <td>${row.delta}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}
