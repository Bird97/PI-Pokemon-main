const { DataTypes} = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('types', {

        id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
        },

        name: {
            type: DataTypes.STRING,
            allowNull: false,   
        }
    });
}