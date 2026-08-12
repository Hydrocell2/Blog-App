const Comment = require('../models/Comment');
const Post = require('../models/Post');

module.exports.createComment = (req, res) => {
    const { content } = req.body;
    const postId = req.params.postId;

    if (!content) {
        return res.status(400).json({ error: 'Comment content is required' });
    }

    return Post.findById(postId)
    .then(post => {
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const newComment = new Comment({
            content,
            post: postId,
            author: req.user.id,
            authorName: req.user.username,
            authorProfilePicture: req.user.profilePicture || ''
        });

        return newComment.save();
    })
    .then(savedComment => {
        return res.status(201).json({ 
            message: 'Comment created successfully',
            comment: savedComment
        });
    })
    .catch(error => {
        return res.status(500).json({ error: 'Failed to create comment', details: error.message });
    });
};

module.exports.getCommentsByPost = (req, res) => {
    const postId = req.params.postId;

    return Comment.find({ post: postId }).populate('author', 'username email profilePicture').sort({ createdAt: -1 })
    .then(comments => {
        const commentsWithProfilePics = comments.map(comment => {
            const commentObj = comment.toObject();
            if (!commentObj.authorProfilePicture && comment.author && comment.author.profilePicture) {
                commentObj.authorProfilePicture = comment.author.profilePicture;
            }
            return commentObj;
        });
        return res.status(200).json({ 
            message: 'Comments retrieved successfully',
            comments: commentsWithProfilePics
        });
    })
    .catch(error => {
        return res.status(500).json({ error: 'Failed to retrieve comments', details: error.message });
    });
};

module.exports.updateComment = (req, res) => {
    return Comment.findById(req.params.id)
    .then(comment => {
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        if (comment.author.toString() !== req.user.id && !req.user.isAdmin) {
            return res.status(403).json({ error: 'You can only update your own comments' });
        }

        const { content } = req.body;

        if (content) comment.content = content;

        return comment.save();
    })
    .then(updatedComment => {
        return Comment.findById(updatedComment._id).populate('author', 'username email profilePicture');
    })
    .then(populatedComment => {
        const commentObj = populatedComment.toObject();
        if (!commentObj.authorProfilePicture && populatedComment.author && populatedComment.author.profilePicture) {
            commentObj.authorProfilePicture = populatedComment.author.profilePicture;
        }
        return res.status(200).json({ 
            message: 'Comment updated successfully',
            comment: commentObj
        });
    })
    .catch(error => {
        return res.status(500).json({ error: 'Failed to update comment', details: error.message });
    });
};

module.exports.deleteComment = (req, res) => {
    return Comment.findById(req.params.id)
    .then(comment => {
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        if (comment.author.toString() !== req.user.id && !req.user.isAdmin) {
            return res.status(403).json({ error: 'You can only delete your own comments' });
        }

        return Comment.findByIdAndDelete(req.params.id);
    })
    .then(() => {
        return res.status(200).json({ message: 'Comment deleted successfully' });
    })
    .catch(error => {
        return res.status(500).json({ error: 'Failed to delete comment', details: error.message });
    });
};
