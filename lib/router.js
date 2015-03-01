// Router configuration
Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  waitOn: function() { 
    return [Meteor.subscribe('notifications')];
  }
});

// Controllers
PostsListController = RouteController.extend({
  template: 'postsList',
  increment: 5, 
  postsLimit: function() { 
    return parseInt(this.params.postsLimit) || this.increment; 
  },
  findOptions: function() {
    return {sort: {submitted: -1, _id: -1}, limit: this.postsLimit()};
  },
  waitOn: function() {
    return Meteor.subscribe('posts', this.postsLimit());
  },
  nextPath: function() {
    if (this.postsLimit() < 30) { // TODO: get actual post count
      return this.route.path({postsLimit: this.postsLimit() + this.increment});
    } else {
      return false;      
    }
  },
  data: function() {
    return {
      posts: Posts.find({}, this.findOptions()),
      nextPath: this.nextPath()
    };
  }
});

// Routes
Router.route('/posts/:_id', {
  name: 'postPage',
  waitOn: function() {
    return [
      Meteor.subscribe('singlePost', this.params._id),
      Meteor.subscribe('comments', this.params._id)
    ];
  },
  data: function() { return Posts.findOne(this.params._id); }
});
Router.route('/posts/:_id/edit', {
  name: 'postEdit',
  waitOn: function() { 
    return Meteor.subscribe('singlePost', this.params._id);
  },
  data: function() { return Posts.findOne(this.params._id); }
});
Router.route('/submit', {
  name :'postSubmit',
  progress: false
});
Router.route('/:postsLimit?', {
  name :'postsList',
  controller: PostsListController
});

// 'Before' checks
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