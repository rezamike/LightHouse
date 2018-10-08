module.exports = function (sequelize, DataTypes) {
    var Crime = sequelize.define("Crime", {
        Date_Occurred: {
            type: DataTypes.DATE,
            allowNull: false
        },
        Area_Name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Crime_Code: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        Crime_Code_Description: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Address: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Location: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {timestamps: false});
    return Crime;
};
