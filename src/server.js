import express from "express"
import morgan from "morgan"
import cors from "cors"
import helmet from "helmet"
import dotenv from "dotenv"
import apiRoutes from './routes/index.js'

const app = express()
dotenv.config()

const clientUrl = process.env.CLIENT_URL
const clientLocalhostUrl = process.env.CLIENT_LOCALHOST_URL
const adminClientUrl = process.env.ADMIN_CLIENT_URL

app.use(express.json({}))

app.use(express.urlencoded({ extended: true }))
app.use(helmet())
app.use(morgan("common"))

app.use(cors({
    origin: [clientUrl, clientLocalhostUrl, adminClientUrl], 
    credentials: true, 
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
}));

app.get('/', (req, res) => {
    res.redirect(clientUrl);
});

app.use('/api', apiRoutes, (error, req, res, next) => {
    console.log(`Error Occurs: ${error.message}`);
    res.status(500).json({ error: error.message });
})

const PORT = process.env.PORT || 8000

let databaseUrl = process.env.DEVELOPMENT_MONGODB_URI
if (process.env.NODE_ENVIRONMENT === 'production') {
    databaseUrl = process.env.PRODUCTION_MONGODB_URI
}

app.listen(PORT, () => {
    console.log(`Server connected on port ${PORT}`);
})

export default app;
