Template.blurtItem.helpers({
  ownBlurt: function() {
    return Meteor.userId() && this.userId == Meteor.userId();
  },
  upvotedClass: function() {
  	var userId = Meteor.userId();
    if (userId && !_.include(this.upvoters, userId)) {
      return 'btn-primary upvotable';
    } else {
      return 'disabled';
    }
  }
});

Template.blurtItem.events({
  'click .upvotable': function(e) {
    e.preventDefault();
    Meteor.call('upvote', this._id);
  }
});