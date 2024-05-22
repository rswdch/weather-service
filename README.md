# Weather Service Project

## Description

The purpose of this Weather Service is to demonstrate a Node.js/Express http server that uses the Open Weather API and exposes an endpoint that takes in lat/long coordinates. The endpoint returns what the weather condition is outside in that area (snow, rain, etc), whether it’s hot, cold, or moderate outside (discretion is used on what temperature equates to each type), and whether there are any weather alerts going on in that area, with what is going on if there is currently an active alert. 

This service is based on the OpenWeather OneCall API which can be found here: https://openweathermap.org/api.

## Features

- Returns the current weather condition (snow, rain, etc).
- Returns the temperature condition (hot, cold, moderate).
- Returns any weather alerts in the given area.

## Installation

1. Clone the repository: `git clone https://github.com/rswdch/weather-service.git`
2. Install dependencies: `npm install`

## Usage

1. Set up the required environment variables i.e. in `.env`, system-wide, or on the deployment platform:
  - `PORT`: Port on which the server runs.
  - `OPENWEATHER_API_KEY`: OpenWeather API key. Please generate your own key since the OneCall API is not free.
2. Build build the service `npm run build`
3. Start the server: `npm start`
4. Access the API at `http://localhost:3000`

## Dependencies

- **Framework:** Express.js
- **Language:** TypeScript (Node.js)
- **Dependencies:** 
  - Express: Lightweight Node.js based back end API framework which uses the middleware design pattern to enforce separation of concerns and modular and allow for the development reusable code. Express also contains a rich ecosystem of open-source libraries that can be used to quickly build an application.
  - Zod: Validation library which provides data validation based on custom defined schemas and outputs typed variables after validation for ease of validation and request validation in TypeScript.
  - Winston: Node.js logging library which supports standard logging levels (info, warn, debug, etc) and multiple transports (file, database, cloud services).
  - express-winston: Logging middleware for Express and Winston to automatically log http requests.
  - winston-transport: Mainly for Winston types for TypeScript, though can be used to configure custom transports.
  - @google-cloud/logging-winston: Official Google Cloud transport plugin for Winston for logging when deployed on Google Cloud.
  - dotenv: Used to hide secrets in `.env` file so they are not exposed in application code.
- **Dev Dependencies:***
  - typescript, ts-*, @typtes/* required for TypeScript support and typing.
  - jest: simple unit testing library with similar syntax to Mocha and Jasmine.
  - supertest: integration testing library that can be paired with a unit testing library for http request testing.
  - nodemon: dev server that watches and reloads file changes.

## API Documentation

### Endpoint Definition

- **Endpoint:** `/weather`
- **Method:** GET
- **Description:** Returns weather information for a given set of latitude and longitude coordinates.

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
    "feeling": "cold",
    "weather_conditions": [{
      "shortDesc": "Clouds",
      "longDesc": "overcast clouds",
    }],
    "temperature": "6.37",
    "alerts": [
      {
        "event": "Heavy Rain",
        "description": "Expected heavy rainfall from 3 PM to 6 PM."
      }
    ]
  }
  ```

### Detailed Response Fields

- **weather_condition**: The primary weather condition (e.g., clear, rain, snow).
  - **Type:** String

- **temperature**: Description of the temperature based on thresholds.
  - **Type:** String
  - **Values:** `cold`, `moderate`, `hot`

- **alerts**: A list of active weather alerts.
  - **Type:** Array of objects
  - **Each Object Contains:**
    - **event**: The name of the weather event.
      - **Type:** String
    - **description**: Detailed description of the alert.
      - **Type:** String

### Temperature Classification

Temperature classification is only used in one part of the application, which is set in `./openweather-api-node/src/api/weather/weather.service.ts` under the exported `classifyTemp` function. 

- **Cold:** Temperature < 15°C
- **Moderate:** 15°C ≤ Temperature ≤ 27°C
- **Hot:** Temperature > 27°C

### Error Handling

All errors will return an http status code. Errors are handled either through the Express global error handler middleware or the 404 middleware defined in `./openweather-api-node/src/index.ts`.

- **400 Bad Request:**
  - Missing `lat` or `lon` parameter.
  - Invalid `lat` or `lon` value (e.g., non-numeric).
  - `lat` out of range (>90 or <-90)
  - `lon` out of range (>180 or <-180)
  - OpenWeather API key not provided.

- **404 Not Found:**
  - Any endpoint that has not been implemented. 

- **500 Internal Server Error:**
  - Unable to fetch data from OpenWeather API.
  - Unexpected errors during data processing.

## Requirements

Implementation details on how requirements are satisfied are quickly summarized in this section. See [requirements.md](./requirements.md) for requirement definitions and a deeper discussion of the design choices made to satisfy the requirements.

### Functional Requirements

Functional requirements are satisfied with a Node.js server running Express with logic implementing the API as specified at the endpoint `/weather`. The endpoint accepts the query params `lat` and `lon`. Once an API key is specified as the value of the environment variable `OPENWEATHER_API_KEY` and the application is served, the requirements are met.

### Non-Functional Requirements
Non-functional requirements are primarily satisfied through architecture, system design, and deployment details. Additional discussion can be found in [requirements.md](./requirements.md). While the application can be run locally, it is also hosted on Google Cloud Platform to demonstrate horizontal scaling. 

![Google Cloud Deployment Diagram](./gcp_diagram.png)

The Express.js web server is containerized with Docker, then deployed on Google Cloud Run is a managered stateless container hosting platform that uses Kubernetes and Knative under the hood. Containerizing and hosting on Google Cloud Run allows the service to scale horizontally. 

In order to protect abuse of the API, the Google Cloud Load Balancer is used in conjunction with Google Cloud Armor for rate limiting. In order to remain under the free tier of the OpenWeather OneCall API, requests are limited to 1000 per day.

If a demonstration is desired, please contact me for a link.

### Testing

- **Unit Tests:** Unit tests for functionality have been performed using Jest and can be found at [weather.unit.test.ts](./openweather-api-node/src/api/weather/weather.unit.test.ts). 
- **Integration Tests:** Integration tests are written with Supertest. Status codes 200, 400, and 404 are checked along with functional testing of the API for the presence of the fields expected. 
- **Load Testing:** No load testing will be performed as the number of active users will be <10.


## License

This is a personal project for portfolio and demonstration purposes only. Please do not reproduce the project.

## Contact

- Author: Ryan Sawadichai
- Email: ryan.sawadichai@outlook.com
- GitHub: [rswdch](https://github.com/rswdch)
