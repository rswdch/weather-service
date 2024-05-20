# Weather Service Project

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## Description

Weather Service is an http server that uses the Open Weather API and exposes an endpoint that takes in lat/long coordinates. This endpoint should return what the weather condition is outside in that area (snow, rain, etc), whether it’s hot, cold, or moderate outside (discretion is used on what temperature equates to each type), and whether there are any weather alerts going on in that area, with what is going on if there is currently an active alert. 

This service is based on the OpenWeather API which can be found here: https://openweathermap.org/api. The one-call api returns all of the data while the other apis are piece-mealed sections. You may also find the https://openweathermap.org/faq useful.

## Features

- Returns the current weather condition (snow, rain, etc).
- Returns the temperature condition (hot, cold, moderate).
- Returns any weather alerts in the given area.

## Installation

1. Clone the repository: `git clone https://github.com/rswdch/weather-service.git`
2. Install dependencies: `npm install`

## Usage

1. Set up the required environment variables:
- OpenWeather API Key OPENWEATHER_API_KEY
2. Build build the service `npm run build`
3. Start the server: `npm start`
4. Access the API at `http://localhost:3000`

## API Documentation

### Request Parameters

- **lat** (required): Latitude of the location, between -90 and 90.
  - **Type:** String
  - **Example:** `35.6895`
- **lon** (required): Longitude of the location, between -180 and 180.
  - **Type:** String
  - **Example:** `139.6917`

### Response Body

- **Content-Type:** `application/json`
- **Status Codes:**
  - `200 OK`: Request was successful.
  - `400 Bad Request`: Missing or invalid latitude/longitude parameters.
  - `404 Not Found`: Invalid endpoint.
  - `500 Internal Server Error`: Error fetching data from OpenWeather API or processing the request.

- **Response Body:**
  ```json
  {
    "weather_conditions": ["rain"],
    "temperature": "moderate",
    "alerts": [
      {
        "event": "Heavy Rain",
        "description": "Expected heavy rainfall from 3 PM to 6 PM."
      }
    ]
  }
  ```


## License

This project is licensed under the [MIT License](LICENSE).

## Contact

- Author: Ryan Sawadichai
- Email: ryan.sawadichai@outlook.com
- GitHub: [rswdch](https://github.com/rswdch)