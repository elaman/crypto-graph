let coinPairs = {};
try {
	coinPairs = JSON.parse(localStorage.getItem("coinPairs"));
} catch (error) {}

//get saved data on page refresh
document.body.onload = () => {
	Object.keys(coinPairs).forEach(element => fetchCoin(element, coinPairs[element]));
}

function fetchCoin(pair, color) {
	if (!pair) {
		return
	}
	//fetch data from BINANCE
	let url = `https://api.binance.com/api/v3/klines?symbol=${pair}&interval=1d&limit=1000`;

	fetch(url)
		.then(res => res.json())
		.then(data => {
			//process data from BINANCE
			let maxPrice = 0;
			let cdata = data.map(d => {
				//determined max price of coin
				let price = parseFloat(d[2]);
				if (maxPrice < price) {
					maxPrice = price;
				}
				return { time: d[0] / 1000, value: price }
			});

			for (let i = 0; i < cdata.length; i++) {
				cdata[i].value = cdata[i].value / (maxPrice / 100);
			}

			//create style for chartline
			let chartLine = chart.addLineSeries({
				color: color,
				lineWidth: 3,
			});
			chartLine.setData(cdata);

			//array that contains names that already existes
			let blockednames = Object.keys(coinPairs);
			//comparing inputs names with blockednames
			let addBtn = document.getElementById("addBtn");
			addBtn.addEventListener("click", () => {
				blockednames.forEach(el => {
					if (input.value.toUpperCase() === el) {
						input.value = "";
						alert("This coin already exists");
					}
				});
			});

			//get and create HTML element for coinList
			var li = document.createElement('li');
			var ul = document.getElementById("ul");
			li.innerText = pair;
			li.style.color = color;
			var delBtn = document.createElement('button');
			delBtn.className = "delBtn";

			//Add delete button into li
			li.append(delBtn);
			ul.append(li);
			delBtn.innerText = "remove";

			//delete event
			delBtn.addEventListener("click", () => {
				//Delete coins from list
				document.getElementById("ul").removeChild(li);
				//Delete coins from localSrotage
				delete coinPairs[pair];
				localStorage.setItem("coinPairs", JSON.stringify(coinPairs));
				//Delete coins from chart
				chart.removeSeries(chartLine);
				//Delete coins from blocednames
				for (let i = 0; i < blockednames.length; i++) {
					delete blockednames[i];
				}
			});
		})
		//Checking coin existibility in BININCE
		.catch(error => {
			console.log(error);
		});

}

//Create a chart
var chart = LightweightCharts.createChart(document.body, {
	width: 1000,
	height: 500,
	rightPriceScale: {
		scaleMargins: {
			top: 0.1,
			bottom: 0.1,
		},
		borderColor: 'rgba(197, 203, 206, 0.4)',
	},
	timeScale: {
		borderColor: 'rgba(197, 203, 206, 0.4)',
	},
	layout: {
		backgroundColor: '#ffffff',
		textColor: '#7c7c7c',
	},
	grid: {
		vertLines: {
			color: 'rgba(197, 203, 206, 0.4)',
			style: LightweightCharts.LineStyle.Dotted,
		},
		horzLines: {
			color: 'rgba(197, 203, 206, 0.4)',
			style: LightweightCharts.LineStyle.Dotted,
		},
	},
});

//add EventListener on click form
document.getElementById("form").addEventListener('submit', function add(event) {
	const coinPair = document.getElementById("input").value;

	let color = `rgb(
		${(Math.random() * 125).toFixed()},
		${(Math.random() * 125).toFixed()},
		${(Math.random() * 125).toFixed()}
	)`;

	fetchCoin(coinPair, color);
	coinPairs[coinPair] = color;
	localStorage.setItem("coinPairs", JSON.stringify(this.pairs));

	event.preventDefault();
});
