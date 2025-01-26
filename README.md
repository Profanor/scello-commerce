# Project Izy-Stores API

## Project Overview  
This is a RESTful API built with **NestJS**, **PostgreSQL**, and **Prisma** for managing products in an e-commerce store. The API includes advanced features like search, filtering, pagination, and rate-limiting, and adheres to best practices for security, scalability, and performance.  

### Features  
1. **Core CRUD Operations**  
   - Create, read, update, and delete products.  

2. **Advanced Features**  
   - Pagination for product listing.  
   - Search by name with partial match support.  
   - Filter products by category and price range.  
   - Sort products by price, name, or stock quantity.  

3. **Technical Features**  
   - Input validation and error handling.  
   - Basic authentication for admin endpoints.  
   - API rate limiting with `@nestjs/throttler`.  
   - API versioning for scalable endpoint management.  

4. **Documentation**  
   - Swagger API documentation available at `/api`.  

5. **Bonus**  
   - Unit tests for core functionalities.  
   - Comprehensive setup instructions and database schema.  

---

## Installation and Setup  

### Prerequisites  
- **Node.js** (v18 or later)  
- **PostgreSQL**  
- **Docker** (optional, for containerized setup)  

### Local Setup  

1. **Clone the Repository**  
   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. **Install Dependencies**
    ```bash
    npm install
    ```

3. **Environment Variables**
-  When the .env file is generated through npx prisma init or nest new <app name> point the database url to your postgresql db configuration:

```env
DATABASE_URL=postgresql://<username>:<password>@localhost:5432/<database_name>
JWT_SECRET=<your_jwt_secret>
```

4. **Run Database Migrations**
-  Use Prisma to generate the database schema:

```bash
npx prisma migrate dev
```

5. **Run the Application**
-  Start the server:

```bash
npm run start:dev
```

6. **Access the API**

-  Swagger documentation: http://localhost:4000/api
-  Example endpoints:
-  POST /v1/products/create
-  GET /v1/products/search?name=example

---

## Testing
1. Run Unit Tests
```bash
npm run test
```

---

### Database Schema
- Here’s the schema for managing products and users:
```prisma
model Product {
  id          Int      @id @default(autoincrement())
  name        String
  description String
  price       Float
  stock       Int
  category    String
  createdAt   DateTime @default(now())
}

model User {
  id        String   @id @default(uuid())
  username  String   @unique
  password  String
  isAdmin   Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Performance Optimization: The Product model includes indexed fields (e.g., name, category) for faster search and filtering.

---

### API Security and Authentication
**Authentication**:

- The API uses JWT for user authentication.

- Admin accounts can only be created via the /auth/signup/admin endpoint by providing a valid adminKey in the request payload.

- Regular user accounts can only be created via the /auth/signup/user endpoint, and the isAdmin and adminKey fields should not be included in the payload for regular users.

- Example payload for admin signup:
```
{
  "username": "admin",
  "password": "securepassword",
  "adminKey": "adminkey"
}
```

- Example payload for user signup:
```
{
  "username": "regularuser",
  "password": "userpassword",
}
```

**Restrictions**:
- If a regular user attempts to set isAdmin to true or includes the adminKey in their request, the API will return an error.
- Admin accounts cannot be created without the correct adminKey.

**Rate Limiting**:
- Limits requests to 10 per minute per user to prevent abuse.

**Error Handling**:
- Detailed error messages are provided for invalid inputs (e.g., 400 Bad Request).

- Example error response:
```
{
  "statusCode": 400,
  "message": "Price must be a positive number",
  "error": "Bad Request"
}
```


### API Versioning
- All endpoints are prefixed with `/v1` for API versioning.


### API Endpoints
**Authentication**

- POST /v1/auth/signup/user
- POST /v1/auth/signup/admin

- POST /auth/login

**Products**

- POST /v1/products/create – Create a new product.
- GET /v1/products/:id – Get product details by ID.
- GET /v1/products – List products with pagination.
- GET /v1/products/search – Search products by name.
- GET /v1/products/filter – Filter products by category or price range.
- PATCH /v1/products/:id – Update a product.
- DELETE /v1/products/:id – Delete a product.

**Advanced Features**

- Sorting: Add ?sortBy=price to endpoints.
- Pagination: Use ?page=1&limit=10.


### Performance and Scalability
**Optimizations**:

- Indexing for name and category fields in the database.

- Efficient query designs using Prisma.

**Scalability**:

- API versioning ensures backward compatibility for future updates.

- Rate limiting prevents resource abuse.

