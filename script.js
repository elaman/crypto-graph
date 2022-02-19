// Create the chart
var chart = LightweightCharts.createChart(document.querySelector("main"), {
  width: 1000,
  height: 500,
  rightPriceScale: {
    scaleMargins: {
      top: 0.1,
      bottom: 0.1,
    },
    borderColor: "rgba(197, 203, 206, 0.4)",
  },
  timeScale: {
    borderColor: "rgba(197, 203, 206, 0.4)",
  },
  layout: {
    backgroundColor: "#ffffff",
    textColor: "#7c7c7c",
  },
  grid: {
    vertLines: {
      color: "rgba(197, 203, 206, 0.4)",
      style: LightweightCharts.LineStyle.Dotted,
    },
    horzLines: {
      color: "rgba(197, 203, 206, 0.4)",
      style: LightweightCharts.LineStyle.Dotted,
    },
  },
});

// Attempt to restore saved coins.
let coinPairs = {};
try {
  coinPairs = { ...JSON.parse(localStorage.getItem("coinPairs")) };
} catch (error) {}

// Add existing coins to the chart.
Object.keys(coinPairs).forEach((coinPair) =>
  addCoinPair(coinPair, coinPairs[coinPair])
);

// Prepare new coin form.
document.querySelector("form").addEventListener("submit", (event) => {
  const coinPair = document.querySelector("input").value.trim().toUpperCase();

  if (!coinPairs[coinPair]) {
    addCoinPair(
      coinPair,
      `rgb(
			${(Math.random() * 125).toFixed()},
			${(Math.random() * 125).toFixed()},
			${(Math.random() * 125).toFixed()}
		)`
    );
  } else {
    alert("This coin already exists");
  }

  event.preventDefault();
});

function addCoinPair(coinPair, color) {
  fetch(
    `https://api.binance.com/api/v3/klines?symbol=${coinPair}&interval=1d&limit=1000`
  )
    .then((response) => response.json())
    .then((data) => {
      // Add line to the chart.
      const coinPairLine = chart.addLineSeries({ color });
      coinPairLine.setData(processExchangeData(data));

      // Add DOM elements responsible for coin pair.
      addCoinPairDOM(coinPair, color, coinPairLine);

      // Update local storage.
      coinPairs[coinPair] = color;
      localStorage.setItem("coinPairs", JSON.stringify(coinPairs));
    })
    .catch((error) => {
      // Process errors.
      console.log(error);
    });
}

const coinPairList = document.querySelector("ul");
function addCoinPairDOM(coinPair, color, coinPairLine) {
  var coinPairItem = document.createElement("li");
  coinPairItem.textContent = coinPair;
  coinPairItem.style.color = color;

  var removeButton = document.createElement("button");
  removeButton.textContent = "Remove";
  removeButton.addEventListener("click", () => {
    // Remove from UI.
    coinPairList.removeChild(coinPairItem);
    // Remove from Chart.
    chart.removeSeries(coinPairLine);
    // Delete coins from localSrotage
    delete coinPairs[coinPair];
    localStorage.setItem("coinPairs", JSON.stringify(coinPairs));
  });

  coinPairItem.append(removeButton);
  coinPairList.append(coinPairItem);
}

function processExchangeData(data, maxPrice = 0) {
  return data
    .map(([time, , price]) => {
      // Determine max price of the pair throughout the history.
      price = parseFloat(price);
      maxPrice = maxPrice < price ? price : maxPrice;
      // Return relevant data.
      return { time, price };
    })
    .map(({ time, price }) => ({
      // We need seconds.
      time: time / 1000,
      // Calculate value based on max price.
      value: price / (maxPrice / 100),
    }));
}
