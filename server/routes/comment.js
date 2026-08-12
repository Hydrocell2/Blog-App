const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comment');
const auth = require('../auth');

router.post('/posts/:postId/comments', auth.verify, commentController.createComment);
router.get('/posts/:postId/comments', commentController.getCommentsByPost);
router.put('/comments/:id', auth.verify, commentController.updateComment);
router.delete('/comments/:id', auth.verify, commentController.deleteComment);

module.exports = router;
