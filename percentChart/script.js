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

//get HTML elements
let input = document.getElementById("input");
let btn = document.getElementById("btn");

//
let preferCoin = localStorage.getItem("preferCoin") ?? [];

//add EventListener on click
btn.addEventListener('click', function add(event) {

	preferCoin.push(input.value);

	//fetch data from BINANCE
	let url = `https://api.binance.com/api/v3/klines?symbol=${input.value}&interval=1d&limit=1000`;
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
			var chartColor = chart.addAreaSeries({
				topColor: `rgba(${r}, ${g}, ${b}, .7)`,
				bottomColor: `rgba(${r}, ${g}, ${b}, .3)`,
				lineColor: `rgba(${r}, ${g}, ${b}, 1)`,
				lineWidth: 2,
			});

			chartColor.setData(cdata);

			localStorage.setItem("preferCoin", preferCoin);
		})
});