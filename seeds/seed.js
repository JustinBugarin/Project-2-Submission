const sequelize = require('../config/connection');
const { User, Event, Comment, } = require('../models');

const userData = require('./userData.json');
const eventData = require('./eventData.json');
const commentData = require('./commentData.json')


const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  const users = await User.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
  });

  const organizers = users.filter(user => user.is_organizer);
  const volunteers = users.filter(user => !user.is_organizer);
  const events = [];

  for (const event of eventData) {
    const organizer = organizers[Math.floor(Math.random() * organizers.length)];
    const createdEvent = await Event.create({
      ...event,
      creator_id: organizer.user_id,
      date_created: new Date(),
      event_date: new Date(event.event_date),
    });
    events.push(createdEvent);
  } 

  for (const comment of commentData) {
    const randomCommenter = Math.floor(Math.random() * users.length);
    const randomEvent = Math.floor(Math.random() * events.length);
    await Comment.create({
      ...comment,
      commenter_id: users[randomCommenter].user_id,
      event_id: events[randomEvent].event_id,
      date_created: new Date(),
    });
  }

  for (const volunteer of volunteers) {
    const randomSubEvent = Math.floor(Math.random() * events.length);
    await volunteer.addEvent(events[randomSubEvent]);
  }

  process.exit(0);
};

seedDatabase();