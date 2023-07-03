const Sequelize = require("sequelize");
const sequelize = require("../config/database");
const User = require("../model/user.model");
const Expense = sequelize.define("Expense", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  item: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  amount: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  category: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

// Add hook

Expense.addHook("afterCreate", async (expense, options) => {
  try {
    const totalAmount = await Expense.sum("amount", {
      where: { UserId: expense.UserId },
    });
    await User.update(
      { totalamount: totalAmount },
      { where: { id: expense.UserId } }
    );
  } catch (error) {
    console.error("Error updating totalamount:", error);
  }
});

module.exports = Expense;
