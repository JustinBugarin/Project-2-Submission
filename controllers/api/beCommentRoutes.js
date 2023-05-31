const router = require('express').Router();
const { Comment } = require('../../models');
const withAuth = require('../../utils/auth');

router.post('/:event_id', withAuth, async (req, res) => {
  try {
    const newComment = await Comment.create({
      ...req.body,
      commenter_id: req.session.user_id,
      event_id: req.params.event_id
    });

    res.status(200).json({ newComment });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;