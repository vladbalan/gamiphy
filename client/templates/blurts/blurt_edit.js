Template.blurtEdit.created = function() {
  Session.set('blurtEditErrors', {});
}

Template.blurtEdit.helpers({
  errorMessage: function(field) {
    return Session.get('blurtEditErrors')[field];
  },
  errorClass: function (field) {
    return !!Session.get('blurtEditErrors')[field] ? 'has-error' : '';
  }
});

Template.blurtEdit.events({
  'submit form': function(e) {
    e.preventDefault();
    
    var currentBlurtId = this._id;
    
    var blurtProperties = {
      text: $(e.target).find('[name=text]').val()
    }
    
    var errors = validateBlurt(blurtProperties);
    if (errors.text)
      return Session.set('blurtEditErrors', errors);
    
    Blurts.update(currentBlurtId, {$set: blurtProperties}, function(error) {
      if (error) {
        // display the error to the user
        throwError(error.reason);
      } else {
        Router.go('blurtPage', {_id: currentBlurtId});
      }
    });
  },
  
  'click .delete': function(e) {
    e.preventDefault();
    
    if (confirm("Delete this blurt?")) {
      var currentBlurtId = this._id;
      Blurts.remove(currentBlurtId);
      Router.go('home');
    }
  }
});
