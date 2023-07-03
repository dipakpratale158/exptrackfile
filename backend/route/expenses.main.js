// Dependencies
const express = require("express");

const router = express.Router();

const mainController = require("../controller/main.controller");

const checkLogin = require('../middleware/checkLogin.js')

//  
router.get("/total-expenses", checkLogin, mainController.totalExpenses);

router.post("/savedata", checkLogin, mainController.saveData);

router.get("/all-expenses", checkLogin, mainController.allExpenses);

router.get("/single-user/", checkLogin, mainController.findeUser);

router.put("/update-expenses", mainController.updateExpenses);

router.delete("/delete-expenses", mainController.deleteExpenses);

// To show everyone total expences 
router.get("/lead-board", mainController.allUserTotalExpenses);
// check the user is premium or not
router.get("/is-premium", checkLogin, mainController.isPremium);
//
router.get("/perusertotal", mainController.perUserTotal);
// 
router.get("/month", mainController.getExpensesByMonthAndDate);

module.exports = router;
