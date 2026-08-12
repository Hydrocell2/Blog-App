const Post = require('../models/Post');

module.exports.createPost = (req, res) => {
    const { title, content } = req.body;

    if (!title || !content) {
        return res.status(400).json({ error: 'Title and content are required' });
    }

    const newPost = new Post({
        title,
        content,
        author: req.user.id,
        authorName: req.user.username,
        authorProfilePicture: req.user.profilePicture || ''
    });

    return newPost.save()
    .then(savedPost => {
        return Post.findById(savedPost._id).populate('commentCount');
    })
    .then(populatedPost => {
        return res.status(201).json({ 
            message: 'Post created successfully',
            post: populatedPost
        });
    })
    .catch(error => {
        return res.status(500).json({ error: 'Failed to create post', details: error.message });
    });
};

module.exports.getAllPosts = (req, res) => {
    return Post.find().populate('author', 'username email profilePicture').populate('commentCount').sort({ createdAt: -1 })
    .then(posts => {
        const updatedPosts = posts.map(post => {
            const postObj = post.toObject();
            if (!postObj.authorProfilePicture && post.author && post.author.profilePicture) {
                postObj.authorProfilePicture = post.author.profilePicture;
            }
            return postObj;
        });
        return res.status(200).json({ 
            message: 'Posts retrieved successfully',
            posts: updatedPosts
        });
    })
    .catch(error => {
        return res.status(500).json({ error: 'Failed to retrieve posts', details: error.message });
    });
};

module.exports.getPostById = (req, res) => {
    return Post.findById(req.params.id).populate('author', 'username email profilePicture').populate('commentCount')
    .then(post => {
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const postObj = post.toObject();
        if (!postObj.authorProfilePicture && post.author && post.author.profilePicture) {
            postObj.authorProfilePicture = post.author.profilePicture;
        }

        return res.status(200).json({ 
            message: 'Post retrieved successfully',
            post: postObj
        });
    })
    .catch(error => {
        return res.status(500).json({ error: 'Failed to retrieve post', details: error.message });
    });
};

module.exports.updatePost = (req, res) => {
    return Post.findById(req.params.id)
    .then(post => {
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        if (post.author.toString() !== req.user.id && !req.user.isAdmin) {
            return res.status(403).json({ error: 'You can only update your own posts' });
        }

        const { title, content } = req.body;

        if (title) post.title = title;
        if (content) post.content = content;

        return post.save();
    })
    .then(updatedPost => {
        return Post.findById(updatedPost._id).populate('author', 'username email profilePicture').populate('commentCount');
    })
    .then(populatedPost => {
        const postObj = populatedPost.toObject();
        if (!postObj.authorProfilePicture && populatedPost.author && populatedPost.author.profilePicture) {
            postObj.authorProfilePicture = populatedPost.author.profilePicture;
        }
        return res.status(200).json({ 
            message: 'Post updated successfully',
            post: postObj
        });
    })
    .catch(error => {
        return res.status(500).json({ error: 'Failed to update post', details: error.message });
    });
};

module.exports.deletePost = (req, res) => {
    return Post.findById(req.params.id)
    .then(post => {
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        if (post.author.toString() !== req.user.id && !req.user.isAdmin) {
            return res.status(403).json({ error: 'You can only delete your own posts' });
        }

        return Post.findByIdAndDelete(req.params.id);
    })
    .then(() => {
        return res.status(200).json({ message: 'Post deleted successfully' });
    })
    .catch(error => {
        return res.status(500).json({ error: 'Failed to delete post', details: error.message });
    });
};

module.exports.likePost = (req, res) => {
    return Post.findById(req.params.id).populate('commentCount')
    .then(post => {
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const userId = req.user.id;
        const likeIndex = post.likes.indexOf(userId);
        const dislikeIndex = post.dislikes.indexOf(userId);

        if (dislikeIndex !== -1) {
            post.dislikes.splice(dislikeIndex, 1);
        }

        if (likeIndex === -1) {
            post.likes.push(userId);
        } else {
            post.likes.splice(likeIndex, 1);
        }

        return post.save();
    })
    .then(updatedPost => {
        return Post.findById(updatedPost._id).populate('author', 'username email profilePicture').populate('commentCount');
    })
    .then(populatedPost => {
        const postObj = populatedPost.toObject();
        if (!postObj.authorProfilePicture && populatedPost.author && populatedPost.author.profilePicture) {
            postObj.authorProfilePicture = populatedPost.author.profilePicture;
        }
        return res.status(200).json({ 
            message: 'Post like updated',
            post: postObj
        });
    })
    .catch(error => {
        return res.status(500).json({ error: 'Failed to like post', details: error.message });
    });
};

module.exports.dislikePost = (req, res) => {
    return Post.findById(req.params.id).populate('commentCount')
    .then(post => {
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const userId = req.user.id;
        const likeIndex = post.likes.indexOf(userId);
        const dislikeIndex = post.dislikes.indexOf(userId);

        if (likeIndex !== -1) {
            post.likes.splice(likeIndex, 1);
        }

        if (dislikeIndex === -1) {
            post.dislikes.push(userId);
        } else {
            post.dislikes.splice(dislikeIndex, 1);
        }

        return post.save();
    })
    .then(updatedPost => {
        return Post.findById(updatedPost._id).populate('author', 'username email profilePicture').populate('commentCount');
    })
    .then(populatedPost => {
        const postObj = populatedPost.toObject();
        if (!postObj.authorProfilePicture && populatedPost.author && populatedPost.author.profilePicture) {
            postObj.authorProfilePicture = populatedPost.author.profilePicture;
        }
        return res.status(200).json({ 
            message: 'Post dislike updated',
            post: postObj
        });
    })
    .catch(error => {
        return res.status(500).json({ error: 'Failed to dislike post', details: error.message });
    });
};

module.exports.getTrendingPosts = (req, res) => {
    return Post.find().populate('author', 'username email profilePicture').populate('commentCount').sort({ createdAt: -1 })
    .then(posts => {
        const postsWithProfilePics = posts.map(post => {
            const postObj = post.toObject();
            if (!postObj.authorProfilePicture && post.author && post.author.profilePicture) {
                postObj.authorProfilePicture = post.author.profilePicture;
            }
            return postObj;
        });
        const sortedPosts = postsWithProfilePics.sort((a, b) => b.likes.length - a.likes.length).slice(0, 5);
        return res.status(200).json({ 
            message: 'Trending posts retrieved successfully',
            posts: sortedPosts
        });
    })
    .catch(error => {
        return res.status(500).json({ error: 'Failed to retrieve trending posts', details: error.message });
    });
};

module.exports.getNewPosts = (req, res) => {
    return Post.find().populate('author', 'username email profilePicture').populate('commentCount').sort({ createdAt: -1 }).limit(5)
    .then(posts => {
        const postsWithProfilePics = posts.map(post => {
            const postObj = post.toObject();
            if (!postObj.authorProfilePicture && post.author && post.author.profilePicture) {
                postObj.authorProfilePicture = post.author.profilePicture;
            }
            return postObj;
        });
        return res.status(200).json({ 
            message: 'New posts retrieved successfully',
            posts: postsWithProfilePics
        });
    })
    .catch(error => {
        return res.status(500).json({ error: 'Failed to retrieve new posts', details: error.message });
    });
};
