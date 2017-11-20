"use strict";

module.exports = function(sequelize, DataTypes) {
  var Session = sequelize.define("sessions", {
    Id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    length: DataTypes.INTEGER,
    controller: DataTypes.JSON,
    fromDate: DataTypes.DATE,
    toDate: DataTypes.DATE
  });

  // Product.associate = function(models) {
  //
  // }
  
  return Session;
};
