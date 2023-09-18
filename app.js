const http = require('http');
const url = require('url');

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;

  res.setHeader('Content-Type', 'text/plain');

  if (path === '/users') {
    // Handle the '/users' endpoint
    res.writeHead(200);
    res.end('List of users');
  } else if (path === '/products') {
    // Handle the '/products' endpoint
    res.writeHead(200);
    res.end('List of products');
  } else if (path === '/weather') {
    // Handle the '/weather' endpoint
    const cityName = parsedUrl.query.city;

    if (!cityName) {
      res.writeHead(400);
      res.end('City name is missing in the query parameters');
      return;
    }

    try {
      const weatherData = await fetchWeather(cityName);
      res.writeHead(200);
      res.end(`Weather in ${cityName}: ${weatherData.temperature}°C`);
    } catch (error) {
      res.writeHead(500);
      res.end('Error fetching weather data');
    }
  } else {
    // Handle unknown endpoints
    res.writeHead(404);
    res.end('Not Found');
  }
});

const PORT = 3000;

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

async function fetchWeather(cityName) {
  const apiUrl = `https://api.open-meteo.com/v1/forecast?city=${encodeURIComponent(cityName)}&key=${apiKey}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.current_weather && data.current_weather.temperature) {
      return {
        temperature: data.current_weather.temperature,
      };
    } else {
      throw new Error('Weather data not available');
    }
  } catch (error) {
    throw error;
  }
}
