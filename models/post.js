const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Please enter a title']
    },
    content: {
        type: String,
        required: [true, 'Please enter content']
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    visible: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const PostModel = mongoose.model('post', postSchema);

module.exports = PostModel;