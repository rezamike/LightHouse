module.exports = function (sequelize, DataTypes) {
    var Survey = sequelize.define("Survey", {
        uniqueID: {
            type: DataTypes.STRING,
            allowNull: true
        },
        latitude: {
            type: Sequelize.INTEGER,
            allowNull: true,
            defaultValue: null,
            validate: { min: -90, max: 90 }
          },
          longitude: {
            type: Sequelize.INTEGER,
            allowNull: true,
            defaultValue: null,
            validate: { min: -180, max: 180 }
          },
        }, {
          validate: {
            bothCoordsOrNone() {
              if ((this.latitude === null) !== (this.longitude === null)) {
                throw new Error('Require either both latitude and longitude or neither')
              }
            }
          },
        a1: {
            type: DateTypes.INTEGER,
            allowNull: false
        },
        a2: {
            type: DateTypes.INTEGER,
            allowNull: false
        },
        a3: {
            type: DateTypes.INTEGER,
            allowNull: false
        },
        a4: {
            type: DateTypes.INTEGER,
            allowNull: false
        },
        a5: {
            type: DateTypes.INTEGER,
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
    });
    return Post;
};
