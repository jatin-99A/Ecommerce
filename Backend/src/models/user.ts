import mongoose from "mongoose";
import validator from "validator";

interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  photo: string;
  role: "admin" | "user" | "vendors";
  gender: "male" | "female";
  dob: Date;
  createdAt: Date;
  updatedAt: Date;
  //   Virtual Attribute
  age: number;
}

const schema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: [true, "Please Enter Your ID"], 
    },
    name: {
      type: String,
      required: [true, "Please Enter Your Name"],
    },
    email: {
      type: String,
      unique: [true, "Email already Exist"],
      required: [true, "Please Enter Your Name"],
      validate: validator.default.isEmail,
    },
    photo: {
      type: String,
      required: [true, "Please upload photo"],
    },
    role: {
      type: String,
      enum: ["vendors","admin", "user"],
      default: "user",
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      required: [true, "Please Enter Your Gender"],
    },
    dob: {
      type: Date,
      required: [true, "Please Enter Your Date of birth"],
    },
  },
  {
    timestamps: true,
  }
);

schema.virtual("age").get(function () {
  const today = new Date();
  const dob = this.dob;
  let age = today.getFullYear() - dob.getFullYear();

  if (
    today.getMonth() < dob.getMonth() ||
    (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())
  ) {
    age--;
  }
  
  return age;
});


export const User = mongoose.model<IUser>("User", schema);