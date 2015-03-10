Notifications = new Meteor.Collection('notifications');

Notifications.allow({
  update: function(userId, doc, fieldNames) {
    return ownsDocument(userId, doc)/* && fieldNames.length === 1 && fieldNames[0] === 'read'*/;
  }
});

createCommentNotification = function(comment) {
  var blurt = Blurts.findOne(comment.blurtId);
  if (comment.userId !== blurt.userId) {
    Notifications.insert({
      userId: blurt.userId,
      blurtId: blurt._id,
      commentId: comment._id,
      commenterName: comment.author,
      read: false
    });
  }
};