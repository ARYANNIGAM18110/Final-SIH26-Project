const FeedPost = require('../models/FeedPost');
const { calculateDistanceKm } = require('../utils/geoDistance');
const { calculateCVS } = require('../utils/cvsEngine');

exports.getFeedPosts = async (req, res, next) => {
  try {
    const { userLat, userLon } = req.query;
    const posts = await FeedPost.find().sort({ createdAt: -1 });

    const enrichedPosts = posts.map((post) => {
      const postObj = post.toObject();

      if (userLat && userLon && post.location && post.location.coordinates) {
        postObj.distanceKm = calculateDistanceKm(
          parseFloat(userLat),
          parseFloat(userLon),
          post.location.coordinates[1],
          post.location.coordinates[0]
        );
      }

      postObj.cvsScore = calculateCVS({
        confirmedCount: post.confirmedCount,
        reportedCount: post.reportedCount,
        isOfficial: post.isOfficial
      });

      return postObj;
    });

    res.status(200).json({
      success: true,
      count: enrichedPosts.length,
      data: enrichedPosts
    });
  } catch (error) {
    next(error);
  }
};

exports.createFeedPost = async (req, res, next) => {
  try {
    const { type, category, title, desc, location, author, isOfficial } = req.body;

    const newPost = await FeedPost.create({
      postId: `POST-${Math.floor(1000 + Math.random() * 9000)}`,
      type: type || 'NEED_AID',
      category: category || 'General Assistance',
      title,
      desc,
      location: location || { address: 'Local Mesh Area', coordinates: [77.3910, 28.5355] },
      author: author || 'Citizen Responder',
      isOfficial: isOfficial || false
    });

    const io = req.app.get('io');
    if (io) {
      io.emit('NEW_COMMUNITY_FEED', newPost);
    }

    res.status(201).json({
      success: true,
      data: newPost
    });
  } catch (error) {
    next(error);
  }
};

exports.confirmPost = async (req, res, next) => {
  try {
    const post = await FeedPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    post.confirmedCount += 1;
    await post.save();

    res.status(200).json({
      success: true,
      data: post
    });
  } catch (error) {
    next(error);
  }
};

exports.reportPost = async (req, res, next) => {
  try {
    const post = await FeedPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    post.reportedCount += 1;
    await post.save();

    res.status(200).json({
      success: true,
      data: post
    });
  } catch (error) {
    next(error);
  }
};

exports.addComment = async (req, res, next) => {
  try {
    const { user, text } = req.body;
    const post = await FeedPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    post.comments.push({
      user: user || 'Anonymous Responder',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    await post.save();

    res.status(200).json({
      success: true,
      data: post
    });
  } catch (error) {
    next(error);
  }
};