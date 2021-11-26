export const url = (pair) => {
  return (`https://api.binance.com/api/v3/klines?symbol=${pair}&interval=1d&limit=1000`)
}