const currentMarketPrice = 25685;
const dummyMargin = 212899;

const multiplierMap = {
  'NIFTY': 50,
  'BANKNIFTY': 15,
  'RELIANCE': 505,
  'INFY': 300
};

const plChart = new Chart(document.getElementById('plChart').getContext('2d'), {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: 'P/L',
      data: [],
      borderColor: '#3b82f6',
      fill: false
    }]
  },
  options: {
    responsive: true,
    scales: {
      x: { title: { display: true, text: 'Underlying Price' } },
      y: { title: { display: true, text: 'Profit / Loss (₹)' } }
    }
  }
});

function updatePLChart() {
  const range = 500;
  const step = 50;
  const labels = [];
  const data = [];

  for (let price = currentMarketPrice - range; price <= currentMarketPrice + range; price += step) {
    labels.push(price);
    data.push(Math.floor(Math.random() * 10000) - 5000);
  }

  plChart.data.labels = labels;
  plChart.data.datasets[0].data = data;
  plChart.update();
}

function calculatePnL(entryPrice, currentPrice, symbol) {
  const multiplier = multiplierMap[symbol] || 1;
  return (currentPrice - entryPrice) * multiplier;
}

function loadTrades() {
  const trades = JSON.parse(localStorage.getItem('paperTrades') || '[]');
  const tbody = document.getElementById('tradesTableBody');
  tbody.innerHTML = '';

  trades.forEach(trade => {
    const currentPrice = currentMarketPrice;
    const pnl = calculatePnL(parseFloat(trade.entryPrice), currentPrice, trade.symbol);
    const pnlClass = pnl >= 0 ? 'pnl-positive' : 'pnl-negative';

    const row = `<tr>
      <td>${trade.type}</td>
      <td>${trade.symbol}</td>
      <td>${trade.strike}</td>
      <td>${trade.expiry}</td>
      <td>₹${trade.entryPrice}</td>
      <td>₹${currentMarketPrice}</td>
      <td class="${pnlClass}">${pnl.toFixed(2)}</td>
    </tr>`;
    tbody.innerHTML += row;
  });

  updatePLChart();
}

function addTrade() {
  const trade = {
    type: document.getElementById('tradeType').value,
    symbol: document.getElementById('symbol').value,
    strike: document.getElementById('strike').value,
    expiry: document.getElementById('expiry').value,
    entryPrice: document.getElementById('entryPrice').value
  };

  const trades = JSON.parse(localStorage.getItem('paperTrades') || '[]');
  trades.push(trade);
  localStorage.setItem('paperTrades', JSON.stringify(trades));
  loadTrades();
}

function clearAllTrades() {
  if (confirm('Are you sure you want to clear all trades?')) {
    localStorage.removeItem('paperTrades');
    loadTrades();
  }
}

function loadOptionChain() {
  const options = [
    { symbol: 'NIFTY', strike: 22500, expiry: '27-Jun-2025', type: 'Call', iv: 22, oiChange: 12, ltp: 150 },
    { symbol: 'BANKNIFTY', strike: 48500, expiry: '27-Jun-2025', type: 'Put', iv: 27, oiChange: 8, ltp: 200 },
    { symbol: 'RELIANCE', strike: 2600, expiry: '27-Jun-2025', type: 'Call', iv: 30, oiChange: 10, ltp: 100 },
    { symbol: 'INFY', strike: 1500, expiry: '27-Jun-2025', type: 'Put', iv: 25, oiChange: 6, ltp: 80 }
  ];

  const tbody = document.getElementById('optionChainBody');
  tbody.innerHTML = '';

  options.forEach(option => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${option.symbol}</td>
      <td>${option.strike}</td>
      <td>${option.expiry}</td>
      <td>${option.type}</td>
      <td>${option.iv}%</td>
      <td>${option.oiChange}%</td>
      <td>₹${option.ltp}</td>
      <td><button class="btn secondary" onclick="fillAddTrade('${option.symbol}', ${option.strike}, '${option.expiry}', '${option.type}', ${option.ltp})">Select</button></td>
    `;
    tbody.appendChild(row);
  });
}

function fillAddTrade(symbol, strike, expiry, type, ltp) {
  document.getElementById('symbol').value = symbol;
  document.getElementById('strike').value = strike;
  document.getElementById('expiry').value = expiry;
  document.getElementById('tradeType').value = type;
  document.getElementById('entryPrice').value = ltp;
}

function applyStrategy(strategyName) {
  const trades = JSON.parse(localStorage.getItem('paperTrades') || '[]');

  if (strategyName === 'Iron Fly') {
    trades.push(
      { type: 'Call', symbol: 'NIFTY', strike: 25600, expiry: '27-Jun-2025', entryPrice: 150 },
      { type: 'Put', symbol: 'NIFTY', strike: 25600, expiry: '27-Jun-2025', entryPrice: 160 },
      { type: 'Call', symbol: 'NIFTY', strike: 25800, expiry: '27-Jun-2025', entryPrice: 90 },
      { type: 'Put', symbol: 'NIFTY', strike: 25400, expiry: '27-Jun-2025', entryPrice: 95 }
    );
  } else if (strategyName === 'Bull Call Spread') {
    trades.push(
      { type: 'Call', symbol: 'BANKNIFTY', strike: 48500, expiry: '27-Jun-2025', entryPrice: 200 },
      { type: 'Call', symbol: 'BANKNIFTY', strike: 49000, expiry: '27-Jun-2025', entryPrice: 120 }
    );
  } else if (strategyName === 'Short Straddle') {
    trades.push(
      { type: 'Call', symbol: 'RELIANCE', strike: 2600, expiry: '27-Jun-2025', entryPrice: 100 },
      { type: 'Put', symbol: 'RELIANCE', strike: 2600, expiry: '27-Jun-2025', entryPrice: 110 }
    );
  }

  localStorage.setItem('paperTrades', JSON.stringify(trades));
  loadTrades();
}

// Initial Load
loadTrades();
loadOptionChain();
