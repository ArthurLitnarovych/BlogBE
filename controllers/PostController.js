import PostModel from '../models/Post.js';
import dotenv from "dotenv";

dotenv.config();

export const getAll = async (req, res) => {
    try {
        const posts = await PostModel.find().populate('user').exec();

        res.json(posts);
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "get failed"});
    }
}

export const getOne = async (req, res) => {
    try {
        const postId = req.params.id;
        const updatedPost = await PostModel.findOneAndUpdate(
            { _id: postId },
            { $inc: { viewsCount: 1 } },
            { new: true }
        ).exec();

        if (!updatedPost) {
            return res.status(404).json({ message: "No post found" });
        }

        res.json(updatedPost);
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "get failed"});
    }
}

export const remove = async (req, res) => {
    try {
        const postId = req.params.id;
        const deletedPost = await PostModel.findOneAndDelete(
            {_id: postId,}
        ).exec();

        if (!deletedPost) {
            return res.status(404).json({ message: "No post found" });
        }

        res.json({success: true,});
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "remove failed"});
    }
}

export const create = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            user: req.userId,
        });

        const post = await doc.save();

        res.json(post);
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "Creation failed"});
    }
};

export const update = async (req, res) => {
    try {
        const postId = req.params.id;

        const updatedPost = await PostModel.updateOne(
            { _id: postId },
            { 
                title: req.body.title,
                text: req.body.text,
                imageUrl: req.body.imageUrl,
                user: req.body.user,
                tags: req.body.tags,
            },
        ).exec();
        res.json({
            success: true,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "update failed"});
    }
};