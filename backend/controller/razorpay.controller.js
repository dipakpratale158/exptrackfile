// Dependencies
const razorpay = require("razorpay");
require("dotenv").config();
const crypto = require("crypto");
const Order = require("../model/order.model");
const User = require("../model/user.model");
const paymentMessage = require('../views/paymentSuccessfull')

// Instance
const razorInstance = new razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET,
});

// For create Order
const checkout = async (req, res) => {
  const UserId = req.userId;
  const options = {
    amount: 25 * 100,
    currency: "INR",
  };
  try {
    const orders = await razorInstance.orders.create(options);
    console.log("generated Order details : ", orders);
    //  insert the order details  to database
    await Order.create({
      paymentid: null,
      orderid: orders.id,
      status: "pending",
      UserId,
    });
    return res.status(200).json({ success: true, details: orders });
  } catch (error) {
    return res.status(500).json({
      message: "Error generating orderID: " + error,
    });
  }
};
// For Verify the payment details
const verifyPayment = async (req, res) => {
  try {
    console.log(req.body);
    const userId = req.userId;
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
      req.body;

    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_API_SECRET);

    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    let generatedSignature = hmac.digest("hex");
    // Checking Both signature are same or not
    if (razorpay_signature == generatedSignature) {
      // Then updating the payment details on database
      await Order.update(
        {
          paymentid: razorpay_payment_id,
          status: "success",
        },
        {
          where: {
            UserId: userId,
          },
        }
      );
      await User.update(
        {
          isPremium: true,
        },
        {
          where: {
            id: userId,
          },
        }
      );
      res.status(200).send(paymentMessage())
    } else {
      // Payment verification failed
      res.status(400).json({ success: false, message: "Invalid signature" });
    }
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ success: false, message: "Payment verification failed" });
  }
};
// It return the RAZORPAY_API_KEY
const getKey = (req, res) => {
  res.status(200).json({ key: process.env.RAZORPAY_API_KEY });
};
// Exporting the model
module.exports = {
  checkout,
  verifyPayment,
  getKey,
};
