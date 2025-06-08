document.addEventListener("DOMContentLoaded", () => {
  // Simulate dynamic loading of card content
  simulateCardLoad("market-pulse-content", getMarketPulseData);
  simulateCardLoad("greeks-alerts-content", getGreeksAlertsData);
  simulateCardLoad("screener-content", getScreenerData);
});

// Simulate async load
function simulateCardLoad(elementId, dataFn) {
  const container = document.getElementById(elementId);
  container.innerHTML = "<p>Loading...</p>";

  setTimeout(() => {
    container.innerHTML = dataFn();
  }, 1000); // Simulated 1 second load
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
    return `<p style="color:red;">Error loading Market Pulse</p>`;
  }
}

async function getGreeksAlertsData() {
  try {
    const response = await fetch('/api/greeks-alerts');
    const data = await response.json();

    // Example: data.alerts = [ "Delta spike...", "Gamma shift..." ]
    return `
      <ul>
        ${data.alerts.map(alert => `<li>${alert}</li>`).join("")}
      </ul>
    `;
  } catch (error) {
    console.error("Error loading Greeks Alerts:", error);
    return `<p style="color:red;">Error loading Greeks Alerts</p>`;
  }
}

async function getScreenerData() {
  try {
    const response = await fetch('/api/screener');
    const data = await response.json();

    // Example data.rows = [{ symbol, oiChange, iv, pcr, delta }]
    const rows = data.rows;

    return `
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background: #f3f4f6;">
            <th style="padding: 0.5rem; border: 1px solid #e5e7eb;">Symbol</th>
            <th style="padding: 0.5rem; border: 1px solid #e5e7eb;">OI Change %</th>
            <th style="padding: 0.5rem; border: 1px solid #e5e7eb;">IV %</th>
            <th style="padding: 0.5rem; border: 1px solid #e5e7eb;">PCR</th>
            <th style="padding: 0.5rem; border: 1px solid #e5e7eb;">Delta</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map(row => `
            <tr>
              <td style="padding: 0.5rem; border: 1px solid #e5e7eb;">${row.symbol}</td>
              <td style="padding: 0.5rem; border: 1px solid #e5e7eb;">${row.oiChange}</td>
              <td style="padding: 0.5rem; border: 1px solid #e5e7eb;">${row.iv}</td>
              <td style="padding: 0.5rem; border: 1px solid #e5e7eb;">${row.pcr}</td>
              <td style="padding: 0.5rem; border: 1px solid #e5e7eb;">${row.delta}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;
  } catch (error) {
    console.error("Error loading Screener:", error);
    return `<p style="color:red;">Error loading Screener</p>`;
  }
}
async function generateStrategy() {
  const userInput = document.getElementById('strategy-input').value;
  const resultContainer = document.getElementById('strategy-result');

  resultContainer.innerHTML = "<p>Generating strategy...</p>";

  try {
    const response = await fetch('/api/strategy-assistant', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ input: userInput })
    });

    const data = await response.json();

    resultContainer.innerHTML = `<pre>${data.strategy}</pre>`;
  } catch (error) {
    console.error('Error generating strategy:', error);
    resultContainer.innerHTML = `<p style="color:red;">Error generating strategy.</p>`;
  }
}

function applyScreenerFilters() {
  const selectedSymbols = Array.from(document.getElementById("symbol-filter").selectedOptions).map(option => option.value);
  const oiMin = document.getElementById("oi-min").value;
  const ivRange = document.getElementById("iv-range").value;
  const pcrRange = document.getElementById("pcr-range").value;
  const deltaThreshold = document.getElementById("delta-threshold").value;

  console.log("🟢 Screener Request:", {
    selectedSymbols, oiMin, ivRange, pcrRange, deltaThreshold
  });
document.getElementById("screener-results").innerHTML = `<p>Loading results...</p>`;

  // Simulate dummy results
  const dummyResults = [
    { symbol: "RELIANCE", oiChange: "+25%", iv: "22%", pcr: "1.1", delta: "0.3" },
    { symbol: "INFY", oiChange: "+18%", iv: "19%", pcr: "0.9", delta: "0.2" },
    { symbol: "NIFTY", oiChange: "+30%", iv: "21%", pcr: "1.0", delta: "0.4" }
  ];

  // Update "X results found"
  document.getElementById("screener-meta").textContent = `${dummyResults.length} results found`;

  // Build results table
  const resultsTable = `
    <table style="width: 100%; border-collapse: collapse;">
      <thead>
        <tr style="background: #f3f4f6;">
          <th style="padding: 0.5rem; border: 1px solid #e5e7eb;">Symbol</th>
          <th style="padding: 0.5rem; border: 1px solid #e5e7eb;">OI Change %</th>
          <th style="padding: 0.5rem; border: 1px solid #e5e7eb;">IV %</th>
          <th style="padding: 0.5rem; border: 1px solid #e5e7eb;">PCR</th>
          <th style="padding: 0.5rem; border: 1px solid #e5e7eb;">Delta</th>
        </tr>
      </thead>
      <tbody>
        ${dummyResults.map(row => `
          <tr>
            <td style="padding: 0.5rem; border: 1px solid #e5e7eb;">${row.symbol}</td>
            <td style="padding: 0.5rem; border: 1px solid #e5e7eb;">${row.oiChange}</td>
            <td style="padding: 0.5rem; border: 1px solid #e5e7eb;">${row.iv}</td>
            <td style="padding: 0.5rem; border: 1px solid #e5e7eb;">${row.pcr}</td>
            <td style="padding: 0.5rem; border: 1px solid #e5e7eb;">${row.delta}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;

  document.getElementById("screener-results").innerHTML = resultsTable;
}
