const router = require('express').Router();
const userRoutes = require('./beUserRoutes');
const eventRoutes = require('./beEventRoutes');
const commentRoutes = require('./beCommentRoutes')

router.use('/user', userRoutes);
router.use('/event', eventRoutes);
router.use('/comment', commentRoutes);

module.exports = router;