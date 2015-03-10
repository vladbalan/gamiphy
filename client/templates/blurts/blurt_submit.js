Template.blurtSubmit.created = function() {
  Session.set('blurtSubmitErrors', {});
}

Template.blurtSubmit.helpers({
  errorMessage: function(field) {
    return Session.get('blurtSubmitErrors')[field];
  },
  errorClass: function (field) {
    return !!Session.get('blurtSubmitErrors')[field] ? 'has-error' : '';
  }
});

Template.blurtSubmit.events({
  'submit form': function(e) {
    e.preventDefault();
    
    var blurt = {
      text: $(e.target).find('[name=text]').val()
    };
    
    var errors = validateBlurt(blurt);
    if (errors.text)
      return Session.set('blurtSubmitErrors', errors);
    
    Meteor.call('blurtInsert', blurt, function(error, result) {
      // display the error to the user and abort
      if (error)
        return throwError(error.reason);
      
      // show this result but route anyway
      if (result.blurtExists)
        throwError('This link has already been blurted');
      
      Router.go('blurtPage', {_id: result._id});  
    });
  }
});