import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import UserModel from "../models/Users.js";

export const register = async (req, res) => {
    try {
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
        });
    } catch(err) {
        console.log(err);
        res.status(500).json({message: "Registration failed"});
    }
};

export const login = async (req, res) => {
    try{
        const user = await UserModel.findOne({ email: req.body.email}) ;

        if (!user) {
            return res.status(404).json({message: 'no user found!'});
        }

        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

        if (!isValidPass) {
            return res.status(404).json({message: 'no user found!'});
        }

        const token = jwt.sign({
            _id: user._id,
        }, 'SecretKeyOfToken', {
            expiresIn: '30d',
        });

        const { passwordHash, ...userData} = user._doc;

        res.json({
            ...userData,
            token,
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({message: "Registration failed"});
    }
};

export const getMe = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId);

        if (!user) {
            return res.status(404).json({message: "no user found"});
        }

        const { passwordHash, ...userData} = user._doc;

        res.json(userData);
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "No auth!"});
    }
};