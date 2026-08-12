# Pocket - A Blog Posting Application API

A RESTful API for a blog posting application with user authentication, CRUD operations, likes/dislikes, and trending posts.

## Credentials

### Normal User
- **Email**: `guest@mail.com`
- **Username**: `guest`
- **Password**: `guest1234`

### Admin User
- **Email**: `admin@mail.com`
- **Username**: `admin`
- **Password**: `admin123`

## API Functions

### User Authentication

#### Register User
- **URL**: `/users/register`
- **Method**: `POST`
- **Body**:
```json
{
  "email": "guest@mail.com",
  "username": "guest",
  "password": "guest1234"
}
```
- **Success Response**: `201 Created`
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "userId",
    "email": "guest@mail.com",
    "username": "guest"
  }
}
```

#### Login User
- **URL**: `/users/login`
- **Method**: `POST`
- **Body**:
```json
{
  "email": "guest@mail.com",
  "password": "guest1234"
}
```
- **Success Response**: `200 OK`
```json
{
  "message": "Login successful",
  "token": "jwt-token",
  "user": {
    "id": "userId",
    "email": "guest@mail.com",
    "username": "guest",
    "isAdmin": false
  }
}
```

### Blog Posts

#### Create Post
- **URL**: `/posts`
- **Method**: `POST`
- **Auth Required**: Yes
- **Headers**: 
```
Authorization: Bearer <token>
```
- **Body**:
```json
{
  "title": "Post Title",
  "content": "Post content here"
}
```
- **Success Response**: `201 Created`
```json
{
  "message": "Post created successfully",
  "post": {
    "_id": "postId",
    "title": "Post Title",
    "content": "Post content here",
    "author": "userId",
    "authorName": "guest",
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  }
}
```

#### Get All Posts
- **URL**: `/posts`
- **Method**: `GET`
- **Auth Required**: No
- **Success Response**: `200 OK`
```json
{
  "message": "Posts retrieved successfully",
  "posts": [
    {
      "_id": "postId",
      "title": "Post Title",
      "content": "Post content",
      "author": {
        "_id": "userId",
        "username": "guest",
        "email": "guest@mail.com"
      },
      "authorName": "guest",
      "createdAt": "timestamp",
      "updatedAt": "timestamp"
    }
  ]
}
```

#### Get Single Post
- **URL**: `/posts/:id`
- **Method**: `GET`
- **Auth Required**: No
- **Success Response**: `200 OK`
```json
{
  "message": "Post retrieved successfully",
  "post": {
    "_id": "postId",
    "title": "Post Title",
    "content": "Post content",
    "author": {
      "_id": "userId",
      "username": "guest",
      "email": "guest@mail.com"
    },
    "authorName": "guest",
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  }
}
```

#### Update Post
- **URL**: `/posts/:id`
- **Method**: `PUT`
- **Auth Required**: Yes
- **Headers**: 
```
Authorization: Bearer <token>
```
- **Body**:
```json
{
  "title": "Updated Title",
  "content": "Updated content"
}
```
- **Success Response**: `200 OK`
```json
{
  "message": "Post updated successfully",
  "post": {
    "_id": "postId",
    "title": "Updated Title",
    "content": "Updated content",
    "author": "userId",
    "authorName": "guest",
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  }
}
```
- **Note**: Users can only update their own posts. Admins can update any post.

#### Delete Post
- **URL**: `/posts/:id`
- **Method**: `DELETE`
- **Auth Required**: Yes
- **Headers**: 
```
Authorization: Bearer <token>
```
- **Success Response**: `200 OK`
```json
{
  "message": "Post deleted successfully"
}
```
- **Note**: Users can only delete their own posts. Admins can delete any post.

#### Like Post
- **URL**: `/posts/:id/like`
- **Method**: `POST`
- **Auth Required**: Yes
- **Headers**: 
```
Authorization: Bearer <token>
```
- **Success Response**: `200 OK`
```json
{
  "message": "Post like updated",
  "post": {
    "_id": "postId",
    "likes": ["userId1", "userId2"],
    "dislikes": []
  }
}
```

#### Dislike Post
- **URL**: `/posts/:id/dislike`
- **Method**: `POST`
- **Auth Required**: Yes
- **Headers**: 
```
Authorization: Bearer <token>
```
- **Success Response**: `200 OK`
```json
{
  "message": "Post dislike updated",
  "post": {
    "_id": "postId",
    "likes": [],
    "dislikes": ["userId1"]
  }
}
```

#### Get Trending Posts
- **URL**: `/posts/trending`
- **Method**: `GET`
- **Auth Required**: No
- **Success Response**: `200 OK`
```json
{
  "message": "Trending posts retrieved successfully",
  "posts": []
}
```
- **Note**: Returns top 5 posts sorted by likes.

#### Get New Posts
- **URL**: `/posts/new`
- **Method**: `GET`
- **Auth Required**: No
- **Success Response**: `200 OK`
```json
{
  "message": "New posts retrieved successfully",
  "posts": []
}
```
- **Note**: Returns 5 most recent posts.

### Comments

#### Create Comment
- **URL**: `/posts/:postId/comments`
- **Method**: `POST`
- **Auth Required**: Yes
- **Headers**: 
```
Authorization: Bearer <token>
```
- **Body**:
```json
{
  "content": "This is a comment"
}
```
- **Success Response**: `201 Created`
```json
{
  "message": "Comment created successfully",
  "comment": {
    "_id": "commentId",
    "content": "This is a comment",
    "post": "postId",
    "author": "userId",
    "authorName": "guest",
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  }
}
```

#### Get Comments for a Post
- **URL**: `/posts/:postId/comments`
- **Method**: `GET`
- **Auth Required**: No
- **Success Response**: `200 OK`
```json
{
  "message": "Comments retrieved successfully",
  "comments": [
    {
      "_id": "commentId",
      "content": "This is a comment",
      "post": "postId",
      "author": {
        "_id": "userId",
        "username": "guest",
        "email": "guest@mail.com"
      },
      "authorName": "guest",
      "createdAt": "timestamp",
      "updatedAt": "timestamp"
    }
  ]
}
```

#### Update Comment
- **URL**: `/comments/:id`
- **Method**: `PUT`
- **Auth Required**: Yes
- **Headers**: 
```
Authorization: Bearer <token>
```
- **Body**:
```json
{
  "content": "Updated comment content"
}
```
- **Success Response**: `200 OK`
```json
{
  "message": "Comment updated successfully",
  "comment": {
    "_id": "commentId",
    "content": "Updated comment content",
    "post": "postId",
    "author": "userId",
    "authorName": "guest",
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  }
}
```
- **Note**: Users can only update their own comments. Admins can update any comment.

#### Delete Comment
- **URL**: `/comments/:id`
- **Method**: `DELETE`
- **Auth Required**: Yes
- **Headers**: 
```
Authorization: Bearer <token>
```
- **Success Response**: `200 OK`
```json
{
  "message": "Comment deleted successfully"
}
```
- **Note**: Users can only delete their own comments. Admins can delete any comment.

## Error Responses

All endpoints may return the following error responses:

- `400 Bad Request`: Missing or invalid data
- `401 Unauthorized`: Invalid or missing token
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error
