import jwt from "jsonwebtoken" 

export const generateLoginJWToken = (userInfo) => { 
    try { 
        const userToken = jwt.sign({userInfo}, process.env.JWT_SECRET_KEY, { expiresIn: '10hrs' }) 
        return userToken;
    } catch (error) {
        throw new Error(error.message);
    }
    
}

export const generatePassResetJWToken = (userInfo) => { 
    try { 
        const userToken = jwt.sign({userInfo}, process.env.JWT_SECRET_KEY, { expiresIn: '24hrs' }) 
        return userToken;
    } catch (error) {
        throw new Error(error.message);
    }
    
}

export const verifyJWToken = (userToken) => { 
    try {
        const decoded = jwt.verify(userToken, process.env.JWT_SECRET_KEY)
        return decoded    
    } catch (error) {
        throw new Error(`${error.message}, Please login again`)
    }
    
}

