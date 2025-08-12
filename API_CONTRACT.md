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

### Create a community post

*   **The Feature**: Create a community post
*   **HTTP Method**: POST
*   **Endpoint Path**: `/api/community/posts`
*   **Description**: Creates a new community post with a media URL and caption. Requires Bearer token authentication.
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
*   **Error Response (401 Unauthorized)**:
    ```json
    {
      "error": "Authentication required"
    }
    ```
*   **Error Response (422 Unprocessable Entity)**:
    ```json
    {
      "error": "Invalid JSON or post payload"
    }
    ```

## Social API

### Get all community posts

*   **The Feature**: Get all community posts
*   **HTTP Method**: GET
*   **Endpoint Path**: `/api/social/posts`
*   **Description**: Fetches a list of all community posts.
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
