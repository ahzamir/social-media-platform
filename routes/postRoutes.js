const express = require('express');
const router = express.Router();
const PostModel = require('../models/post');
const jwt = require('jsonwebtoken');

router.get(
    '/posts',
    async (req, res, next) => {
        try {
            const posts = await PostModel.find({});

            res.json(posts);
        } catch (error) {
            next(error);
        }
    }
);

router.get(
    '/posts/:id',
    getPost,
    async (req, res, next) => {
        res.json(res.post);
    }
);

router.post(
    '/posts',
    async (req, res, next) => {
        const authHeader = req.headers.authorization;
        const token = authHeader.split(' ')[1];

        const decoded = jwt.verify(token, 'TOP_SECRET');
        const userId = decoded.user._id;

        const { title, content } = req.body;

        const post = new PostModel({
            title,
            content,
            author: userId
        });

        try {
            const newPost = await post.save();

            res.status(201).json({
                message: 'Post created',
                post: newPost
            });
        } catch (error) {
            next(error);
        }
    }
);

router.put(
    '/posts/:id',
    getPost,
    checkUser,
    async (req, res, next) => {
        const { title, content } = req.body;

        post = await PostModel.findById(req.params.id);
        if (title != null) {
            post.title = title;
        }
        if (content != null) {
            post.content = content;
        }
        
        try {
            const updatedPost = await post.save();

            res.json({
                message: 'Post updated',
                post: updatedPost
            });
        } catch (error) {
            next(error);
        }
    }
);

router.delete(
    '/posts/:id',
    getPost,
    checkUser,
    async (req, res, next) => {
        try {
            post = await PostModel.findByIdAndDelete(req.params.id);

            res.json({
                message: 'Post deleted'
            });
        } catch (error) {
            next(error);
        }
    }
);

async function getPost(req, res, next) {
    let post;

    try {
        post = await PostModel.findById(req.params.id);

        if (post == null) {
            return res.status(404).json({
                message: 'Post not found'
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }

    res.post = post;

    next();
}

async function checkUser(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, 'TOP_SECRET');
    
    if (res.post.author != decoded.user._id) {
        return res.status(403).json({
            message: 'You are not allowed to delete or update another user\'s post'
        });
    }

    next();
}

module.exports = router;