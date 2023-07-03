// Dependencies
const express = require("express");
const router = express.Router();
const razorpayController = require("../controller/razorpay.controller");
const checkLogin = require("../middleware/checkLogin");

// This rout helps to create order
router.post("/checkout", checkLogin, razorpayController.checkout);
// This rout is going to verify the payment
router.post("/verify", checkLogin, razorpayController.verifyPayment);
// This rout send the razorpay api token
router.get("/key", razorpayController.getKey);

module.exports = router;
