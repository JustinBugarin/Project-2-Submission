const router = require('express').Router();
const { User } = require('../../models');
const withAuth = require('../../utils/auth');

router.post('/', async (req, res) => {
  try {
    const userData = await User.create(req.body);

    req.session.save(() => {
      req.session.user_id = userData.user_id;
      req.session.logged_in = true;

      res.status(200).json(userData);
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put('/', async (req, res) => {
  try {
    const { username, organization, organization_url, email } = req.body;

    // Find the user by their ID
    const user = await User.findByPk(req.session.user_id);

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Update the user data
    if (username) {
      user.username = username;
    }
    if (organization) {
      user.organization = organization;
    }
    if (organization_url) {
      user.organization_url = organization_url;
    }
    if (email) {
      user.email = email;
    }

    // Save the updated user data
    await user.save();

    req.session.user_id = user.user_id;

    res.status(200).json({ message: 'User updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

router.put('/password', withAuth, async (req, res) => {
  try {
    const userData = await User.findOne({
      where: { user_id: req.session.user_id }
    });

    if (!userData) {
      res.status(404).json({ message: 'No user found with this id!' });
      return;
    }
    
    const password = await bcrypt.hash(req.body.password, 10);

    await User.update(
      { password },
      { where: { user_id: req.session.user_id }}
    );

    res.status(200).json({ message: 'Password updated successfully!' });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/login', async (req, res) => { //backend login route where front end email and password are checked for
  try { //find user data in table where db email matches request email
    const userData = await User.findOne({ 
      where: { 
        email: req.body.email } 
      });

    if (!userData) { // if no user found error
      res
        .status(400)
        .json({ message: 'Incorrect email or password, please try again' });
      return;
    }
    // if user data found check password using method of same name, comparing saved db password to reques password
    const validPassword = await userData.checkPassword(req.body.password);

    if (!validPassword) { // if no password match error
      res
        .status(400)
        .json({ message: 'Incorrect email or password, please try again' });
      return;
    }

    req.session.save(() => { // if both checks work then give session logged_in and user_id value
      req.session.user_id = userData.user_id;
      req.session.logged_in = true;
      
      res.json({ user: userData, message: 'You are now logged in!' });
    });

  } catch (err) {
    res.status(400).json(err);
  }
});

router.post('/logout', (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});



module.exports = router;
