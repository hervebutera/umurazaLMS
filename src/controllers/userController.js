import db from "../models/index.js";
import bcrypt from "bcrypt";
import {
  signupValidationSchema,
  loginValidationSchema,
  resetPasswordValidationSchema,
} from "../validations/userValidations.js";
import { generateLoginJWToken, generatePassResetJWToken } from "../utils/jsonwebtoken.js";
import { Op } from '@sequelize/core';

const { users: User } = db;

const AuthenticatedUserInfo = (user) => {
  const displayedUserInfo = {
    id:user.id,
    username: user.username,
    firstname: user.firstname,
    lastname: user.lastname,
    userrole: user.userrole,
    profileImageUrl: user.profileimageurl,
  };

  const userToken = generateLoginJWToken({
    id: user.id, username: user.username, userrole: user.userrole
  });
  return {
    token: userToken,
    user: displayedUserInfo,
  };
};


export const generateUserName = async (firstName) => {
  try {

    const recentRegisteredUser = await User.findOne({
      order: [['id', 'DESC']]
    });

    let newUserName = "";
    const lowerCaseFirstName = firstName.toLowerCase(); 
      
    if (recentRegisteredUser) {
      const incrementedId = recentRegisteredUser.id + 1; 
      newUserName = `${lowerCaseFirstName}${incrementedId}`; 
    } else {
      newUserName = `${lowerCaseFirstName}1`; 
    }

    return newUserName;
  } catch (error) {
    console.error("Error generating username:", error);
    throw new Error("Failed to generate username");
  }
};


export const userSignup = async (req, res) => {
  try {
    let { firstname, lastname, email, password, phone, birthdate } = req.body;

    const { error } = signupValidationSchema.validate(req.body, {
      errors: { label: "key", wrap: { label: false } },
    });
    if (error) {
      res.status(422).send({ message: error.message });
      return;
    }
    
    const existingUser = await User.findOne({ where: {email: email} });

    if (existingUser !== null ) {
      res.status(409).json({
        message: `A user with email: ${email} already exists.`
      });
      return;
    }

    const salt = await bcrypt.genSalt();
    const passwordHarsh = await bcrypt.hash(password, salt);

    firstname =
      firstname.charAt(0).toUpperCase() + firstname.slice(1).toLowerCase();
    lastname =
      lastname.charAt(0).toUpperCase() + lastname.slice(1).toLowerCase();

    const newUserName = await generateUserName(firstname);

    const newUser = {
      username: newUserName,  
      firstname,
      lastname,
      email,
      phone,
      hashedPassword: passwordHarsh,
      birthdate,
    };

    const savedUser = await User.create(newUser);
    const response = AuthenticatedUserInfo(savedUser)

    res.status(201).json(response);
  } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
  }
};

