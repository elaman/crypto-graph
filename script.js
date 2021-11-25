//get data from localStorage
let preferCoin = JSON.parse(localStorage.getItem("preferCoin") ?? "{}");
console.log(preferCoin);

//get saved data on page refresh
document.body.onload = () => {
	Object.keys(preferCoin).forEach(element => fetchCoin(element, preferCoin[element]));
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
			let blockednames = Object.keys(preferCoin);
			//comparing inputs names with blockednames
			let addBtn = document.getElementById("addBtn");
			addBtn.addEventListener("click", () => {
				blockednames.forEach(el => {
					if (input.value.toUpperCase() === el) {
						input.value = "";
						fail.innerText = "This coin already exists";
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
				delete preferCoin[pair];
				localStorage.setItem("preferCoin", JSON.stringify(preferCoin));
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
			fail.innerText = "This coin doesn't exists";
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

//get HTML elements
let input = document.getElementById("input");
let form = document.getElementById("form");
let fail = document.getElementById("fail");
fail.className = "fail";


//add EventListener on click form
form.addEventListener('submit', function add(event) {
	event.preventDefault();
	let r = Math.round(Math.random() * 125);
	let g = Math.round(Math.random() * 125);
	let b = Math.round(Math.random() * 125);
	let color = `rgb(${r}, ${g}, ${b})`;

	fetchCoin(input.value, color);
	preferCoin[input.value] = color;
	localStorage.setItem("preferCoin", JSON.stringify(preferCoin));
});

