import Category from "../models/Category.js";
import Post from "../models/Post.js";
import File from "../models/File.js";
import {decode} from "jsonwebtoken";

const addPost = async (req, res, next) => {
    try {
        const {title, desc, file, category} = req.body;
        const {_id} = req.user;

        if (file) {
            const isFileExist = await File.findById(file);
            if (!isFileExist) {
                res.code = 404;
                throw new Error("File not found");
            }
        }

        const isCategoryExist = await Category.findById(category);
        if (!isCategoryExist) {
            res.code = 404;
            throw new Error("Category not found");
        }

        const newPost = new Post({
            title,
            desc,
            file,
            category,
            updatedBy: _id,
        });
        await newPost.save();

        res
            .status(201)
            .json({code: 201, status: true, message: "Post added successfully", data: newPost});
    } catch (error) {
        next(error);
    }
};


const updatePost = async (req, res, next) => {
    try {
        const {title, desc, file, category} = req.body;
        const {id} = req.params;
        const {_id} = req.user;

        if (file) {
            const isFileExist = await File.findById(file);
            if (!isFileExist) {
                res.code = 404;
                throw new Error("File not found");
            }
        }

        if (category) {
            const isCategoryExist = await Category.findById(category);
            if (!isCategoryExist) {
                res.code = 404;
                throw new Error("Category not found");
            }
        }

        const post = await Post.findById(id);
        if (!post) {
            res.code = 404;
            throw new Error("Post not found");
        }

        post.title = title ? title : post.title;
        post.desc = desc ? desc : post.desc;
        post.file = file ? file : post.file;
        post.category = category ? category : post.category;
        post.updatedBy = _id;

        await post.save();

        res
            .status(201)
            .json({code: 201, status: true, message: "Post added successfully", data: post});

    } catch (error) {
        next(error);
    }
};

const deletePost = async (req, res, next) => {
    try {
        const {id} = req.params;

        const post = await Post.findById(id);

        if (!post) {
            res.code = 404;
            throw new Error("Post not found");
        }

        await Post.findByIdAndDelete(id);

        res
            .status(201)
            .json({code: 201, status: true, message: "Post deleted successfully"});

    } catch (error) {
        next(error);
    }
};


export {addPost, updatePost, deletePost};