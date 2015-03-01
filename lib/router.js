Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  waitOn: function() { 
    return [Meteor.subscribe('notifications')];
  }
});
/*
Router.map(function() {
  this.route('postsList', {path: '/'});
});
*/
Router.route('/posts/:_id', {
  name: 'postPage',
  waitOn: function() {
    return Meteor.subscribe('comments', this.params._id);
  },
  data: function() { return Posts.findOne(this.params._id); }
});
Router.route('/posts/:_id/edit', {
  name: 'postEdit',
  data: function() { return Posts.findOne(this.params._id); }
});
Router.route('/submit', {
  name :'postSubmit'
});
Router.route('/:postsLimit?', {
  name :'postsList',
  waitOn: function() {
    var postsLimit = parseInt(this.params.postsLimit) || 5; 
    return Meteor.subscribe('posts', postsLimit);
  },
  data: function() {
    var limit = parseInt(this.params.postsLimit) || 5; 
    return {
      posts: Posts.find({}, {limit: limit})
    };
  }
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