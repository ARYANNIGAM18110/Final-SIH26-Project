const express = require('express');
const router = express.Router();
const {
  getFeedPosts,
  createFeedPost,
  confirmPost,
  reportPost,
  addComment
} = require('../controllers/feedController');

router.route('/')
  .get(getFeedPosts)
  .post(createFeedPost);

router.patch('/:id/confirm', confirmPost);
router.patch('/:id/report', reportPost);
router.post('/:id/comment', addComment);

module.exports = router;