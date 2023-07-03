// Dependencies
const express = require("express");
const bodyparser = require("body-parser");
const cors = require("cors");
const app = express();
require("dotenv").config();


app.use(cors());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.json());

// Database connection
const dbConnection = require("./config/database");

// Impoting Routes
const userRouter = require("./route/user.route");
const mainRouter = require("./route/expenses.main");
const paymentRoute = require("./route/razorpay.route");
const nodeMailerRoute = require("./route/nodeMailer");

// Models
const { Expense, User, Order , PasswordTable} = require("./model");

// Routes
app.use("/api/user", userRouter);
app.use("/api/main", mainRouter);
app.use("/api/razorpay", paymentRoute);
app.use("/api/nodemail", nodeMailerRoute);

// To define the models in the database
(async () => {
  try {
    await dbConnection.authenticate();
    console.log(
      "Connection to the database has been established successfully."
    );

    // Sync models with the database
    await User.sync();
    await Expense.sync();
    await Order.sync();
    await PasswordTable.sync();

    console.log("Models synced to the database.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();

// Starting the server
app.listen(3000, (err) => {
  if (err) throw err;
  console.log("App listening on port 3000");
});
