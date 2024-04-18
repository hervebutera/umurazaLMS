import express from "express";
import {
    userSignup,
    userLogin,
    createNewPassword,
    requestPasswordReset,
    getUserInfoForPassReset,
    getOwnUserInfo,
    getAllAdmins,
    searchUserInfoBySuperAdmin,
    changeUserRole,
    changeActiveStatus
} from "../controllers/userController.js";
import { isLoggedIn, isSuperAdmin, verifyPassResetToken } from "../middlewares/auth.js";

const userRoutes = express.Router();

userRoutes.post("/signup", userSignup);
userRoutes.post("/login", userLogin);
userRoutes.post("/reset-password", requestPasswordReset);
userRoutes.patch("/reset-password", verifyPassResetToken, createNewPassword);
userRoutes.get("/token-verify", verifyPassResetToken, getUserInfoForPassReset);
userRoutes.get("/myprofile", isLoggedIn, getOwnUserInfo);
userRoutes.patch("/update-password", isLoggedIn, createNewPassword);
userRoutes.post("/search", isSuperAdmin, searchUserInfoBySuperAdmin)
userRoutes.get("/admins", isSuperAdmin, getAllAdmins);
userRoutes.patch("/changerole/:userId", isSuperAdmin, changeUserRole);
userRoutes.patch("/changeactivestatus/:userId", isSuperAdmin, changeActiveStatus);


export default userRoutes;
