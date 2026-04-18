const express = require('express');
const router = express.Router();
const communityController = require('../controllers/communityController');

router.post('/', communityController.createPost);
router.get('/', communityController.getPosts);
router.get('/trending', communityController.getTrending);
router.get('/my-posts', communityController.getMyPosts);

module.exports = router;
