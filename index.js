import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { registerValidator } from "./validations/auth.js";
import { validationResult } from "express-validator";
import UserModel from "./models/Users.js";

mongoose.connect("mongodb+srv://RubyXGod:Artur1337228@cluster0.y3xmzfm.mongodb.net/blog?retryWrites=true&w=majority")
.then(() => console.log("ok"))
.catch((err) => console.log(err));

const app = express();

app.use(express.json());

app.post('/auth/register', registerValidator, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }

        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const pass = await bcrypt.hash(password, salt);

        const doc = new UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
            passwordHash: pass,
        });

        const user = await doc.save();

        const token = jwt.sign({
            _id: user._id,
        }, 'SecretKeyOfToken', {
            expiresIn: '30d',
        });

        const { passwordHash, ...userData} = user._doc;

        res.json({
            ...userData,
            token,
        })
    } catch(err) {
        console.log(err);
        res.status(500).json({message: "Registration failed"});
    }
});

app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    } else {
        console.log('Server OK');
    }
});