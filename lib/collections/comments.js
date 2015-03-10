Comments = new Mongo.Collection('comments');

Meteor.methods({
  commentInsert: function(commentAttributes) {
    check(this.userId, String);
    check(commentAttributes, {
      blurtId: String,
      body: String
    });
    
    var user = Meteor.user();
    var blurt = Blurts.findOne(commentAttributes.blurtId);

    if (!blurt)
      throw new Meteor.Error('invalid-comment', 'You must comment on a blurt');
    
    comment = _.extend(commentAttributes, {
      userId: user._id,
      author: user.profile.name || user.username,
      submitted: new Date()
    });
    
    // update the blurt with the number of comments
    Blurts.update(comment.blurtId, {$inc: {commentsCount: 1}});
    
    // create the comment, save the id
    comment._id = Comments.insert(comment);
    
    // now create a notification, informing the user that there's been a comment
    createCommentNotification(comment);
    
    return comment._id;
  }
});
