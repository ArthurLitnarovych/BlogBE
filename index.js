import express from "express";
import mongoose from "mongoose";
import { registerValidator, loginValidator, postCreateValidation } from "./validations/auth.js";
import * as UserController from "./controllers/UserController.js";
import * as PostController from "./controllers/PostController.js";
import checkAuth from './utils/checkAuth.js';

mongoose.connect("mongodb+srv://RubyXGod:Artur1337228@cluster0.y3xmzfm.mongodb.net/blog?retryWrites=true&w=majority")
.then(() => console.log("ok"))
.catch((err) => console.log(err));

const app = express();

app.use(express.json());

app.post('/auth/login', loginValidator, UserController.login);
app.post('/auth/register', registerValidator, UserController.register);
app.get('/auth/me', checkAuth , UserController.getMe);

app.get('/posts', PostController.getAll);
app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, postCreateValidation, PostController.create);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch('/posts/:id', checkAuth, PostController.update);

app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    } else {
        console.log('Server OK');
    }
});