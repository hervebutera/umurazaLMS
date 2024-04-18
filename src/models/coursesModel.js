export default (sequelize, DataTypes) => {
    const Course = sequelize.define("course", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        title: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        learning_mode: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        min_eligible_age: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        max_eligible_age: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        course_imageUrl: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        expectations: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        more_included: {
            type: DataTypes.STRING,
        },
        priceInUSD: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        repayment_interval: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        active: {
            type: DataTypes.STRING,
            defaultValue: "true",
        }
    })

    return Course;
}

