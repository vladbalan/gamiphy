Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  waitOn: function() { 
    return [Meteor.subscribe('posts'), Meteor.subscribe('comments')];
  }
});
/*
Router.map(function() {
  this.route('postsList', {path: '/'});
});
*/
Router.route('/', {
  name :'postsList'
});
Router.route('/posts/:_id', {
  name: 'postPage',
  /*waitOn: function() {
    return [
      Meteor.subscribe('singlePost', this.params._id),
      Meteor.subscribe('comments', this.params._id)
    ];
  },*/
  data: function() { return Posts.findOne(this.params._id); }
});
Router.route('/posts/:_id/edit', {
  name: 'postEdit',
  data: function() { return Posts.findOne(this.params._id); }
});
Router.route('/submit', {
  name :'postSubmit'
});

var requireLogin = function() {
  if (! Meteor.user()) {
    if (Meteor.loggingIn()) {
      this.render(this.loadingTemplate);
    } else {
      this.render('accessDenied');
    }
  } else {
    this.next();
  }
}

Router.before(requireLogin, {only: 'postSubmit'});
Router.before(requireLogin, {only: 'postEdit'});