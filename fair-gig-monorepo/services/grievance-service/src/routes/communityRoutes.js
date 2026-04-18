const express = require('express');
const router = express.Router();
const communityController = require('../controllers/communityController');

router.post('/', communityController.createPost);
router.get('/', communityController.getPosts);
router.get('/trending', communityController.getTrending);
router.get('/my-posts', communityController.getMyPosts);
router.get('/advocate-stats', communityController.getAdvocateStats);
router.post('/broadcast', communityController.createBroadcast);
router.get('/broadcasts', communityController.getBroadcasts);
router.patch('/:id/status', communityController.updatePostStatus);

module.exports = router;
