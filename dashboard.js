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
      <label for="sector-filter">Sector:</label>
      <select id="sector-filter">
        <option value="">All</option>
        <option value="IT">IT</option>
        <option value="Banking">Banking</option>
        <option value="Pharma">Pharma</option>
      </select>

      <label for="oi-filter" style="margin-left: 1rem;">OI >:</label>
      <input type="number" id="oi-filter" placeholder="100000">

      <button onclick="applyScreenerFilters()" style="margin-left: 1rem;">Apply Filters</button>
    </div>

    <div id="screener-results" style="margin-top: 1rem;">
      <!-- Results will go here -->
      <p>No results yet. Apply filters to search.</p>
    </div>
  `;
}

function applyScreenerFilters() {
  const sector = document.getElementById("sector-filter").value;
  const oi = document.getElementById("oi-filter").value;

  const resultsContainer = document.getElementById("screener-results");
  resultsContainer.innerHTML = `
    <p>Showing results for Sector: <strong>${sector || 'All'}</strong>, OI > <strong>${oi || 'Any'}</strong></p>
    <ul>
      <li>Example Result 1</li>
      <li>Example Result 2</li>
    </ul>
  `;
}
