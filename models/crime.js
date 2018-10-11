module.exports = function (sequelize, DataTypes) {
    var Crime = sequelize.define("Crime", {
        neighborhood: {
            type: DataTypes.STRING,
            allowNull: false
        },
        rating: {
            type: DataTypes.DECIMAL(2,1),
            allowNull: false
        },
        totalCrimes: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        kidnap: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        violent: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        property: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        trespass: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        lighting: {
            type: DataTypes.STRING,
            allowNull: false
        },
        clean: {
            type: DataTypes.STRING,
            allowNull: false
        },
        population: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {timestamps: false});
    return Crime;
};
