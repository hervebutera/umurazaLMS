import db from "../models/index.js";

const { users: User } = db;

const findUserAge = async (user_id) => { 
    const userInfo = await User.findOne({ where: { id: user_id } })
    const userBirthdate = userInfo.birthdate
    
    const age = new Date().getFullYear() - new Date(userBirthdate).getFullYear();
    return age;    

}

export default findUserAge;
