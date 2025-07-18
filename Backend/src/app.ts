import express from 'express';

const app = express();

const port = 3043; 

// Importing routes
import userRoute from "./routes/user.js"

// Using routes
app.use("/api/v1/user", userRoute);

app.listen( port, () => {
    console.log(`Server is working on http://localhost:${port}`);
}) 



export default app;