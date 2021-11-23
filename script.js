function fetchCoin(pair) {
	if (!pair) {
		return
	}
	//fetch data from BINANCE
	let url = `https://api.binance.com/api/v3/klines?symbol=${pair}&interval=1d&limit=1000`;
	fetch(url)
		.then(res => res.json())
		.then(data => {
			//proces data from BINANCE
			let maxPrice = 0;
			const cdata = data.map(d => {
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
			let r = Math.round(Math.random() * 255);
			let g = Math.round(Math.random() * 255);
			let b = Math.round(Math.random() * 255);
			let chartColor = chart.addLineSeries({
				color: `rgba(${r}, ${g}, ${b}, 1)`,
				lineWidth: 3,
			});
			chartColor.setData(cdata);
		})
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
let addButton = document.getElementById("addButton");
let ul = document.getElementById('ul');
let li = ul.appendChild(document.createElement('li'));

//get data from localStorage
let preferCoin = (localStorage.getItem("preferCoin") ?? "").split(",");
//converting an object to an array
Object.entries(preferCoin)

//get saved data on page refresh
document.body.onload = () => {
	preferCoin.forEach(element => fetchCoin(element))
}

//List of coin

//create coin name list
let coinList = {
	coin: preferCoin,
	//get coin's name and idx
	addCoin: function (coinName, index) {
		this.coin.push({
			coinName: coinName,
			isCompleted: false,
			index: index
		});
		this.displayCoins();
	},
	//remove coins by id
	removeCoin: function (index) {
		for (let coin of this.coin) {
			if (coin.index === parseInt(index)) {
				this.coin.splice(this.coin.indexOf(coin), 1);
			}
		}
		this.displayCoins();
	},
	//show coins in list
	displayCoins: function () {
		while (li.firstChild) {
			li.removeChild(li.firstChild);
		}
		for (let coin of this.coin) {
			li.appendChild(createCoin(coin.coinName, coin.index));
			li.appendChild(createDelete(coin.index));
		}
	}
};
console.log(preferCoin)

//create Delete and Add functions
function createCoin(coin, index) {
	let li = document.createElement('li');
	li.innerText = coin;
	li.id = index;
	return li;
}
function createDelete(index) {
	let deletebutton = document.createElement('button');
	deletebutton.className = 'deletebutton'
	deletebutton.textContent = 'Delete';
	deletebutton.id = index;
	return deletebutton;
}

//regulate the addition and removal of coins
let handler = {
	indexCounter: 0,
	addCoin: function () {
		coinList.addCoin(input.value, this.indexCounter);
		input.value = "";
		this.indexCounter++;
	},
	eventListeners: function () {
		li.addEventListener('click', event => {
			if (event.target.className === 'deletebutton') {
				coinList.removeCoin(event.target.id);
			}
		});
	}
}
handler.eventListeners();

//add EventListener on click
addButton.addEventListener('click', function add(event) {
	fetchCoin(input.value);
	preferCoin.push(input.value);
	localStorage.setItem("preferCoin", preferCoin);
	handler.addCoin();
});