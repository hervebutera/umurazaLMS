import db from "../models/index.js"
import findUserAge from "../utils/findUserAge.js";
import { createCourseValidationSchema } from "../validations/courseValidations.js";


const { courses: Course } = db;

export const createCourse = async (req, res) => {
    try {
        const {
            title,
            description,
            learning_mode,
            min_age,
            max_age,
            expectations,
            more_included,
            priceInUSD,
            course_imageUrl,
            repayment_interval,
        } = req.body;

        const { error } = createCourseValidationSchema.validate(req.body, {
            errors: { label: "key", wrap: { label: false } },
        })
        if (error) {
            res.status(422).send({ message: error.message })
            return;
        }

        const existingCourse = await Course.findOne({ where: { title: title } })
        
        if (existingCourse !== null) {
            res.status(409).json({
                message: `The title provided belongs to an existing class`
            })
            return;
        }
        if ((max_age < min_age) && (max_age !== 0)) {
            return res.status(409).json({
                message: "Maximum eligible age cannot be less than minimum eligible age."
            })
        } 

        const newCourse = {
            title : title,
            description: description,    
            learning_mode: learning_mode,
            min_eligible_age: min_age,
            max_eligible_age: max_age,
            course_imageUrl,
            expectations: JSON.stringify(expectations),
            more_included,
            priceInUSD,
            repayment_interval,
        };

        const savedCourse = await Course.create(newCourse);
        res.status(201).json(savedCourse);

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
}

export const getAllCourses = async (req, res) => { 
    try {
        const allCourses = await Course.findAll()

        if (allCourses.length === 0) {
          return res.status(404).send({ message: "There are no classes available." })
        }
        const userAge = await findUserAge(req.userId)

        const newCoursesArray = allCourses.map((course) => {
            if (course.min_eligible_age !== 0 && course.min_eligible_age > userAge) {
                course.dataValues = {...course.dataValues, age_eligibility: "Younger than minimum eligible age."}   
            } else if (course.max_eligible_age !== 0 && course.max_eligible_age < userAge) {
                course.dataValues = {...course.dataValues, age_eligibility: "Older than maximum eligible age."}   
            }
            return course.dataValues;
        })

        res.status(200).json(newCoursesArray)
    
      } catch (error) {
        res.status(500).send({ error: error.message })
      }
}
export const getSingleCourse = async (req, res) => {
    try {
        const { id } = req.params;

        const courseInfo = await Course.findOne({ where: { id: id } })


        if (courseInfo === null) {
          return res.status(404).send({ message: "Course not found!" })
        }
        const userAge = await findUserAge(req.userId)

        if (courseInfo.min_eligible_age !== 0 && courseInfo.min_eligible_age > userAge) {
            courseInfo.dataValues = {...courseInfo.dataValues, age_eligibility: "Younger than minimum eligible age."}   
        } else if (courseInfo.max_eligible_age !== 0 && courseInfo.max_eligible_age < userAge) {
            courseInfo.dataValues = {...courseInfo.dataValues, age_eligibility: "Older than maximum eligible age."}   
        }

        res.status(200).json(courseInfo.dataValues)
    
      } catch (error) {
        res.status(500).send({ error: error.message })
      }
}

