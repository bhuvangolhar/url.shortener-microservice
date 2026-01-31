# URL Shortener Microservice

## Overview

This project is a backend microservice that provides URL shortening functionality using JavaScript and Node.js.  
It allows users to submit a valid URL and receive a shortened version, which can later be used to redirect to the original URL.

The service is designed as a REST API and focuses on URL validation, unique short ID generation, persistent storage, and proper redirection handling.

---

## User Preferences

- **Preferred communication style**: Simple, everyday language.

---

## System Architecture

### Backend Architecture
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: JavaScript
- **API Design**: RESTful API with JSON responses
- **Routing**: Endpoint-based routing using Express
- **Data Storage**: In-memory storage or database (depending on implementation)
- **Error Handling**: Validation for invalid or unreachable URLs

---

## URL Handling Logic

- The microservice accepts a full URL as input.
- URLs are validated to ensure they follow a proper format (http/https).
- Each valid URL is assigned a unique short identifier.
- The original URL and its short ID are stored for later access.
- When a short URL is accessed, the service redirects the user to the original URL.
- If an invalid URL is submitted, the API returns an error response.

---

## API Specification

### Endpoints

POST /api/shorturl  
GET /api/shorturl/:short_url

### Request Parameters

#### Shorten URL
- **url** (required):
  - A valid URL starting with `http://` or `https://`

### Response Examples

#### Valid URL Input
```json

{
  "original_url": "https://www.example.com",
  "short_url": 1
}

#### Invalid URL Input
```json
{
  "error": "invalid url"
}
```

#### URL Redirection

Accessing:
```
GET /api/shorturl/1
```

Redirects to:
```
https://www.example.com
```
