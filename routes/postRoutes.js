const express = require('express');
const router = express.Router();
const PostModel = require('../models/post');
const jwt = require('jsonwebtoken');

router.get(
    '/posts',
    async (req, res, next) => {
        try {
            const posts = await PostModel.find({ visible: true }).sort({ createdAt: -1 });

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

router.get(
    '/user/posts',
    async (req, res, next) => {
        const userId = getUserId(req);

        try {
            const posts = await PostModel.find({ author: userId }).sort({ createdAt: -1 });

            res.json({
                message: 'All your posts are here',
                posts: posts
            });
        } catch (error) {
            next(error);
        }
    }
);

router.get(
    '/user/posts/private',
    async (req, res, next) => {
        const userId = getUserId(req);

        try {
            const posts = await PostModel.find({ author: userId, visible: false }).sort({ createdAt: -1 });

            res.json({
                message: 'All your private posts are here',
                posts: posts
            });
        } catch (error) {
            next(error);
        }
    }
);

router.post(
    '/posts',
    async (req, res, next) => {
        const userId = getUserId(req);

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
        const { title, content, visible } = req.body;

        post = await PostModel.findById(req.params.id);
        if (title != null) {
            post.title = title;
        }
        if (content != null) {
            post.content = content;
        }
        if (visible != null) {
            post.visible = visible;
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
    if (!req.headers.authorization) {
        return res.status(401).json({
            message: 'You are not authorized to perform this action'
        });
    }

    const userId = getUserId(req);
    
    if (res.post.author != userId) {
        return res.status(403).json({
            message: 'You are not allowed to delete or update another user\'s post'
        });
    }

    next();
}

const getUserId = (req) => {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, 'TOP_SECRET');
    const userId = decoded.user._id;
    return userId;
}

module.exports = router;