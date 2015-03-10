Meteor.publish('blurts', function(options) {
  check(options, {
    sort: Object,
    limit: Number
  });
  return Blurts.find({}, options);
});

Meteor.publish('singleBlurt', function(id) {
  check(id, String);
  return Blurts.find(id);
});

Meteor.publish('comments', function(blurtId) {
  check(blurtId, String);
  return Comments.find({blurtId: blurtId});
});

Meteor.publish('notifications', function() {
  return Notifications.find({userId: this.userId});
});