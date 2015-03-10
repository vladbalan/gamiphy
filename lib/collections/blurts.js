Blurts = new Mongo.Collection('blurts');

Blurts.allow({
  update: function(userId, blurt) { return ownsDocument(userId, blurt); },
  remove: function(userId, blurt) { return ownsDocument(userId, blurt); },
});

Blurts.deny({
  update: function(userId, blurt, fieldNames) {
    // may only edit the following fields:
    return (_.without(fieldNames, 'text').length > 0);
  }
});

Blurts.deny({
  update: function(userId, blurt, fieldNames, modifier) {
    var errors = validateBlurt(modifier.$set);
    return errors.text;
  }
});

validateBlurt = function (blurt) {
  var errors = {};

  if (!blurt.text)
    errors.text = "You forgot how to blurt!";
  
  return errors;
}

Meteor.methods({
  blurtInsert: function(blurtAttributes) {
    check(this.userId, String);
    check(blurtAttributes, {
      text: String,
    });
    
    var errors = validateBlurt(blurtAttributes);
    if (errors.text)
      throw new Meteor.Error('invalid-blurt', "You forgot how to blurt!");
    
    var user = Meteor.user();
    var blurt = _.extend(blurtAttributes, {
      userId: user._id, 
      author: user.profile.name || user.username, 
      submitted: new Date(),
      commentsCount: 0,
      upvoters: [], 
      votes: 0
    });
    
    var blurtId = Blurts.insert(blurt);
    
    return {
      _id: blurtId
    };
  },
  
  upvote: function(blurtId) {
    check(this.userId, String);
    check(blurtId, String);
    
    var affected = Blurts.update({
      _id: blurtId, 
      upvoters: {$ne: this.userId}
    }, {
      $addToSet: {upvoters: this.userId},
      $inc: {votes: 1}
    });
    
    if (! affected)
      throw new Meteor.Error('invalid', "You weren't able to upvote that blurt");
  }
});
