import express from "express";
import mongoose from "mongoose";
import { registerValidator, loginValidator, postCreateValidation } from "./validations/auth.js";
import { UserController, PostController} from "./controllers/index.js";
import checkAuth from './utils/checkAuth.js';
import multer from "multer";
import handleErrors from "./utils/handleErrors.js";
import dotenv from "dotenv";

dotenv.config();

mongoose.connect(process.env.MONGODBURL)
.then(() => console.log("ok"))
.catch((err) => console.log(err));

const app = express();

app.use(express.json());
app.use('/uploads', express.static('uploads'));

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads');
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });

app.post('/auth/login', loginValidator, handleErrors, UserController.login);
app.post('/auth/register', registerValidator, handleErrors, UserController.register);
app.get('/auth/me', checkAuth , UserController.getMe);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,
    });
});

app.get('/posts', PostController.getAll);
app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, postCreateValidation, handleErrors, PostController.create);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch('/posts/:id', checkAuth, postCreateValidation, handleErrors, PostController.update);

app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    } else {
        console.log('Server OK');
    }
});