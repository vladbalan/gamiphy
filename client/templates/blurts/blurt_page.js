Template.blurtPage.helpers({
  comments: function() {
    return Comments.find({blurtId: this._id});
  }
});