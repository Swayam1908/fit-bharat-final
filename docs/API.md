# API Documentation

FitBharat utilizes Next.js Route Handlers to expose secure backend APIs for processing authentication data and NLP parsing requests.

---

## 1. Auth Endpoint (/api/auth/[...nextauth])
Exposes default NextAuth routing mechanisms (callbacks, sign-ins, and tokens encryption) used to validate credentials and save user sessions.

* **GET `/api/auth/session`**: Retrieves the active logged-in user profile payload.
* **POST `/api/auth/signin/credentials`**: Handles credentials authentication checks.

---

## 2. AI Meal Parser (/api/parse-meal)
Allows users to input natural language food descriptions, parsing them into calorie metrics.

* **Method**: `POST`
* **Content-Type**: `application/json`
* **Request Body**:
  ```json
  {
    "prompt": "I had 2 cups of brown rice with dal and paneer"
  }
  ```
* **Response Payload (Success)**:
  ```json
  {
    "success": true,
    "items": [
      { "name": "Brown Rice", "quantity": 2, "unit": "cups", "calories": 400, "protein": 8, "carbs": 88, "fat": 3 },
      { "name": "Dal", "quantity": 1, "unit": "bowl", "calories": 150, "protein": 9, "carbs": 24, "fat": 2 }
    ],
    "totals": {
      "calories": 550,
      "protein": 17,
      "carbs": 112,
      "fat": 5
    }
  }
  ```
