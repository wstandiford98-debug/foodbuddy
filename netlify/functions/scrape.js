const https = require('https');

const SCRAPINGBEE_API_KEY = 'D2SM9M67993ZMSGR36BHRV9O7CTPIY8Q3YVKFTMEGZ21GO45ROG4YO5B33EMPB7O2M6ANKZVVRYYKP5R';

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const apiUrl = `https://app.scrapingbee.com/api/v1/?api_key=${SCRAPINGBEE_API_KEY}&url=${encodeURIComponent(url)}&render_js=true&block_ads=true&premium_proxy=true&timeout=15000`;
    https.get(apiUrl, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    }).on('error', reject);
  });
}

function parseWalmartPrices(html, query) {
  const results = [];
  // Match price + product name patterns
  const priceRegex = /\$(\d+\.\d{2})/g;
  const titleRegex = /"name":"([^"]{10,80})"/g;
  const prices = [];
  const titles = [];
  let m;
  while ((m = priceRegex.exec(html)) !== null) prices.push(m[1]);
  while ((m = titleRegex.exec(html)) !== null) titles.push(m[1]);
  const count = Math.min(titles.length, prices.length, 6);
  for (let i = 0; i < count; i++) {
    results.push({ store: 'Walmart', name: titles[i], price: '$' + prices[i] });
  }
  return results;
}

function parseSafewayPrices(html, query) {
  const results = [];
  const priceRegex = /\$(\d+\.\d{2})/g;
  const titleRegex = /"name":"([^"]{10,80})"/g;
  const prices = [];
  const titles = [];
  let m;
  while ((m = priceRegex.exec(html)) !== null) prices.push(m[1]);
  while ((m = titleRegex.exec(html)) !== null) titles.push(m[1]);
  const count = Math.min(titles.length, prices.length, 6);
  for (let i = 0; i < count; i++) {
    results.push({ store: 'Safeway', name: titles[i], price: '$' + prices[i] });
  }
  return results;
}

function parseFredMeyerPrices(html, query) {
  const results = [];
  const priceRegex = /\$(\d+\.\d{2})/g;
  const titleRegex = /"name":"([^"]{10,80})"/g;
  const prices = [];
  const titles = [];
  let m;
  while ((m = priceRegex.exec(html)) !== null) prices.push(m[1]);
  while ((m = titleRegex.exec(html)) !== null) titles.push(m[1]);
  const count = Math.min(titles.length, prices.length, 6);
  for (let i = 0; i < count; i++) {
    results.push({ store: 'Fred Meyer', name: titles[i], price: '$' + prices[i] });
  }
  return results;
}

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  const params = event.queryStringParameters || {};
  const action = params.action || 'prices';
  const query = params.query || 'milk';
  const zip = params.zip || '97201';

  try {
    if (action === 'prices') {
      // Scrape prices from Walmart (most reliable)
      const walmartUrl = `https://www.walmart.com/search?q=${encodeURIComponent(query)}`;
      const walmartRes = await fetchUrl(walmartUrl);
      const walmartResults = parseWalmartPrices(walmartRes.body, query);

      // Scrape Fred Meyer
      const fmUrl = `https://www.fredmeyer.com/search?query=${encodeURIComponent(query)}`;
      const fmRes = await fetchUrl(fmUrl);
      const fmResults = parseFredMeyerPrices(fmRes.body, query);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          query,
          results: [...walmartResults, ...fmResults],
          timestamp: new Date().toISOString()
        })
      };
    }

    if (action === 'weekly-ads') {
      const stores = [
        { name: 'Walmart', url: 'https://www.walmart.com/store/finder?query=' + zip },
        { name: 'Safeway', url: 'https://local.safeway.com/search.html?q=' + zip },
        { name: 'Fred Meyer', url: 'https://www.fredmeyer.com/stores/search?searchText=' + zip },
        { name: 'Grocery Outlet', url: 'https://www.groceryoutlet.com/store-locator?zip=' + zip },
        { name: 'WinCo Foods', url: 'https://www.wincofoods.com/stores' }
      ];
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ stores, zip, timestamp: new Date().toISOString() })
      };
    }

    if (action === 'store-finder') {
      const stores = [
        { name: 'Walmart', url: `https://www.walmart.com/store/finder?query=${zip}`, icon: '🛒' },
        { name: 'Safeway', url: `https://local.safeway.com/search.html?q=${zip}`, icon: '🏪' },
        { name: 'Fred Meyer', url: `https://www.fredmeyer.com/stores/search?searchText=${zip}`, icon: '🛍️' },
        { name: 'Grocery Outlet', url: `https://www.groceryoutlet.com/store-locator?zip=${zip}`, icon: '💰' },
        { name: 'WinCo Foods', url: `https://www.wincofoods.com/stores`, icon: '🌾' }
      ];
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ stores, zip, timestamp: new Date().toISOString() })
      };
    }

    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Unknown action' }) };

  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message })
    };
  }
};
