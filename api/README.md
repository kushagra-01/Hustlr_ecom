# Product API Documentation

A RESTful API for managing products using JSON file storage instead of a database.

## Features

- **JSON-based storage**: All product data is stored in `data/products.json`
- **RESTful endpoints**: Standard HTTP methods for CRUD operations
- **Data validation**: Comprehensive validation for product creation
- **Category filtering**: Filter products by category
- **Pagination**: Built-in pagination for product listings
- **Review system**: Add, update, and delete product reviews
- **Error handling**: Proper error responses with status codes

## API Endpoints

### Public Endpoints

#### 1. Get All Products
```
GET /api/v1/products
```

**Query Parameters:**
- `category` (optional): Filter by category (e.g., "Electronics", "Apparel", "Books")
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Number of products per page (default: 12)

**Example:**
```
GET /api/v1/products?category=Apparel&page=1&limit=5
```

**Response:**
```json
{
  "success": true,
  "products": [...],
  "productsCount": 10,
  "resultPerPage": 5,
  "filteredProductsCount": 3,
  "currentPage": 1,
  "totalPages": 1
}
```

#### 2. Get Single Product
```
GET /api/v1/products/:id
```

**Response:**
```json
{
  "success": true,
  "product": {
    "id": "1",
    "title": "MacBook Pro 13-inch",
    "imageUrl": "https://...",
    "description": "Latest MacBook Pro...",
    "price": 1299.99,
    "category": "Electronics",
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-01-15T10:00:00.000Z",
    "ratings": 4.5,
    "numOfReviews": 12,
    "reviews": []
  }
}
```

#### 3. Create Product (Bonus Feature)
```
POST /api/v1/products
```

**Request Body:**
```json
{
  "title": "New Product",
  "price": 99.99,
  "description": "Product description",
  "category": "Electronics",
  "imageUrl": "https://example.com/image.jpg"
}
```

**Validation Rules:**
- `title`: Required, non-empty string
- `price`: Required, positive number
- `description`: Required, non-empty string
- `category`: Required, non-empty string
- `imageUrl`: Required, valid HTTP/HTTPS URL ending with image extension

**Response:**
```json
{
  "success": true,
  "product": {
    "id": "generated_id",
    "title": "New Product",
    "price": 99.99,
    "description": "Product description",
    "category": "Electronics",
    "imageUrl": "https://example.com/image.jpg",
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-01-15T10:00:00.000Z"
  }
}
```

### Protected Endpoints (Require Authentication)

#### 4. Create/Update Product Review
```
PUT /api/v1/review
```

**Request Body:**
```json
{
  "productId": "product_id",
  "rating": 5,
  "comment": "Great product!"
}
```

#### 5. Get Product Reviews
```
GET /api/v1/admin/reviews?id=product_id
```

#### 6. Delete Review
```
DELETE /api/v1/admin/reviews?id=review_id&productId=product_id
```

### Admin Endpoints (Require Admin Role)

#### 7. Get All Products (Admin)
```
GET /api/v1/admin/products
```

#### 8. Create Product (Admin)
```
POST /api/v1/admin/product/new
```

#### 9. Update Product
```
PUT /api/v1/admin/product/:id
```

#### 10. Delete Product
```
DELETE /api/v1/admin/product/:id
```

## Data Structure

Products are stored in `data/products.json` with the following structure:

```json
{
  "id": "unique_id",
  "title": "Product Name",
  "imageUrl": "https://example.com/image.jpg",
  "description": "Product description",
  "price": 99.99,
  "category": "Category Name",
  "createdAt": "ISO timestamp",
  "updatedAt": "ISO timestamp",
  "ratings": 4.5,
  "numOfReviews": 10,
  "reviews": [
    {
      "id": "review_id",
      "user": "user_id",
      "name": "User Name",
      "rating": 5,
      "comment": "Review comment",
      "createdAt": "ISO timestamp"
    }
  ]
}
```

## Sample Categories

- Electronics
- Apparel
- Books
- Home & Garden
- Sports & Outdoors
- Beauty & Health

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error message"
}
```

**Common Status Codes:**
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors)
- `404`: Not Found
- `500`: Internal Server Error

## How to Run

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the server:**
   ```bash
   npm start
   ```

3. **Test the API:**
   ```bash
   node test-api.js
   ```

## Sample cURL Commands

### Get all products
```bash
curl -X GET "http://localhost:4001/api/v1/products"
```

### Get products by category
```bash
curl -X GET "http://localhost:4001/api/v1/products?category=Electronics"
```

### Get single product
```bash
curl -X GET "http://localhost:4001/api/v1/products/1"
```

### Create new product
```bash
curl -X POST "http://localhost:4001/api/v1/products" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Product",
    "price": 49.99,
    "description": "A test product",
    "category": "Electronics",
    "imageUrl": "https://example.com/test.jpg"
  }'
```

### Test pagination
```bash
curl -X GET "http://localhost:4001/api/v1/products?page=1&limit=3"
```

## Notes

- **Tech Stack**: Node.js, Express.js
- **Storage**: JSON files instead of database for simplicity
- **ID Generation**: Unique IDs are generated using timestamp + random string
- **Validation**: Comprehensive validation for all required fields
- **File Operations**: Uses Node.js `fs.promises` for async file operations
- **Error Handling**: Custom error handler with proper HTTP status codes
