import express from "express";
import { createCourse, getAllCourses, getSingleCourse } from "../controllers/courseController.js";
import { isLoggedIn, isSuperAdmin } from "../middlewares/auth.js";

const courseRoutes = express.Router();

courseRoutes.post("/create", isSuperAdmin, createCourse);
courseRoutes.get("/", isLoggedIn, getAllCourses);
courseRoutes.get('/:id', isLoggedIn, getSingleCourse)


export default courseRoutes;
