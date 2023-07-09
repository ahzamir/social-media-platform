const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    title: String,
    content: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const PostModel = mongoose.model('post', postSchema);