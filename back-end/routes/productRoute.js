const express = require("express");
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetails,
  createProductReview,
  getProductReviews,
  deleteProductReviews,
} = require("../controllers/productController");
const { isAunthenticated, authorizeRoles } = require("../middlewares/auth");

const router = express.Router();

router.get("/products", getAllProducts);
// router.route('/producs').get(isAunthenticated, getAllProducts)
router.post(
  "/admin/product/new",
  isAunthenticated,
  authorizeRoles("admin"),
  createProduct
);
router.put(
  "/admin/product/:id",
  isAunthenticated,
  authorizeRoles("admin"),
  updateProduct
);
router.delete(
  "/admin/product/:id",
  isAunthenticated,
  authorizeRoles("admin"),
  deleteProduct
);

router.get("/product/:id", getProductDetails);
router.put("/review", isAunthenticated, createProductReview);
router.get("/reviews", getProductReviews);
router.delete("/reviews", isAunthenticated, deleteProductReviews);

module.exports = router;
