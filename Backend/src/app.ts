import express from 'express';
import bodyParser from 'body-parser';
import { mongoConnection } from './utils/features.js';
import { ErrorMiddleware } from './middlewares/error.js';

const app = express();

const port = 3043; 

// Importing routes
import userRoute from "./routes/user.js";
import productRoute from "./routes/product.js";

// Mongo connection
mongoConnection();

// Middlewares
app.use(bodyParser.json());

// Using routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productRoute);

// Declare uploads as a static folder
app.use("/uploads", express.static('uploads'));

// Error handler middleware
app.use(ErrorMiddleware);
app.listen( port, () => {
    console.log(`Server is working on http://localhost:${port}`);
}) 



export default app;