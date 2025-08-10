const express = require('express');
const { getAllProducts, getProductDetails, updateProduct, deleteProduct, getProductReviews, deleteReview, createProductReview, createProduct, getAdminProducts, getProducts } = require('../controllers/productController');
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/user_actions/auth');
const { validateProduct, validateSimpleProduct } = require("../middlewares/validator")

const router = express.Router();

// Public routes
router.route('/products').get(getAllProducts);
router.route('/products/all').get(getProducts);
router.route('/products/:id').get(getProductDetails);

// Public POST endpoint for creating products (bonus requirement)
router.route('/products').post(validateSimpleProduct, createProduct);

// Protected routes (require authentication)
router.route('/review').put(isAuthenticatedUser, createProductReview);

// Admin routes (require authentication and admin role)
router.route('/admin/products').get(isAuthenticatedUser, authorizeRoles("admin"), getAdminProducts, validateProduct);
router.route('/admin/product/new').post(isAuthenticatedUser, authorizeRoles("admin"), createProduct, validateProduct);

router.route('/admin/product/:id')
    .put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct)
    .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct);

router.route('/admin/reviews')
    .get(getProductReviews)
    .delete(isAuthenticatedUser, deleteReview);

module.exports = router;