const https = require('https');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || 'sk-2K2GBE9BEQ5oDicc8QKXLc';

// Call OpenAI to get realistic grocery price data
function callOpenAI(prompt) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a grocery price intelligence assistant. You provide realistic, current US grocery prices across major stores. Always respond with valid JSON only — no markdown, no explanation, just the JSON object.'
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0.3,
      max_tokens: 800
    });

    const options = {
      hostname: 'api.openai.com',
      path: '/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Length': Buffer.byteLength(body)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          const content = parsed.choices[0].message.content.trim();
          resolve(content);
        } catch (e) {
          reject(new Error('OpenAI parse error: ' + e.message));
        }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
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
      const prompt = `Give me realistic current US grocery store prices for "${query}" across these 5 stores: Walmart, WinCo Foods, Fred Meyer, Safeway, and Grocery Outlet.

Return a JSON object in exactly this format (no markdown, just raw JSON):
{
  "query": "${query}",
  "results": [
    { "store": "Walmart", "name": "exact product name with size/weight", "price": "$X.XX" },
    { "store": "WinCo Foods", "name": "exact product name with size/weight", "price": "$X.XX" },
    { "store": "Fred Meyer", "name": "exact product name with size/weight", "price": "$X.XX" },
    { "store": "Safeway", "name": "exact product name with size/weight", "price": "$X.XX" },
    { "store": "Grocery Outlet", "name": "exact product name with size/weight", "price": "$X.XX" }
  ],
  "timestamp": "${new Date().toISOString()}"
}

Use realistic prices that reflect typical price differences between these stores (WinCo and Walmart cheapest, Safeway most expensive, Grocery Outlet varies). Include the specific product size/weight in the name (e.g. "Ground Beef 80/20 1 lb" not just "hamburger").`;

      const aiResponse = await callOpenAI(prompt);

      // Parse the AI response — strip any accidental markdown fences
      let cleaned = aiResponse.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();
      const data = JSON.parse(cleaned);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(data)
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
      body: JSON.stringify({ error: err.message, results: [] })
    };
  }
};
