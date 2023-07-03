// Dependencies
const { Expense } = require("../model");
const User = require("../model/user.model");
const Sequelize = require("../config/database");

// Module scaffolding
const app = {};

app.mainRoute = (req, res) => {
  res.end(" THere is Noting ");
};

// To save the Expenses in the database
app.saveData = async (req, res) => {
  try {
    const userId = req.userId;
    const item = req.body.item;
    const amount = req.body.amount;
    const category = req.body.category;

    const result = await Expense.create({
      item: item,
      amount: amount,
      category: category,
      UserId: userId,
    });

    res.status(200).json({ message: result });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err });
  }
};

// To get all the expenses
app.allExpenses = async (req, res) => {
  try {
    const userId = req.userId;
    console.log("userId :", userId);
    let result = await Expense.findAll({
      where: {
        userId: userId
      }
    })
    res.status(200).json({ result })
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err
    })
  }
}
// 
app.allUserTotalExpenses = (req, res) => {
  User.findAll()
    .then((exp) => {
      res.send(exp);
    })
    .catch((err) => console.error("Error fetching Expenses:", err));
};

// To edit or update the expenses
app.updateExpenses = (req, res) => {
  const userId = req.body.id;
  const updatedItem = req.body.item;
  const updatedAmount = req.body.amount;
  const updatedCategory = req.body.category;

  Expense.findByPk(userId)
    .then((result) => {
      if (result) {
        console.log(" this is result", result);
        result.item = updatedItem;
        result.amount = updatedAmount;
        result.category = updatedCategory;
        return result.save();
      } else {
        throw new Error("Cannot not edit");
      }
    })
    .then((result) => {
      console.log("Expenses updated:", result);
      res.json({ message: "Expenses updated successfully." });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "An error occurred." });
    });
};

// To calculate the total expenses
app.totalExpenses = (req, res) => {
  Expense.findAll({ where: { userId: req.userId } })
    .then((expenses) => {
      if (!expenses) {
        return res
          .status(404)
          .json({ error: "Expenses not found for the provided user ID." });
      }
      return res.json(expenses);
    })
    .catch((err) => {
      console.error("Error fetching expenses:", err);
      return res.status(500).json({ error: "Internal server error." });
    });
};

// To find the user by their ID
app.findeUser = (req, res) => {
  const id = req.userId;
  User.findByPk(id)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => console.log(err));
};

app.deleteExpenses = async (req, res) => {
  const id = req.body.id;
  try {
    const expense = await Expense.findByPk(id);
    if (!expense) {
      return res.status(404).json({ error: 'Expense not found.' });
    }
    await expense.destroy();
    console.log('Item DESTROYED');
    res.json({ message: 'Item deleted successfully.' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'An error occurred.' });
  }
};

// Is user premium
app.isPremium = (req, res) => {
  let id = req.userId;
  User.findByPk(id)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => console.error("Error fetching Expenses:", err));
};

//
app.perUserTotal = async (req, res) => {
  try {
    // Groupby technic
    const expenses = await Expense.findAll({
      attributes: [
        "UserId",
        [Sequelize.fn("sum", Sequelize.col("amount")), "total_cost"],
      ],
      group: ["UserId"],
    });
    res.send(expenses);
  } catch (error) {
    console.error("Error retrieving expenses:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};



// Function to fetch expenses month-wise and date-wise
 app.getExpensesByMonthAndDate = async (req, res) => {
  console.log("i called")
  try {
    const expenses = await Expense.findAll({
      attributes: [
        [Sequelize.fn('DATE', Sequelize.col('createdAt')), 'date'],
        [Sequelize.fn('MONTH', Sequelize.col('createdAt')), 'month'],
        [Sequelize.fn('SUM', Sequelize.col('amount')), 'totalamount']
      ],
      group: [
        Sequelize.fn('DATE', Sequelize.col('createdAt')),
        Sequelize.fn('MONTH', Sequelize.col('createdAt'))
      ],
    });
    res.status(200).json(expenses)
  } catch (error) {
    console.error('Error retrieving expenses:', error);
    throw error;
  }
}

module.exports = app;
