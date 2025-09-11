import express from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan'
import initDB from './db.js'
import { checkExportJob,runExportJob } from './utils/job.js'
import asyncHandler from 'express-async-handler'
import { swaggerDocs } from "./swagger.js";

import ApiError from './utils/apiError.js'
import globalError from './Middlewares/errorMiddleware.js'
import documentRoutes from "./routes/documentRoutes.js";
import authRoutes from "./routes/authRoutes.js";


dotenv.config({path:'config.env'})

const app = express();
app.use(express.json())

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
    console.log(`mode: ${process.env.NODE_ENV}`)
}

await initDB()


app.use('/api/documents', documentRoutes);
app.use("/api/auth", authRoutes);
app.use('/api/job',checkExportJob)
swaggerDocs(app);  


app.all('*sth', (req, res, next) => {
  next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
});



// Global error handling middleware for express
app.use(globalError);

// Run the job every 1 minute (60000 ms)
// Run job every 1 minute
setInterval(async () => {
  try {
    await runExportJob();
  } catch (err) {
    console.error('Job error:', err.message);
  }
}, 60 * 1000);



const PORT = process.env.PORT || 8000
const server = app.listen(PORT,()=>{
    console.log(`App running running on port ${PORT}`)
})

// Handle rejection outside express
process.on('unhandledRejection', (err) => {
  console.error(`UnhandledRejection Errors: ${err.name} | ${err.message}`);
  server.close(() => {
    console.error(`Shutting down....`);
    process.exit(1);
  });
});