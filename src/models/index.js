import dbConfig from "../../config/config.js";
import { Sequelize } from "sequelize";
import userModel from "./usersModel.js";
import coursesModel from "./coursesModel.js";
import dotenv from "dotenv";

dotenv.config();

const NODE_ENV = process.env.NODE_ENV;

const sequelize = new Sequelize(
    dbConfig[NODE_ENV].database,
    dbConfig[NODE_ENV].username,
    dbConfig[NODE_ENV].password, {
        host: dbConfig[NODE_ENV].host,
        dialect: dbConfig[NODE_ENV].dialect,
        operatorsAliases: false,
});

sequelize.authenticate().then(() => {
    console.log(`Database connected ....`);
}).catch((error) => {
    console.log(`Error:` + error);
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

const User = userModel(sequelize, Sequelize);
const Course = coursesModel(sequelize, Sequelize);
db.users = User;
db.courses = Course;

db.sequelize.sync({ force: false }).then(() => {
    console.log('Re-sync done!');
});

export default db;
