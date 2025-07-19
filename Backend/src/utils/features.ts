import mongoose from "mongoose";

// MongoDB connection
export const mongoConnection = () => {
  mongoose
    .connect("mongodb://127.0.0.1:27017/", {
      dbName: "BuySphere",
    })
    .then((resolve) =>
      console.log(`Databse connected to ${resolve.connection.host}`)
    )
    .catch((err) =>
      console.log(`database connection failed due to ${err.message}`)
    );
};
