# Multer Implementation for Image Uploads

## Summary

Successfully implemented multer for handling file uploads instead of base64 encoding. This provides better performance, memory efficiency, and follows best practices for file handling.

## Changes Made

### Backend Changes

#### 1. **Installed Dependencies**
```bash
npm install multer @types/multer
```

#### 2. **Created Upload Middleware** (`src/middleware/upload.middleware.ts`)
- Configured multer with disk storage
- Files are saved to `backend/data/images/` directory
- Unique filenames generated using timestamp + random string
- File validation: Only accepts images (JPEG, PNG, GIF, WebP)
- File size limit: 10MB
- Automatic directory creation if it doesn't exist

#### 3. **Updated Actions Model** (`src/models/actions.model.ts`)
- Changed `activity_type` from `number` to `string`
- Added new fields to match database schema:
  - `activity_title`: string
  - `activity_description`: string
  - `activity_date`: string
- Updated `CreateActionInput` type accordingly

#### 4. **Updated Actions Service** (`src/services/actions.services.ts`)
- Modified SQL INSERT to include all new fields:
  - `activity_type`
  - `activity_title`
  - `activity_description`
  - `activity_date`
  - `user_id`
  - `imagem_path`

#### 5. **Updated Actions Controller** (`src/controllers/actions.controller.ts`)
- **create method**:
  - Now expects multipart/form-data with file upload
  - Validates all required fields from request body
  - Stores image filename (not full path) in database
  - Automatic cleanup of uploaded file on error
  
- **myActions method**:
  - Reads image files from disk
  - Converts images to base64 for frontend compatibility
  - Adds `validated` boolean field based on `validated_by`
  - Graceful error handling if image file is missing

#### 6. **Updated Actions Routes** (`src/routes/actions.routes.ts`)
- POST `/actions` - Added `upload.single('image')` middleware
- GET `/actions/my-actions` - No changes needed

### Frontend Changes

#### 1. **Updated API Service** (`src/services/api.ts`)
- Modified `createAction` to use FormData instead of JSON
- Passes File object directly (no base64 conversion)
- FormData fields:
  - `activity_type`: string
  - `activity_title`: string
  - `activity_description`: string
  - `activity_date`: ISO string
  - `image`: File object
- Fixed endpoint from `/action` to `/actions`
- Removed Content-Type header (browser sets it automatically for multipart)

#### 2. **Updated Activities Component** (`src/pages/Activities.tsx`)
- Removed `fileToBase64` helper function
- Passes File object directly to API call
- Image preview still works using `URL.createObjectURL()`
- Proper cleanup of object URLs to prevent memory leaks

## API Endpoints

### POST /actions
**Request:** `multipart/form-data`
- `activity_type`: string (e.g., "transport", "energy", "waste", "food", "water", "other")
- `activity_title`: string
- `activity_description`: string
- `activity_date`: ISO date string
- `image`: File (required)

**Headers:**
- `Authorization`: Bearer {token}

**Response:** `201 Created`
```json
{
  "id": 1,
  "activity_type": "transport",
  "activity_title": "Bike to Work",
  "activity_description": "Used bike instead of car",
  "activity_date": "2024-11-14T10:00:00.000Z",
  "user_id": 1,
  "imagem_path": "bike-photo-1699876543210-987654321.jpg",
  "validated_by": null
}
```

### GET /actions/my-actions
**Request:** No body required

**Headers:**
- `Authorization`: Bearer {token}

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "activity_type": "transport",
    "activity_title": "Bike to Work",
    "activity_description": "Used bike instead of car",
    "activity_date": "2024-11-14T10:00:00.000Z",
    "user_id": 1,
    "imagem_path": "bike-photo-1699876543210-987654321.jpg",
    "validated_by": null,
    "image": "base64_encoded_string_here...",
    "validated": false
  }
]
```

## Benefits of Multer Implementation

1. **Performance**: Files are streamed directly to disk instead of being held in memory as base64
2. **Memory Efficiency**: Base64 encoding increases file size by ~33%, multer avoids this
3. **Scalability**: Better handling of multiple concurrent uploads
4. **File Management**: Easy to implement file deletion, resizing, or processing
5. **Security**: Built-in file validation and size limits
6. **Standards**: Follows RESTful best practices for file uploads

## File Storage Structure

```
backend/
  data/
    images/
      bike-photo-1699876543210-987654321.jpg
      solar-panel-1699876654321-123456789.png
      ...
```

## Testing

All files compile successfully:
- ✅ Backend TypeScript compilation passed
- ✅ No errors in modified files
- ✅ Frontend API integration complete

## Next Steps (Optional Improvements)

1. Add image resizing/optimization (using Sharp library)
2. Implement file deletion when actions are removed
3. Add support for multiple images per action
4. Implement CDN integration for production
5. Add image compression before upload (frontend)
6. Implement signed URLs for secure image access

