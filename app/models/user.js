module.exports = function (sequelize, DataTypes) {
    var User = sequelize.define("User", {
        locationName: {
            type: DataTypes.STRING,
            allowNull: true
        },
        q1: {
            type: DateTypes.INTEGER,
            allowNull: false
        },
        q2: {
            type: DateTypes.INTEGER,
            allowNull: false
        },
        q3: {
            type: DateTypes.INTEGER,
            allowNull: false
        },
        q4: {
            type: DateTypes.INTEGER,
            allowNull: false
        },
        q5: {
            type: DateTypes.INTEGER,
            allowNull: false
        },
        textBox: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        timeDay: {
            type: DataTypes.STRING,
            defaultValue: "All Day"
        }
    });
    return Post;
};
