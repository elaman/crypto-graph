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
		backgroundColor: '#100841',
		textColor: '#ffffff',
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

var btcusdt = chart.addAreaSeries({
	topColor: 'rgba(67, 83, 254, 0.7)',
	bottomColor: 'rgba(67, 83, 254, 0.3)',
	lineColor: 'rgba(67, 83, 254, 1)',
	lineWidth: 2,
});

var ethusdt = chart.addAreaSeries({
	topColor: 'rgba(255, 192, 0, 0.7)',
	bottomColor: 'rgba(255, 192, 0, 0.3)',
	lineColor: 'rgba(255, 192, 0, 1)',
	lineWidth: 2,
});

var solusdt = chart.addAreaSeries({
	topColor: 'rgba(907, 173, 84, 0.7)',
	bottomColor: 'rgba(707, 883, 354, 0.3)',
	lineColor: 'rgba(502, 603, 554, 1)',
	lineWidth: 2,
});

fetch(`http://127.0.0.1:9665/fetchAPI?endpoint=https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1d&limit=1000`)
	.then(res => res.json())
	.then(data => {
		let maxPrice = 0;
		const cdata = data.map(d => {
			let price = parseFloat(d[2]);
			if (maxPrice < price) {
				maxPrice = price;
			}
			return { time: d[0] / 1000, value: price }
		});

		for (let i = 0; i < cdata.length; i++) {
			cdata[i].value = cdata[i].value / (maxPrice / 100);
		}
		btcusdt.setData(cdata);
	})

//Dynamic Chart
let socket = io.connect('http://127.0.0.1:5500/');

socket.on('KLINE', (pl) => {
	//log(pl);
	btcusdt.update(pl);
});

fetch(`http://127.0.0.1:9665/fetchAPI?endpoint=https://api.binance.com/api/v3/klines?symbol=ETHUSDT&interval=1d&limit=1000`)
	.then(res => res.json())
	.then(data => {
		let maxPrice = 0;
		const cdata = data.map(d => {
			let price = parseFloat(d[2]);
			if (maxPrice < price) {
				maxPrice = price;
			}
			return { time: d[0] / 1000, value: price }
		});

		for (let i = 0; i < cdata.length; i++) {
			cdata[i].value = cdata[i].value / (maxPrice / 100);
		}
		ethusdt.setData(cdata);
	})

//Dynamic Chart
socket = io.connect('http://127.0.0.1:5500/');

socket.on('KLINE', (pl) => {
	//log(pl);
	ethusdt.update(pl);
});


let input = document.getElementById("input");
let btn = document.getElementById("btn");

btn.addEventListener('click', function addCharts(event) {
	let url = `http://127.0.0.1:9665/fetchAPI?endpoint=https://api.binance.com/api/v3/klines?symbol=${input.value}&interval=1d&limit=1000`;

	console.log(url)

	function getAPI() {
		fetch(url)
			.then(res => res.json())
			.then(data => {
				let maxPrice = 0;
				const cdata = data.map(d => {
					let price = parseFloat(d[2]);
					if (maxPrice < price) {
						maxPrice = price;
					}
					return { time: d[0] / 1000, value: price }
				});

				console.log(cdata)

				for (let i = 0; i < cdata.length; i++) {
					cdata[i].value = cdata[i].value / (maxPrice / 100);
				}
				solusdt.setData(cdata);
			})

		//Dynamic Chart
		socket = io.connect('http://127.0.0.1:5500/');

		socket.on('KLINE', (pl) => {
			//log(pl);
			solusdt.update(pl);
		});
	}
	btn.addEventListener("click", function getValue(event){
		getAPI();
	})
});