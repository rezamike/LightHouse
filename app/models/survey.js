module.exports = function (sequelize, DataTypes) {
    var Survey = sequelize.define("Survey", {
        businessName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        uniqueID: {
            type: DataTypes.STRING,
            allowNull: true
        },
        // latitude: {
        //     type: DataTypes.INTEGER,
        //     allowNull: true,
        //     defaultValue: null,
        //     validate: { min: -90, max: 90 }
        //   },
        //   longitude: {
        //     type: DataTypes.INTEGER,
        //     allowNull: true,
        //     defaultValue: null,
        //     validate: { min: -180, max: 180 }
        //   },
        //   validate: {
        //     bothCoordsOrNone() {
        //       if ((this.latitude === null) !== (this.longitude === null)) {
        //         throw new Error('Require either both latitude and longitude or neither')
        //       }
        //     }
        //   },
        a1: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        a2: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        a3: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        a4: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        a5: {
            type: DataTypes.INTEGER,
            allowNull: false
        }, 
        security: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        textBox: {
            type: DataTypes.TEXT,
            validate: {
                len: [0,160],
                notNull: false
            }  
        },
        timeDay: {
            type: DataTypes.STRING,
            defaultValue: "All Day"
        }
    }, {timestamps: false});
    return Survey;
};