export const userLogin = async (req, res) => {
  try {
    let { email, password } = req.body;

    const { error } = loginValidationSchema.validate(req.body, {
      errors: { label: "key", wrap: { label: false } },
    });
    if (error) {
      res.status(422).send({ message: error.message });
      return
    }

    const account = await User.findOne({ where: {email: email} });
    if (!account) {
      return res.status(404).send({ message: "The email provided does not exist." });
    } else if (account.isActivated === "false") {
      return res.status(401).send({message: "Account is deactivated. Contact the administrator for help!"})
    } else {
      const passwordCheck = await bcrypt.compare(
        password,
        account.hashedPassword
      );

      if (passwordCheck === false) {
        return res.status(401).json({ message: "Wrong password." });
        
      } else if (passwordCheck === true) {
        const response = AuthenticatedUserInfo(account)
        res.status(200).json(response);
      }
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    const account = await User.findOne({ where: {email: email} });
    if (!account) {
      return res.status(404).send({ message: "The email provided does not exist." });
    } else if (account.isActivated === "false") {
      return res.status(401).send({message: "Account is deactivated. Contact the administrator for help!"})
    } else {
      const userToken = generatePassResetJWToken({
        id: account.id, firstname: account.firstname, email: account.email, passReset: "true"
      });
      
      if (userToken) {
        
        return res.status(200).json({
          message: "A password reset link has been sent to your email.",
        });
      } 
    }  
  } catch (error) {
      console.log(error.message);
      return res.status(500).send({message: "Resetting a password has some issues. Try again later!"})
  }
}

export const createNewPassword = async (req, res) => {
  try {
    
    const { password } = req.body;
    const id = req.userId;

    const { error } = resetPasswordValidationSchema.validate(req.body, {
      errors: { label: "key", wrap: { label: false } },
    });
    if (error) {
      res.status(422).send({ message: error.message });
      return;
    }
    
    const existingUser = await User.findOne({ where: {id: id} });

    if (existingUser === null ) {
      res.status(404).json({
        message: `This user is no longer registered.`
      });
      return;
    }

    const salt = await bcrypt.genSalt();
    const passwordHarsh = await bcrypt.hash(password, salt);

    const updatedRows = await User.update({ hashedPassword: passwordHarsh }, { where: { id: id } })
    
    if (updatedRows > 0) {
      return res.status(201).json({ message: "A new password has been created successfully!" })
    }

  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
}

export const getUserInfoForPassReset = async (req, res) => {
  try {
    const { id, email } = req.resetRequestInfo;
    const account = await User.findOne({ where: { id: id, email: email } });

    if (account === null) {
      return res.status(404).json({ message: "This user is no longer registered!" })
    } else if (account.isActivated === "false") {
      return res.status(401).send({message: "Account is deactivated. Contact the administrator for help!"})
    }

    return res.status(200).json({ firstname: account.firstname, email: account.email });

  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
}

export const getOwnUserInfo = async (req, res) => {
  try {
    const account = await User.findOne({ where: { id: req.userId } });
    if (account == null) {
      return res.status(404).json({message: "This user is no longer registered."})
    } else if (account.isActivated === "false") {
      return res.status(401).send({message: "Account is deactivated. Contact the administrator for help!"})
    }
    const returnedUserInfo = {
      id: account.id,
      username: account.username,
      firstname: account.firstname,
      lastname: account.lastname,
      email: account.email,
      userrole: account.userrole,
      phone: account.phone,
      birthdate: account.birthdate,
      profileImageUrl: account.profileimageurl,
      isActivated: account.isActivated
    };

    return res.status(200).json(returnedUserInfo)
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export const searchUserInfoBySuperAdmin = async (req, res) => {
  try {
    const { username, email } = req.body;

      const account = await User.findOne({
        where: {
          [Op.or] : {
            username: username,
            email: email
          }
        }
      });
      if (account == null) {
        return res.status(404).json({
          message: "This user could not be found."
        })
      } else if (account.userrole === "super_admin") {
        return res.status(409).json({
          message: "Cannot get Super Admin's profile. Go to 'My profile'."
        })
      }
      
    const returnedUserInfo = {
        id: account.id,
        username: account.username,
        firstname: account.firstname,
        lastname: account.lastname,
        email: account.email,
        userrole: account.userrole,
        profileimageurl: account.profileimageurl,
        isActivated: account.isActivated
      };

      return res.status(200).json(returnedUserInfo)
    
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export const getAllAdmins = async (req, res) => {
  try {
    const accounts = await User.findAll({
      where: {
        [Op.and]: {
          userrole: "admin",
          isActivated: "true"
        }
      }
    });
    if (accounts.length === 0) {
      return res.status(400).json({
        message: "There are no admins currently. Search a user and change their role."
      })
    }
    const DisplayedAdminsInfo = accounts.map(account => {
      return {
        id: account.dataValues.id,
        username: account.dataValues.username,
        firstname: account.dataValues.firstname,
        lastname: account.dataValues.lastname,
        email: account.dataValues.email,
        phone: account.dataValues.phone,
        userrole: account.dataValues.userrole,
        profileimageurl: account.dataValues.profileimageurl,
        isActivated: account.dataValues.isActivated,
      }
    })
    return res.status(200).json(DisplayedAdminsInfo)
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export const changeUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const account = await User.findOne({ where: { id: userId } });
    if (account === null) {
      return res.status(400).json({ message: "User not found!" })
    }

    const newUserRole = (account.userrole === "user") ? "admin" : "user";
    const updatedRows = await User.update({ userrole: newUserRole }, { where: { id: userId } })
    
    if (updatedRows > 0) {
      return res.status(201).json({ message: `User role has been changed to ${newUserRole}` })
    }
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

export const changeActiveStatus = async (req, res) => {
  try {
    const { userId } = req.params; 
    const account = await User.findOne({ where: { id: userId } });
    if (account === null) {
      return res.status(400).json({ message: "User not found!" })
    }

    const newActiveStatus = (account.isActivated === "false") ? "true" : "false";
    const updatedRows = await User.update({ isActivated: newActiveStatus }, { where: { id: userId } })

    if (updatedRows > 0) {
      return res.status(201).json({
        message: `User has been ${(newActiveStatus === "true") ? "activated" : "deactivated"}`
      })
    }

  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

