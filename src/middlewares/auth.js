import { verifyJWToken } from "../utils/jsonwebtoken.js";

export const isLoggedIn = (req, res, next) => {
    try {
      if (req.headers.authorization) {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
          res.status(401).json({ message: "Invalid authorization header format. No token found!" });
          return;
        }
        
        const userInfo = verifyJWToken(token);
        if (userInfo.userInfo && userInfo.userInfo.passReset !== "true") {
          req.userId = userInfo.userInfo.id
          next();
        } else {
          return res.status(401).json({
            message: "Access denied. Please login again",
          });
          return;
        }
      } else {
        return res.status(401).send({ message: "Provide a Token in Authorizaion header for this API." });
      }  
   } catch (error) {
      return res.status(500).send({ message: error.message });
   }
  };

export const isAdmin = (req, res, next) => {
    try {
      if (req.headers.authorization) {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) return res.status(401).json({
          message: "Invalid authorization header format. No token found!"
        });
      
        const decodedUserInfo = verifyJWToken(token);
  
        if (decodedUserInfo.userInfo.userrole === "admin"
          || decodedUserInfo.userInfo.userrole === "super_admin") {
          req.userId = decodedUserInfo.userInfo.id
          next();
        } else {
          return res.status(403).json({
            message: "Only an admin performs this action.",
          });
        }
      } else {
        return res.status(401).send({
          message: "Provide a Token in Authorizaion header for this API."
        })
      }    
    } catch (error) {
      return res.status(500).send({
        message: error.message
      })
    }
};

export const isSuperAdmin = (req, res, next) => {
    try {
      if (req.headers.authorization) {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) return res.status(401).json({
          message: "Invalid authorization header format. No token found!"
        });
      
        const decodedUserInfo = verifyJWToken(token);
        if (decodedUserInfo.userInfo.userrole === "super_admin") {
          req.userId = decodedUserInfo.userInfo.id
          next();
        } else {
          return res.status(403).json({
            message: "Only a super admin performs this action.",
          });
        }
      } else {
        return res.status(401).send({ message: "Provide a Token in Authorizaion header for this API." })
      }    
    } catch (error) {
        return res.status(500).send({ message: error.message })
    }
};

export const verifyPassResetToken = (req, res, next) => {
    try {
        if (req.headers.authorization) {
          const token = req.headers.authorization.split(' ')[1];
          if (!token) return res.status(401).json({ message: "Invalid authorization header format. No token found!" });
        
          const decodedUserInfo = verifyJWToken(token);
          if (decodedUserInfo.userInfo.passReset) {
            req.resetRequestInfo = decodedUserInfo.userInfo
            req.userId = decodedUserInfo.userInfo.id
            next();
          } else {
            return res.status(403).json({
              message: "You don't have permission to create a password.",
            });
          }
        } else {
          return res.status(401).send({ message: "Provide a Token in Authorizaion header for this API." })
        }    
    } catch (error) {
        return res.status(500).send({ message: error.message })
    }
}
  