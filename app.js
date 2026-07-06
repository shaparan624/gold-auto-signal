const API_KEY = 0a2e6cc3e81b421e9b3db3524e300d30

async function getSignal() {
  try {
    const url = `https://api.twelvedata.com/price?symbol=XAU/USD&apikey=${API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.price) {
      const price = parseFloat(data.price);

      document.getElementById("price").innerText = price.toFixed(2);
      document.getElementById("entry").innerText = price.toFixed(2);

      // ডেমো সিগন্যাল (পরে উন্নত করা হবে)
      if (price % 2 > 1) {
        document.getElementById("signal").innerText = "🟢 BUY";
        document.getElementById("sl").innerText = (price - 3).toFixed(2);
        document.getElementById("tp").innerText = (price + 6).toFixed(2);
      } else {
        document.getElementById("signal").innerText = "🔴 SELL";
        document.getElementById("sl").innerText = (price + 3).toFixed(2);
        document.getElementById("tp").innerText = (price - 6).toFixed(2);
      }
    } else {
      alert("API Error: " + (data.message || "No price data"));
    }
  } catch (err) {
    alert("Network Error");
    console.error(err);
  }
}

getSignal();
