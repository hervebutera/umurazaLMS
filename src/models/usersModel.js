export default (sequelize, DataTypes) => {
    const User = sequelize.define("user", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        firstname: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastname: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        phone: {
            type: DataTypes.STRING,
        },
        hashedPassword: {
            type: DataTypes.STRING,
        },
        birthdate: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        userrole: {
            type: DataTypes.STRING,
            defaultValue: "user",
        },
        profileimageurl: {
            type: DataTypes.STRING,
            defaultValue: 'https://res.cloudinary.com/hervebu/image/upload/v1692276423/hill_ecommerce/user_default_img_wrxrou.png',
        },
        isActivated: {
            type: DataTypes.STRING,
            defaultValue: 'true',
        }
    })

    return User;
}

