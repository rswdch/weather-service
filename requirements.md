# Weather Service API Requirements Document

## Overview

The Weather Service API is designed to provide weather information based on latitude and longitude coordinates. The API fetches data from the OpenWeather API and returns the weather condition, temperature classification (hot, cold, moderate), and any active weather alerts for the specified location.

## Business Requirements

The Weather Service is not meant to be a production app but just a demo for educational and evaluation purposes. Therefore, requirements are not as strict as for a full production app. Discussion will be included where a design choice is made that differs from a large-scale production application.

## Key Functional Requirements
- Users should be able to retrieve the current weather conditions given a set of latitude and longitude coordinates.

## Key Non-Functional Requirements

### Performance
There are no specific performance requirements, however the API should respond within a reasonable time (i.e. 5 seconds) under normal load conditions. Instantaneous (i.e. <200 ms) response is not critical for a user simply wishing to check current weather conditions. Depending on the deployment, the application can be containerized and replicated to improve performance under high load.

### Scalability
The API should only need to handle a single user for evaluation but should be able to scale in future development. 

Since the API is stateless, one strategy for scaling would be to containerize the application and deploy it in a container orchestration system that can spin instances up and down to meet demand. Another similar approach would be to implement the API as a serverless function on a cloud provider such as AWS, Azure, or Google Cloud Platform. These are both examples of horizontal scaling.

Additionally or alternatively, the application can be deployed on a single server and hardware such as CPU and RAM can be purchased or upgraded to meet user demand. However, demand can be difficult to anticipate, hardware must be paid for and installed before it can be used, and the performance of hardware does not arbitrarily increase. 

For a stateless API with a single endpoint and relatively few computations, either choice would be valid. An single laptop running an Express server with this API would likely be able to handle several thousand concurrent users while a state-of-the-art server may be able to handle millions. Horizontal scaling is also easy since no application data is stored and we do not need to worry about consistency with scaling data stores.

### Availability
The API only needs to be available for the duration of evaluation. However, replication of the API over multiple instances/servers and geographies would need to be performed in a production scenario. Replication is fairly straightforward since the API is stateless with no storage, but a load balancer would need to be added to ensure traffic is routed to all available instances.

Deploying the API on a cloud provider as a serverless function is an additional way to ensure availibility.

### Capacity 
The API is stateless and does not store any request or response data. Therefore, no persistent storage is needed. 

Memory would scale with the expected size of a weather response in JSON format times the number of concurrent users. We may expect a response from the OpenWeather API to be around 2000 characters on average (i.e. 1 condition and 2-3 alerts) which would equal around 2 kB. Even a 256 MB memory EC2 or Cloud Run instance should be able to handle thousands of concurrent requests.

### Security
No user data is stored, so the main security concerns center around protection of the API key and OpenWeather API billing account.

- **API Key Management:** The API key for accessing the OpenWeather API should be securely stored and not exposed publicly.
- **Rate Limiting:** While not specifically a security requirement, rate limiting should be implemented on any public deployment to prevent abuse of the API and billing costs from OpenWeather. However, rate limiting will not be needed on a private, local deployment of the API used by one human user.
- **Input Validation:** Validation and sanitization of `lat` and `long` query parameters should be performed to prevent injection attacks. 

## Additional Considerations

### Caching
Caching can optionally be implemented to increase performance, response times, and reduce API calls to OpenWeather (and therefore cost). However, since users will mostly be interested in weather a specific location and weather conditions change over time, the return on investment into implementing caching may be negative. 

Creating geographic buckets and caching over latitude and longitude could be practical if the right bucket size is chosen and the number of users is sufficiently large. However, it would be pointless to cache longer than a few minutes since weather can change rapidly. Therefore the number of concurrent active users would likely need to be in the millions to make caching worth the investment.

## Development and Testing

- **Unit Tests:** Unit tests should be performed to ensure that the API delivers the key functional requirements and that there are no bugs in any edge cases. 
- **Integration Tests:** Since the API is fairly simple with a single endpoint, manual (human) integration testing can be performed by instantiating the API and sending requests to the `/weather?lat={LAT}&lon={LON}` endpoint. Automated integration tests can also be written with a library that can send HTTP requests such as Chai with Chai HTTP or Supertest with Jest.
- **Load Testing:** No load testing will be performed as the number of active users will be <10.
