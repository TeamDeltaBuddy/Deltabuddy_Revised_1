document.addEventListener("DOMContentLoaded", () => {
  simulateCardLoad("market-pulse-content", getMarketPulseData);
  simulateCardLoad("greeks-alerts-content", getGreeksAlertsData);
  simulateCardLoad("screener-content", getScreenerData);
});

function simulateCardLoad(elementId, dataFn) {
  const container = document.getElementById(elementId);
  if (!container) return;

  container.innerHTML = "<div class='loader'></div>";

  setTimeout(async () => {
    container.innerHTML = await dataFn();
  }, 1000);
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
      <ul>
        ${data.alerts.map(alert => `<li>${alert}</li>`).join("")}
      </ul>
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
    const rows = data.rows;

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
  } catch (error) {
    console.error("Error loading Screener:", error);
    return `<p class="error-msg">Error loading Screener</p>`;
  }
}

async function generateStrategy() {
  const userInput = document.getElementById('strategy-input').value;
  const resultContainer = document.getElementById('strategy-result');

  resultContainer.innerHTML = "<p>Generating strategy...</p>";

  try {
    const response = await fetch('/api/strategy-assistant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input: userInput })
    });

    const data = await response.json();
    resultContainer.innerHTML = `<pre>${data.strategy}</pre>`;
  } catch (error) {
    console.error('Error generating strategy:', error);
    resultContainer.innerHTML = `<p class="error-msg">Error generating strategy.</p>`;
  }
}

function applyScreenerFilters() {
  const selectedSymbols = Array.from(document.getElementById("symbol-filter").selectedOptions).map(option => option.value);
  const oiMin = document.getElementById("oi-min").value;
  const ivRange = document.getElementById("iv-range").value;
  const pcrRange = document.getElementById("pcr-range").value;
  const deltaThreshold = document.getElementById("delta-threshold").value;

  console.log("🟢 Screener Request:", { selectedSymbols, oiMin, ivRange, pcrRange, deltaThreshold });

  document.getElementById("screener-results").innerHTML = `<div class='loader'></div>`;

  const dummyResults = [
    { symbol: "RELIANCE", oiChange: "+25%", iv: "22%", pcr: "1.1", delta: "0.3" },
    { symbol: "INFY", oiChange: "+18%", iv: "19%", pcr: "0.9", delta: "0.2" },
    { symbol: "NIFTY", oiChange: "+30%", iv: "21%", pcr: "1.0", delta: "0.4" }
  ];

  document.getElementById("screener-meta").textContent = `${dummyResults.length} results found`;

  const resultsTable = `
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
        ${dummyResults.map(row => `
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

  document.getElementById("screener-results").innerHTML = resultsTable;
}
