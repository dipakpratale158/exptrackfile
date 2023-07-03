const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const ResetPasswordRequest = sequelize.define('ForgotPasswordRequests', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  isActive: {
    type: Sequelize.BOOLEAN,
    defaultValue: true,
  },
});

module.exports = ResetPasswordRequest;
