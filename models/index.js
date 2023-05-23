const User = require('./User');
const Event = require('./Event');
const Comment = require('./Comment');

User.hasMany(Event, {
  foreignKey: 'creator_id',
  as: "createdEvents",
  onDelete: 'CASCADE',
});
Event.belongsTo(User, {
  foreignKey: 'creator_id',
  as: "creator",
});


User.belongsToMany(Event, {
  through: 'Subscription',
});
Event.belongsToMany(User, {
  through: 'Subscription',
});

User.hasMany(Comment, { 
  foreignKey: 'commenter_id',
  as: "comments",
  onDelete: 'CASCADE',
});
Comment.belongsTo(User, {
  foreignKey: 'commenter_id',
  as: "commenter",
});
Event.hasMany(Comment, {
  foreignKey: 'event_id',
  as: "eventComments",
  onDelete: 'CASCADE',
});
Comment.belongsTo(Event, {
  foreignKey: 'event_id',
  as: "event"
});

module.exports = { User, Event , Comment };