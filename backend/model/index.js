const Expense = require("./expenses.model");
const User = require("./user.model");
const Order = require("./order.model");
const PasswordTable = require('./forgetPassRequest')

Expense.belongsTo(User);
User.hasMany(Expense);

Order.belongsTo(User);
User.hasMany(Order);

PasswordTable.belongsTo(User);
User.hasMany(PasswordTable);

module.exports = { Expense, User, Order, PasswordTable };
