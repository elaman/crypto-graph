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

var bnb = chart.addAreaSeries({
	topColor: 'rgba(0, 102, 255, 0.7)',
	bottomColor: 'rgba(0, 102, 255, 0.3)',
	lineColor: 'rgba(0, 102, 255, 1)',
	lineWidth: 2,
});

var gala = chart.addAreaSeries({
	topColor: 'rgb(255, 60, 0, .7)',
	bottomColor: 'rgba(255, 60, 0, 0.3)',
	lineColor: 'rgba(255, 60, 0, 1)',
	lineWidth: 2,
});

var avax = chart.addAreaSeries({
	topColor: 'rgb(255, 0, 221, .7)',
	bottomColor: 'rgba(255, 0, 221, 0.3)',
	lineColor: 'rgba(255, 0, 221, 1)',
	lineWidth: 2,
});
fetch(`https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1d&limit=1000`)
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
let socket = io.connect('http://127.0.0.1:5500/');

socket.on('KLINE', (pl) => {
	btcusdt.update(pl);
});


let input = document.getElementById("input");
let btn = document.getElementById("btn");

input.addEventListener('change', function (event) {
	let url = `https://api.binance.com/api/v3/klines?symbol=${input.value}&interval=1d&limit=1000`;

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

				for (let i = 0; i < cdata.length; i++) {
					cdata[i].value = cdata[i].value / (maxPrice / 100);
				}
				if(input.value == "BNBUSDT"){
					bnb.setData(cdata);
				}
				if(input.value == "GALAUSDT"){
					gala.setData(cdata);
				}
				if(input.value == "AVAXUSDT"){
					avax.setData(cdata);
				}
				else{
					ethusdt.setData(cdata)
				}
				localStorage.setItem("data", JSON.stringify(cdata));
			})
		socket = io.connect('http://127.0.0.1:5500/');

		socket.on('KLINE', (pl) => {
			solusdt.update(pl);
		});
	}
	btn.addEventListener("click", function getValue(event){
		getAPI();
		localStorage.getItem(JSON.parse("data"));
	})
});