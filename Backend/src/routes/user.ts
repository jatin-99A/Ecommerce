import express from "express";

const router = express.Router();

router.get("/", (req, res) =>{
    res.send("hello bhai kya hal hai tere");
})

export default router;