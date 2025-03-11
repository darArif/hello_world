const axios = require('axios');

const OPEN_METEO_URL =
  'https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m';

exports.handler = async (event) => {
  try {
    // Validate HTTP method
    if (event.httpMethod !== 'GET') {
      return {
        statusCode: 400,
        body: JSON.stringify({
          statusCode: 400,
          message: `Bad request syntax or unsupported method. Request path: ${event.path}. HTTP method: ${event.httpMethod}`,
        }),
      };
    }

    // Fetch weather data from Open-Meteo API
    const response = await axios.get(OPEN_METEO_URL);

    // Return successful response
    return {
      statusCode: 200,
      body: JSON.stringify(response.data),
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);

    // Handle errors
    return {
      statusCode: 500,
      body: JSON.stringify({
        statusCode: 500,
        message: 'Internal server error',
      }),
    };
  }
};