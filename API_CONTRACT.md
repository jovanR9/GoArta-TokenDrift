# API Contract

This document outlines the API contract for the GoArta application.

## Itineraries API

### Generate a new itinerary

*   **The Feature**: Generate a travel itinerary
*   **HTTP Method**: POST
*   **Endpoint Path**: `/api/itineraries/generate`
*   **Description**: Generates a travel itinerary based on user preferences like interests, duration, and pace.
*   **Request Body**:
    ```json
    {
      "interests": ["museums", "food", "nature"],
      "duration_days": 3,
      "pace": "moderate"
    }
    ```
*   **Success Response (200 OK)**:
    ```json
    {
      "itinerary_id": "string",
      "days": [
        {
          "day": "integer",
          "activities": [
            {
              "experience_id": "integer",
              "name": "string",
              "time_slot": "string"
            }
          ]
        }
      ]
    }
    ```
*   **Error Response (422 Unprocessable Entity)**:
    ```json
    {
      "error": "Invalid preferences or JSON body"
    }
    ```

## Community API

### Get all community posts

*   **The Feature**: Get all community posts
*   **HTTP Method**: GET
*   **Endpoint Path**: `/api/community/posts`
*   **Description**: Fetches a list of all community posts.
*   **Request Body**: (Not applicable)
*   **Success Response (200 OK)**:
    ```json
    [
      {
        "id": 101,
        "author_id": 42,
        "media_url": "https://example.com/photo.jpg",
        "caption": "Had a great time hiking!",
        "created_at": "2025-08-12T12:34:56Z"
      }
    ]
    ```

## Social API

### Create a community post

*   **The Feature**: Create a community post
*   **HTTP Method**: POST
*   **Endpoint Path**: `/api/social/posts`
*   **Description**: Creates a new community post with a media URL and caption.
*   **Request Body**:
    ```json
    {
      "media_url": "https://example.com/photo.jpg",
      "caption": "Enjoying the sunset at the beach!"
    }
    ```
*   **Success Response (201 Created)**:
    ```json
    {
      "id": 123,
      "author_id": 42,
      "media_url": "string",
      "caption": "string",
      "created_at": "date-time"
    }
    ```
*   **Error Response (422 Unprocessable Entity)**:
    ```json
    {
      "error": "Invalid JSON or post payload"
    }
    ```

## Events API

### Get all events or filter by category

*   **The Feature**: Get all events or filter by category
*   **HTTP Method**: GET
*   **Endpoint Path**: `/api/events`
*   **Description**: Retrieves a list of all events, optionally filtered by category.
*   **Request Body**: (Not applicable for GET requests with query parameters)
*   **Query Parameters**:
    *   `category` (Optional): Filter events by category (e.g., 'Traditional Festival', 'Cultural Fair')
*   **Success Response (200 OK)**:
    ```json
    [
      {
        "id": 501,
        "title": "Sao Joao Festival",
        "category": "Traditional Festival",
        "start_time": "2026-06-24T10:00:00Z",
        "venue_name": "Various locations in North Goa"
      }
    ]
    ```

### Get a particular event by ID

*   **The Feature**: Get a particular event by ID
*   **HTTP Method**: GET
*   **Endpoint Path**: `/api/events/{id}`
*   **Description**: Retrieves details for a single event by its ID.
*   **Request Body**: (Not applicable)
*   **Path Parameters**:
    *   `id` (Required): ID of the event to retrieve
*   **Success Response (200 OK)**:
    ```json
    {
      "id": 501,
      "title": "Sao Joao Festival",
      "description": "The feast of St. John the Baptist... ",
      "category": "Traditional Festival",
      "start_time": "2026-06-24T10:00:00Z",
      "end_time": "2026-06-24T18:00:00Z",
      "venue_name": "Various locations in North Goa",
      "ticket_price": 0,
      "booking_url": null
    }
    ```
*   **Error Response (404 Not Found)**:
    ```json
    {
      "error": "Event not found."
    }
    ```