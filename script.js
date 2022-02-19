// Create the chart
const chart = LightweightCharts.createChart(document.querySelector("main"), {
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

// Manage chart size.
window.addEventListener('resize', event => {
  chart.applyOptions({ width: window.innerWidth, height: window.innerHeight });
});
window.dispatchEvent(new Event('resize'));

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
const coinPairInput = document.querySelector("input");
document.querySelector("form").addEventListener("submit", (event) => {
  const coinPair = coinPairInput.value.trim().toUpperCase();

  if (!coinPairs[coinPair]) {
    addCoinPair(
      coinPair,
      `rgb(${[
        (Math.random() * 125).toFixed(),
        (Math.random() * 125).toFixed(),
        (Math.random() * 125).toFixed(),
      ].join(", ")})`
    );
  } else {
    alert("This coin already exists");
    coinPairInput.value = "";
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
      const coinPairLine = chart.addLineSeries({ coinPair, color });
      coinPairLine.setData(processExchangeData(data));

      // Add DOM elements responsible for coin pair.
      addCoinPairDOM(coinPairLine);

      // Update local storage.
      coinPairs[coinPair] = color;
      localStorage.setItem("coinPairs", JSON.stringify(coinPairs));
    })
    .catch((error) => {
      // Process errors.
      alert('Error adding the coin pair. Check if format is valid.');
    });
}

const coinPairList = document.querySelector("ul");
function addCoinPairDOM(coinPairLine) {
  const coinPairItem = document.createElement("li");
  let { coinPair, color } = coinPairLine.options();
  coinPairItem.textContent = coinPair;
  coinPairItem.className = "list-group-item d-flex align-items-center";

  const colorMarker = document.createElement("span");
  colorMarker.className = "rounded-circle p-2 me-2";
  colorMarker.style.backgroundColor = color;

  const removeButton = document.createElement("button");
  removeButton.textContent = "Remove";
  removeButton.className = "btn btn-sm btn-danger ms-auto";
  removeButton.addEventListener("click", () => {
    // Remove from UI.
    coinPairList.removeChild(coinPairItem);
    // Remove from Chart.
    chart.removeSeries(coinPairLine);
    // Delete coins from localSrotage
    delete coinPairs[coinPair];
    localStorage.setItem("coinPairs", JSON.stringify(coinPairs));
  });

  coinPairItem.prepend(colorMarker);
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
