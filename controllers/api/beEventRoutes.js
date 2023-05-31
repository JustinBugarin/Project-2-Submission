const router = require('express').Router();
const { User, Event } = require('../../models');
const withAuth = require('../../utils/auth');

router.post('/', withAuth, async (req, res) => {
  try {
    const newEvent = await Event.create({
      ...req.body,
      creator_id: req.session.user_id,
    });

    res.status(200).json(newEvent);
  } catch (err) {
    res.status(400).json(err);
  }
});

// this is the route that deletes events from user subscription table
router.delete('/:event_id', withAuth, async (req, res) => {
  try {
    // Find the user and event
    const user = await User.findByPk(req.session.user_id);
    const event = await Event.findByPk(req.params.event_id);

    if (!user || !event) {
      res.status(404).json({ message: 'Nah Fam!' });
      return;
    }

    if (user.is_organizer === true) {
      // User is an organizer, delete the event
      await event.destroy();
      res.status(200).json({ message: 'Delete success' });
    } else {
      // User is not an organizer, remove the event from the user's subscriptions
      await user.removeEvent(event);
      res.status(200).json({ message: 'Youre outta there!' });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// this route will take in the event_id and user_id from the front end request and add the event to the user through the subscription table
router.post('/:event_id', withAuth, async (req, res) => {
  try {
    const user = await User.findByPk(req.session.user_id);
    const event = await Event.findByPk(req.params.event_id);

    if (!user || !event) {
      res.status(404).json({ message: 'Nah Fam!' });
      return;
    }
    // same as above, but instead of removing the event association from the user instance we are adding
    await user.addEvent(event); // the .addEvent is from automatically created methods when using a many to many relationship

    res.status(200).json({ message: 'Youre in there bud!' });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
