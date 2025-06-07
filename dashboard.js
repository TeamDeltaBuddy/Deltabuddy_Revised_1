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

// Dummy data functions
function getMarketPulseData() {
  return `
    <ul>
      <li>📉 NIFTY PCR: 0.92 (Bearish)</li>
      <li>📈 BANKNIFTY PCR: 1.13 (Bullish)</li>
      <li>🔥 VIX Alert: 15.7 → 19.2 spike</li>
    </ul>
  `;
}

function getGreeksAlertsData() {
  return `
    <ul>
      <li>🚨 Delta spike detected on NIFTY 17600</li>
      <li>🟠 Gamma shift on BANKNIFTY ATM</li>
    </ul>
  `;
}

function getScreenerData() {
  return `
    <div>
      <label>Select Symbols:</label><br>
      <select multiple id="symbol-filter" style="width: 100%; padding: 0.5rem; border-radius: 5px;">
        <option>NIFTY</option>
        <option>BANKNIFTY</option>
        <option>RELIANCE</option>
        <option>INFY</option>
        <option>TCS</option>
        <option>ICICIBANK</option>
      </select><br><br>

      <label>OI Change % (Min):</label><br>
      <input type="number" id="oi-min" placeholder="e.g. 10" style="width: 100%; padding: 0.5rem;"><br><br>

      <label>IV Range (%):</label><br>
      <input type="text" id="iv-range" placeholder="e.g. 12-25" style="width: 100%; padding: 0.5rem;"><br><br>

      <label>PCR Range:</label><br>
      <input type="text" id="pcr-range" placeholder="e.g. 0.8-1.2" style="width: 100%; padding: 0.5rem;"><br><br>

      <label>Delta Threshold:</label><br>
      <input type="text" id="delta-threshold" placeholder="e.g. > 0.3" style="width: 100%; padding: 0.5rem;"><br><br>

      <button onclick="applyScreenerFilters()" style="background: #3b82f6; color: white; padding: 0.7rem 1.2rem; border: none; border-radius: 5px; cursor: pointer;">
        Run Screener
      </button>

      <button onclick="resetScreenerFilters()" style="background: #e5e7eb; color: #111827; padding: 0.7rem 1.2rem; border: none; border-radius: 5px; cursor: pointer; margin-left: 1rem;">
        Reset Filters
      </button>
    </div>

    <div id="screener-meta" style="margin-top: 1rem; font-weight: bold; color: #3b82f6;"></div>

    <div id="screener-results" style="margin-top: 0.5rem;">
      <p>No results yet. Apply filters to search.</p>
    </div>
  `;
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
