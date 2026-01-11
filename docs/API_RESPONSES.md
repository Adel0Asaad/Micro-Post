# MicroPost API Documentation

All API responses follow this structure:

```json
{
  "headers": {
    "status": <number>,
    "description": "<string>"
  },
  "body": {
    // Response data
  }
}
```

---

## Authentication APIs

### POST `/api/auth/login`

Login with email and password. Sets HTTP-only cookie for session.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Success Response (200):**

```json
{
  "headers": {
    "status": 200,
    "description": "OK"
  },
  "body": {
    "message": "Login successful",
    "user": {
      "id": "clxxx...",
      "email": "user@example.com",
      "name": "John Doe"
    }
  }
}
```

**Error Responses:**

- **400 Bad Request** - Missing email or password

```json
{
  "headers": {
    "status": 400,
    "description": "Bad Request"
  },
  "body": {
    "error": "Email and password are required"
  }
}
```

- **401 Unauthorized** - Invalid credentials

```json
{
  "headers": {
    "status": 401,
    "description": "Unauthorized"
  },
  "body": {
    "error": "Invalid email or password"
  }
}
```

---

### POST `/api/auth/register`

Register a new user account.

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "password123"
}
```

**Success Response (201):**

```json
{
  "headers": {
    "status": 201,
    "description": "File Created"
  },
  "body": {
    "message": "Registration successful",
    "user": {
      "id": "clxxx...",
      "email": "user@example.com",
      "name": "John Doe"
    }
  }
}
```

**Error Responses:**

- **400 Bad Request** - Missing required fields

```json
{
  "headers": {
    "status": 400,
    "description": "Bad Request"
  },
  "body": {
    "error": "Email, password, and name are required"
  }
}
```

- **409 Conflict** - Email already exists

```json
{
  "headers": {
    "status": 409,
    "description": "Conflict"
  },
  "body": {
    "error": "User with this email already exists"
  }
}
```

---

### POST `/api/auth/logout`

Logout and clear session cookie.

**Request Body:** None

**Success Response (200):**

```json
{
  "headers": {
    "status": 200,
    "description": "OK"
  },
  "body": {
    "message": "Logout successful"
  }
}
```

---

### GET `/api/auth/session`

Get current user session. Requires HTTP-only auth cookie.

**Request Body:** None

**Success Response (200):**

```json
{
  "headers": {
    "status": 200,
    "description": "OK"
  },
  "body": {
    "user": {
      "id": "clxxx...",
      "email": "user@example.com",
      "name": "John Doe"
    }
  }
}
```

**Error Response:**

- **401 Unauthorized** - No valid session

```json
{
  "headers": {
    "status": 401,
    "description": "Unauthorized"
  },
  "body": {
    "error": "Not authenticated"
  }
}
```

---

## Posts APIs

### GET `/api/posts`

Get all posts. Requires authentication.

**Request Body:** None

**Success Response (200):**

```json
{
  "headers": {
    "status": 200,
    "description": "OK"
  },
  "body": {
    "posts": [
      {
        "id": "clxxx...",
        "content": "Hello world!",
        "createdAt": "2026-01-11T10:00:00.000Z",
        "user": {
          "id": "clxxx...",
          "name": "John Doe",
          "email": "user@example.com"
        }
      }
    ]
  }
}
```

**Error Response:**

- **401 Unauthorized** - Not authenticated

```json
{
  "headers": {
    "status": 401,
    "description": "Unauthorized"
  },
  "body": {
    "error": "Authentication required"
  }
}
```

---

### POST `/api/posts`

Create a new post. Requires authentication.

**Request Body:**

```json
{
  "content": "Hello world!"
}
```

**Success Response (201):**

```json
{
  "headers": {
    "status": 201,
    "description": "File Created"
  },
  "body": {
    "post": {
      "id": "clxxx...",
      "content": "Hello world!",
      "createdAt": "2026-01-11T10:00:00.000Z",
      "user": {
        "id": "clxxx...",
        "name": "John Doe",
        "email": "user@example.com"
      }
    }
  }
}
```

**Error Responses:**

- **400 Bad Request** - Missing or invalid content

```json
{
  "headers": {
    "status": 400,
    "description": "Bad Request"
  },
  "body": {
    "error": "Content is required"
  }
}
```

- **400 Bad Request** - Content too long

```json
{
  "headers": {
    "status": 400,
    "description": "Bad Request"
  },
  "body": {
    "error": "Content must be 280 characters or less"
  }
}
```

---

### GET `/api/posts/:postId`

Get a specific post by ID. Requires authentication.

**Request Body:** None

**Success Response (200):**

```json
{
  "headers": {
    "status": 200,
    "description": "OK"
  },
  "body": {
    "post": {
      "id": "clxxx...",
      "content": "Hello world!",
      "createdAt": "2026-01-11T10:00:00.000Z",
      "user": {
        "id": "clxxx...",
        "name": "John Doe",
        "email": "user@example.com"
      }
    }
  }
}
```

**Error Response:**

- **404 Not Found** - Post doesn't exist

```json
{
  "headers": {
    "status": 404,
    "description": "Not Found"
  },
  "body": {
    "error": "Post not found"
  }
}
```

---

### DELETE `/api/posts/:postId`

Delete a post. Requires authentication. User can only delete their own posts.

**Request Body:** None

**Success Response (200):**

```json
{
  "headers": {
    "status": 200,
    "description": "OK"
  },
  "body": {
    "message": "Post deleted successfully",
    "post": {
      "id": "clxxx...",
      "content": "Hello world!",
      "createdAt": "2026-01-11T10:00:00.000Z"
    }
  }
}
```

**Error Response:**

- **404 Not Found** - Post not found or no permission

```json
{
  "headers": {
    "status": 404,
    "description": "Not Found"
  },
  "body": {
    "error": "Post not found or you don't have permission to delete it"
  }
}
```

---

## Users APIs

### GET `/api/users`

Get all users. Requires authentication.

**Request Body:** None

**Success Response (200):**

```json
{
  "headers": {
    "status": 200,
    "description": "OK"
  },
  "body": {
    "users": [
      {
        "id": "clxxx...",
        "name": "John Doe",
        "email": "user@example.com",
        "createdAt": "2026-01-10T10:00:00.000Z"
      }
    ]
  }
}
```

---

### GET `/api/users/:userId/posts`

Get all posts for a specific user. Requires authentication.

**Request Body:** None

**Success Response (200):**

```json
{
  "headers": {
    "status": 200,
    "description": "OK"
  },
  "body": {
    "user": {
      "id": "clxxx...",
      "name": "John Doe",
      "email": "user@example.com"
    },
    "posts": [
      {
        "id": "clxxx...",
        "content": "Hello world!",
        "createdAt": "2026-01-11T10:00:00.000Z",
        "user": {
          "id": "clxxx...",
          "name": "John Doe",
          "email": "user@example.com"
        }
      }
    ]
  }
}
```

**Error Response:**

- **404 Not Found** - User doesn't exist

```json
{
  "headers": {
    "status": 404,
    "description": "Not Found"
  },
  "body": {
    "error": "User not found"
  }
}
```

---

## HTTP-Only Cookie Authentication

All authenticated endpoints require an HTTP-only cookie named `auth-token`.

**Cookie Properties:**

- `httpOnly: true` - Prevents JavaScript access (XSS protection)
- `secure: true` (in production) - HTTPS only
- `sameSite: 'lax'` - CSRF protection
- `maxAge: 7 days` - Token expiration

The cookie is automatically set on login/register and cleared on logout.
