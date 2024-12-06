# Exhibition Center API Examples

## Prerequisites
- Server running at `http://localhost:3000`
- MongoDB running
- Sample floor plan images ready for upload

## API Examples

### 1. Create a New Exhibition Center
```bash
curl -X POST http://localhost:3000/api/exhibitions \
  -F "name=Tokyo Big Sight" \
  -F "levels[]=1F" \
  -F "levels[]=2F" \
  -F "floorPlans=@/path/to/floor1.jpg" \
  -F "floorPlans=@/path/to/floor2.jpg"
```

Expected Response:
```json
{
  "_id": "65f1234567890abcdef12345",
  "name": "Tokyo Big Sight",
  "floorPlans": [
    {
      "level": "1F",
      "imageUrl": "/uploads/floorplans/floorPlans-1234567890-1.jpg",
      "imageType": "image/jpeg"
    },
    {
      "level": "2F",
      "imageUrl": "/uploads/floorplans/floorPlans-1234567890-2.jpg",
      "imageType": "image/jpeg"
    }
  ],
  "createdAt": "2024-03-13T00:00:00.000Z",
  "updatedAt": "2024-03-13T00:00:00.000Z"
}
```

### 2. Get All Exhibition Centers
```bash
curl http://localhost:3000/api/exhibitions
```

Expected Response:
```json
[
  {
    "_id": "65f1234567890abcdef12345",
    "name": "Tokyo Big Sight",
    "floorPlans": [
      {
        "level": "1F",
        "imageUrl": "/uploads/floorplans/floorPlans-1234567890-1.jpg",
        "imageType": "image/jpeg"
      },
      {
        "level": "2F",
        "imageUrl": "/uploads/floorplans/floorPlans-1234567890-2.jpg",
        "imageType": "image/jpeg"
      }
    ],
    "createdAt": "2024-03-13T00:00:00.000Z",
    "updatedAt": "2024-03-13T00:00:00.000Z"
  }
]
```

### 3. Get a Specific Exhibition Center
```bash
curl http://localhost:3000/api/exhibitions/65f1234567890abcdef12345
```

Expected Response:
```json
{
  "_id": "65f1234567890abcdef12345",
  "name": "Tokyo Big Sight",
  "floorPlans": [
    {
      "level": "1F",
      "imageUrl": "/uploads/floorplans/floorPlans-1234567890-1.jpg",
      "imageType": "image/jpeg"
    },
    {
      "level": "2F",
      "imageUrl": "/uploads/floorplans/floorPlans-1234567890-2.jpg",
      "imageType": "image/jpeg"
    }
  ],
  "createdAt": "2024-03-13T00:00:00.000Z",
  "updatedAt": "2024-03-13T00:00:00.000Z"
}
```

### 4. Update an Exhibition Center
```bash
# Update name only
curl -X PUT http://localhost:3000/api/exhibitions/65f1234567890abcdef12345 \
  -H "Content-Type: application/json" \
  -d '{"name": "Tokyo Big Sight East"}'

# Update with new floor plans
curl -X PUT http://localhost:3000/api/exhibitions/65f1234567890abcdef12345 \
  -F "name=Tokyo Big Sight East" \
  -F "levels[]=1F" \
  -F "levels[]=2F" \
  -F "levels[]=3F" \
  -F "floorPlans=@/path/to/new_floor1.jpg" \
  -F "floorPlans=@/path/to/new_floor2.jpg" \
  -F "floorPlans=@/path/to/new_floor3.jpg"
```

Expected Response:
```json
{
  "_id": "65f1234567890abcdef12345",
  "name": "Tokyo Big Sight East",
  "floorPlans": [
    {
      "level": "1F",
      "imageUrl": "/uploads/floorplans/floorPlans-9876543210-1.jpg",
      "imageType": "image/jpeg"
    },
    {
      "level": "2F",
      "imageUrl": "/uploads/floorplans/floorPlans-9876543210-2.jpg",
      "imageType": "image/jpeg"
    },
    {
      "level": "3F",
      "imageUrl": "/uploads/floorplans/floorPlans-9876543210-3.jpg",
      "imageType": "image/jpeg"
    }
  ],
  "createdAt": "2024-03-13T00:00:00.000Z",
  "updatedAt": "2024-03-13T00:00:01.000Z"
}
```

### 5. Delete an Exhibition Center
```bash
curl -X DELETE http://localhost:3000/api/exhibitions/65f1234567890abcdef12345
```

Expected Response:
```json
{
  "message": "Exhibition center deleted successfully"
}
```

## Notes
- Replace `65f1234567890abcdef12345` with actual exhibition center IDs from your database
- Replace `/path/to/floor1.jpg` with actual paths to your floor plan images
- Supported image formats: JPG, PNG
- Maximum file size: 5MB per image
- The server will store uploaded images in the `public/uploads/floorplans` directory
- Image URLs in responses are relative to the server's base URL

## Testing with Postman
1. Create a new request in Postman
2. Set the request method (POST, GET, PUT, or DELETE)
3. Enter the URL (e.g., `http://localhost:3000/api/exhibitions`)
4. For POST and PUT requests with files:
   - Select "form-data" in the request body
   - Add key-value pairs:
     - `name` (text)
     - `levels[]` (text) for each level
     - `floorPlans` (file) for each floor plan image
5. Send the request

## Error Responses
The API may return the following error responses:

```json
// 400 Bad Request
{
  "error": "Levels array must match the number of uploaded files"
}

// 404 Not Found
{
  "error": "Exhibition center not found"
}

// 400 Bad Request (File type error)
{
  "error": "Invalid file type. Only JPG and PNG are allowed."
}

// 500 Internal Server Error
{
  "error": "Failed to fetch exhibition centers"
}
```
