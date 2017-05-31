'use strict';
module.exports = function(sequelize, DataTypes) {
  var Category = sequelize.define('Category', {
    name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
      },
      description: {
        type: DataTypes.STRING
      },
      slug: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
      },
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        Category.hasMany(models.Post);
      }
    }
  });
  return Category;
};