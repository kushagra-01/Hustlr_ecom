const fs = require('fs').promises;
const path = require('path');
const asyncErrorHandler = require('../middlewares/helpers/asyncErrorHandler');
const ErrorHandler = require('../utils/errorHandler');

const PRODUCTS_FILE_PATH = path.join(__dirname, '../data/products.json');

// Helper function to read products from JSON file
async function readProductsFromFile() {
    try {
        const data = await fs.readFile(PRODUCTS_FILE_PATH, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        // If file doesn't exist or is empty, return empty array
        return [];
    }
}

// Helper function to write products to JSON file
async function writeProductsToFile(products) {
    try {
        await fs.writeFile(PRODUCTS_FILE_PATH, JSON.stringify(products, null, 2));
        return true;
    } catch (error) {
        throw new Error('Failed to write to products file');
    }
}

// Helper function to generate unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Get All Products
exports.getAllProducts = asyncErrorHandler(async (req, res, next) => {
    const products = await readProductsFromFile();
    
    // Handle filtering by category
    let filteredProducts = products;
    if (req.query.category) {
        filteredProducts = products.filter(product => 
            product.category && product.category.toLowerCase() === req.query.category.toLowerCase()
        );
    }

    // Handle pagination
    const resultPerPage = parseInt(req.query.limit) || 12;
    const page = parseInt(req.query.page) || 1;
    const startIndex = (page - 1) * resultPerPage;
    const endIndex = startIndex + resultPerPage;
    
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
    const productsCount = products.length;
    const filteredProductsCount = filteredProducts.length;

    res.status(200).json({
        success: true,
        products: paginatedProducts,
        productsCount,
        resultPerPage,
        filteredProductsCount,
        currentPage: page,
        totalPages: Math.ceil(filteredProductsCount / resultPerPage)
    });
});

// Get All Products ---Product Sliders
exports.getProducts = asyncErrorHandler(async (req, res, next) => {
    const products = await readProductsFromFile();

    res.status(200).json({
        success: true,
        products,
    });
});

// Get Product Details
exports.getProductDetails = asyncErrorHandler(async (req, res, next) => {
    const products = await readProductsFromFile();
    const product = products.find(p => p.id === req.params.id);

    if (!product) {
        return next(new ErrorHandler("Product Not Found", 404));
    }

    res.status(200).json({
        success: true,
        product,
    });
});


// Get All Products ---ADMIN
exports.getAdminProducts = asyncErrorHandler(async (req, res, next) => {
    const products = await readProductsFromFile();

    res.status(200).json({
        success: true,
        products,
    });
});

// Create Product ---ADMIN
exports.createProduct = asyncErrorHandler(async (req, res, next) => {
    const products = await readProductsFromFile();
    
    // Validate required fields
    const { title, price, description, category, imageUrl } = req.body;
    
    if (!title || !price || !description || !category || !imageUrl) {
        return next(new ErrorHandler("Missing required fields", 400));
    }

    // Create new product
    const newProduct = {
        id: generateId(),
        title,
        price: parseFloat(price),
        description,
        category,
        imageUrl,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    products.push(newProduct);
    await writeProductsToFile(products);

    res.status(201).json({
        success: true,
        product: newProduct
    });
});

// Update Product ---ADMIN
exports.updateProduct = asyncErrorHandler(async (req, res, next) => {
    const products = await readProductsFromFile();
    const productIndex = products.findIndex(p => p.id === req.params.id);

    if (productIndex === -1) {
        return next(new ErrorHandler("Product Not Found", 404));
    }

    // Update product fields
    const updatedProduct = {
        ...products[productIndex],
        ...req.body,
        id: req.params.id, // Ensure ID doesn't change
        updatedAt: new Date().toISOString()
    };

    products[productIndex] = updatedProduct;
    await writeProductsToFile(products);

    res.status(200).json({
        success: true,
        product: updatedProduct
    });
});

// Delete Product ---ADMIN
exports.deleteProduct = asyncErrorHandler(async (req, res, next) => {
    const products = await readProductsFromFile();
    const productIndex = products.findIndex(p => p.id === req.params.id);

    if (productIndex === -1) {
        return next(new ErrorHandler("Product Not Found", 404));
    }

    // Remove product from array
    products.splice(productIndex, 1);
    await writeProductsToFile(products);

    res.status(200).json({
        success: true,
        message: "Product deleted successfully"
    });
});

// Create OR Update Reviews
exports.createProductReview = asyncErrorHandler(async (req, res, next) => {
    const products = await readProductsFromFile();
    const productIndex = products.findIndex(p => p.id === req.body.productId);

    if (productIndex === -1) {
        return next(new ErrorHandler("Product Not Found", 404));
    }

    const { rating, comment, productId } = req.body;
    
    // Initialize reviews array if it doesn't exist
    if (!products[productIndex].reviews) {
        products[productIndex].reviews = [];
    }

    const review = {
        id: generateId(),
        user: req.user ? req.user._id : 'anonymous',
        name: req.user ? req.user.name : 'Anonymous',
        rating: Number(rating),
        comment,
        createdAt: new Date().toISOString()
    };

    // Check if user already reviewed
    const existingReviewIndex = products[productIndex].reviews.findIndex(
        rev => rev.user === review.user
    );

    if (existingReviewIndex !== -1) {
        // Update existing review
        products[productIndex].reviews[existingReviewIndex] = review;
    } else {
        // Add new review
        products[productIndex].reviews.push(review);
    }

    // Calculate average rating
    const totalRating = products[productIndex].reviews.reduce((sum, rev) => sum + rev.rating, 0);
    products[productIndex].ratings = totalRating / products[productIndex].reviews.length;
    products[productIndex].numOfReviews = products[productIndex].reviews.length;

    await writeProductsToFile(products);

    res.status(200).json({
        success: true,
        message: "Review added successfully"
    });
});

// Get All Reviews of Product
exports.getProductReviews = asyncErrorHandler(async (req, res, next) => {
    const products = await readProductsFromFile();
    const product = products.find(p => p.id === req.query.id);

    if (!product) {
        return next(new ErrorHandler("Product Not Found", 404));
    }

    res.status(200).json({
        success: true,
        reviews: product.reviews || []
    });
});

// Delete Reviews
exports.deleteReview = asyncErrorHandler(async (req, res, next) => {
    const products = await readProductsFromFile();
    const productIndex = products.findIndex(p => p.id === req.query.productId);

    if (productIndex === -1) {
        return next(new ErrorHandler("Product Not Found", 404));
    }

    // Filter out the review to delete
    const reviews = products[productIndex].reviews.filter(
        rev => rev.id !== req.query.id
    );

    // Update product with filtered reviews
    products[productIndex].reviews = reviews;
    products[productIndex].numOfReviews = reviews.length;

    // Recalculate average rating
    if (reviews.length === 0) {
        products[productIndex].ratings = 0;
    } else {
        const totalRating = reviews.reduce((sum, rev) => sum + rev.rating, 0);
        products[productIndex].ratings = totalRating / reviews.length;
    }

    await writeProductsToFile(products);

    res.status(200).json({
        success: true,
        message: "Review deleted successfully"
    });
});