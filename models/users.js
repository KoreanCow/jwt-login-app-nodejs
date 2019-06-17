module.exports = (sequelize, DataTypes) => sequelize.define('users', {
  nick: {
    type: DataTypes.STRING(15),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(40),
    allowNull: false,
    validate: {
      isEmail: true,
    },
    primaryKey: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  salt: {
    type: DataTypes.STRING,
  },
}, {
  timestamps: true,
  paranoid: true,
});
