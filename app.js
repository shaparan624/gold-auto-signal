const API_KEY = "YOUR_API_KEY"; // 0a2e6cc3e81b421e9b3db3524e300d30

let prices = [];

// --- API থেকে price আনা ---
async function fetchPrice() {
  try {
    const url = `https://api.twelvedata.com/price?symbol=XAU/USD&apikey=${API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.price) {
      const price = parseFloat(data.price);
      document.getElementById("price").innerText = price.toFixed(2);

      prices.push(price);

      // শুধু last 50 data রাখবো
      if (prices.length > 50) {
        prices.shift();
      }

      if (prices.length >= 20) {
        generateSignal();
      }
    }
  } catch (err) {
    console.log(err);
  }
}

// --- EMA calculate ---
function EMA(data, period) {
  let k = 2 / (period + 1);
  let emaArray = [];
  emaArray[0] = data[0];

  for (let i = 1; i < data.length; i++) {
    emaArray[i] = data[i] * k + emaArray[i - 1] * (1 - k);
  }

  return emaArray[emaArray.length - 1];
}

// --- RSI calculate ---
function RSI(data, period = 14) {
  let gains = 0;
  let losses = 0;

  for (let i = data.length - period; i < data.length; i++) {
    let diff = data[i] - data[i - 1];
    if (diff >= 0) gains += diff;
    else losses -= diff;
  }

  let avgGain = gains / period;
  let avgLoss = losses / period;

  let rs = avgGain / (avgLoss || 1);
  return 100 - (100 / (1 + rs));
}

// --- Signal Generator ---
function generateSignal() {
  let ema20 = EMA(prices, 20);
  let ema50 = EMA(prices, 50);
  let rsi = RSI(prices, 14);

  let lastPrice = prices[prices.length - 1];

  let signal = "WAIT";
  let sl = 0;
  let tp = 0;

  if (ema20 > ema50 && rsi > 55) {
    signal = "🟢 BUY";
    sl = lastPrice - 5;
    tp = lastPrice + 10;
  } 
  else if (ema20 < ema50 && rsi < 45) {
    signal = "🔴 SELL";
    sl = lastPrice + 5;
    tp = lastPrice - 10;
  }

  document.getElementById("signal").innerText = signal;
  document.getElementById("entry").innerText = lastPrice.toFixed(2);
  document.getElementById("sl").innerText = sl.toFixed(2);
  document.getElementById("tp").innerText = tp.toFixed(2);
}

// --- Auto refresh every 10 sec ---
setInterval(fetchPrice, 10000);
fetchPrice();
