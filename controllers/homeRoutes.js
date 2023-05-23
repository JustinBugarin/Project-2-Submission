const router = require('express').Router();
const { Event, User, Comment } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
  try {
    // Get all events and JOIN with user data
    const eventData = await Event.findAll({
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['username'],
        },
      ],
    });

    // Serialize data so the template can read it
    const events = eventData.map((event) => event.get({ plain: true }));

    // Pass serialized data and session flag into template
    res.render('homepage', { 
      events, 
      logged_in: req.session.logged_in 
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/events', async (req, res) => {
  try {
    // Get all events and JOIN with user data
    const eventData = await Event.findAll({
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['username'],
        },
      ],
    });

    // Serialize data so the template can read it
    const events = eventData.map((event) => event.get({ plain: true }));

    // Pass serialized data and session flag into template
    res.render('allEvents', { 
      events, 
      logged_in: req.session.logged_in 
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/event/:id', async (req, res) => {
  try {
    const eventData = await Event.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['username', 'organization', 'organization_url'],
        },
        {
          model: Comment,
          as: 'eventComments',
          include: [
            {
              model: User,
              as: 'commenter',
              attributes: ['username'],
            },
          ],
        },
      ],
    });

    const event = eventData.get({ plain: true });

    const comments = event.eventComments.map((comment) => ({
      ...comment,
      commenter: comment.commenter.username,
    }));

    event.eventComments = comments;

    const loggedInUser = req.session.user; // Assuming the logged-in user object is stored in the "user" property of the session

    res.render('event', {
      ...event,
      logged_in: req.session.logged_in,
      is_organizer: loggedInUser ? loggedInUser.is_organizer : false,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});


// Use withAuth middleware to prevent access to route
router.get('/profile', withAuth, async (req, res) => {
  try {
    // Find the logged-in user based on the session ID
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Event }],
    });

    const user = userData.get({ plain: true });

    // Check if the user is an organizer
    if (user.is_organizer) {
      // Fetch events created by the user, including event details
      const createdEvents = await Event.findAll({
        where: { creator_id: req.session.user_id },
      });

      // Add the event details to the createdEvents array
      user.createdEvents = createdEvents.map((event) => event.get({ plain: true }));
    }

    console.log("user:", user);
    res.render('profile', {
      ...user,
      logged_in: true
    });
  } catch (err) {
    res.status(500).json(err);
  }
});


router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/profile');
    return;
  }

  res.render('login');
});

module.exports = router;