'use strict';
var Category = require('./index').Category;

module.exports = function(sequelize, DataTypes) {
  var Post = sequelize.define('Post', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      CategoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Categories",
          key: "id"
        }
      },
      content: {
        type: DataTypes.TEXT
      },
      UserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id"
        }
      },
      slug: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
      },
      image: {
        type: DataTypes.STRING,
        defaultValue: 'placeholder.jpg'
      },
      date: {
        type: DataTypes.DATE,
        defaultValue: sequelize.fn('NOW')
      }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        Post.belongsTo(models.Category);
        Post.belongsTo(models.User);
      }
    }
  });
  return Post;
};