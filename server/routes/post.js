const express = require('express');
const router = express.Router();
const postController = require('../controllers/post');
const auth = require('../auth');

router.post('/', auth.verify, postController.createPost);
router.get('/', postController.getAllPosts);
router.get('/trending', postController.getTrendingPosts);
router.get('/new', postController.getNewPosts);
router.get('/:id', postController.getPostById);
router.put('/:id', auth.verify, postController.updatePost);
router.delete('/:id', auth.verify, postController.deletePost);
router.post('/:id/like', auth.verify, postController.likePost);
router.post('/:id/dislike', auth.verify, postController.dislikePost);

module.exports = router;
