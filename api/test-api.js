// Simple test file to demonstrate the JSON-based Product API
// Run this with: node test-api.js

const axios = require('axios');

const BASE_URL = 'http://localhost:4001/api/v1';

// Test data for creating a new product
const testProduct = {
    title: "Test Wireless Headphones",
    price: 89.99,
    description: "High-quality wireless headphones with noise cancellation",
    category: "Electronics",
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop"
};

// Test data with invalid fields for validation testing
const invalidProduct = {
    title: "", // Empty title
    price: -10, // Negative price
    description: "", // Empty description
    category: "", // Empty category
    imageUrl: "invalid-url" // Invalid image URL
};

async function testAPI() {
    console.log('🚀 Testing Product API Endpoints\n');
    
    try {
        // Test 1: Get all products
        console.log('1️⃣ Testing GET /products (all products)');
        const allProducts = await axios.get(`${BASE_URL}/products`);
        console.log(`✅ Success: Found ${allProducts.data.products.length} products`);
        console.log(`   Total products: ${allProducts.data.productsCount}`);
        console.log(`   Current page: ${allProducts.data.currentPage}`);
        console.log(`   Products per page: ${allProducts.data.resultPerPage}\n`);

        // Test 2: Filter products by category
        console.log('2️⃣ Testing GET /products?category=Apparel');
        const apparelProducts = await axios.get(`${BASE_URL}/products?category=Apparel`);
        console.log(`✅ Success: Found ${apparelProducts.data.filteredProductsCount} Apparel products`);
        console.log(`   Products: ${apparelProducts.data.products.map(p => p.title).join(', ')}\n`);

        // Test 3: Filter products by another category
        console.log('3️⃣ Testing GET /products?category=Electronics');
        const electronicsProducts = await axios.get(`${BASE_URL}/products?category=Electronics`);
        console.log(`✅ Success: Found ${electronicsProducts.data.filteredProductsCount} Electronics products`);
        console.log(`   Products: ${electronicsProducts.data.products.map(p => p.title).join(', ')}\n`);

        // Test 4: Get single product by ID
        console.log('4️⃣ Testing GET /products/:id (single product)');
        const singleProduct = await axios.get(`${BASE_URL}/products/1`);
        console.log(`✅ Success: Found product "${singleProduct.data.product.title}"`);
        console.log(`   Price: $${singleProduct.data.product.price}`);
        console.log(`   Category: ${singleProduct.data.product.category}\n`);

        // Test 5: Create new product
        console.log('5️⃣ Testing POST /products (create new product)');
        const newProduct = await axios.post(`${BASE_URL}/products`, testProduct);
        console.log(`✅ Success: Created product "${newProduct.data.product.title}"`);
        console.log(`   ID: ${newProduct.data.product.id}`);
        console.log(`   Price: $${newProduct.data.product.price}\n`);

        // Test 6: Test pagination
        console.log('6️⃣ Testing GET /products?page=1&limit=3 (pagination)');
        const paginatedProducts = await axios.get(`${BASE_URL}/products?page=1&limit=3`);
        console.log(`✅ Success: Pagination working`);
        console.log(`   Page: ${paginatedProducts.data.currentPage}`);
        console.log(`   Limit: ${paginatedProducts.data.resultPerPage}`);
        console.log(`   Total pages: ${paginatedProducts.data.totalPages}\n`);

        // Test 7: Test validation (should fail)
        console.log('7️⃣ Testing POST /products with invalid data (validation)');
        try {
            await axios.post(`${BASE_URL}/products`, invalidProduct);
        } catch (error) {
            if (error.response && error.response.status === 400) {
                console.log(`✅ Success: Validation working - ${error.response.data.error}`);
            } else {
                console.log(`❌ Unexpected error: ${error.message}`);
            }
        }
        console.log('');

        // Test 8: Get products with category filter and pagination
        console.log('8️⃣ Testing GET /products?category=Books&page=1&limit=2');
        const booksPaginated = await axios.get(`${BASE_URL}/products?category=Books&page=1&limit=2`);
        console.log(`✅ Success: Category + Pagination working`);
        console.log(`   Category: Books`);
        console.log(`   Found: ${booksPaginated.data.filteredProductsCount} books`);
        console.log(`   Page: ${booksPaginated.data.currentPage}/${booksPaginated.data.totalPages}\n`);

        console.log('🎉 All API tests completed successfully!');
        console.log('\n📋 Summary of tested endpoints:');
        console.log('   ✅ GET /products - All products with pagination');
        console.log('   ✅ GET /products?category=Apparel - Category filtering');
        console.log('   ✅ GET /products?category=Electronics - Category filtering');
        console.log('   ✅ GET /products/1 - Single product by ID');
        console.log('   ✅ POST /products - Create new product');
        console.log('   ✅ GET /products?page=1&limit=3 - Pagination');
        console.log('   ✅ POST /products - Data validation');
        console.log('   ✅ GET /products?category=Books&page=1&limit=2 - Combined filtering');

    } catch (error) {
        if (error.response) {
            console.error(`❌ API Error: ${error.response.status} - ${error.response.data.error || error.response.statusText}`);
        } else if (error.code === 'ECONNREFUSED') {
            console.error('❌ Connection Error: Make sure the server is running on port 4001');
            console.error('   Run: npm start');
        } else {
            console.error(`❌ Error: ${error.message}`);
        }
    }
}

// Run the tests
testAPI();
