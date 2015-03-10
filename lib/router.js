// Router configuration
Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound',
  waitOn: function() { 
    return [Meteor.subscribe('notifications')];
  }
});

// Controllers
BlurtsListController = RouteController.extend({
  template: 'blurtsList',
  increment: 5, 
  blurtsLimit: function() { 
    return parseInt(this.params.blurtsLimit) || this.increment; 
  },
  findOptions: function() {
    return {sort: this.sort, limit: this.blurtsLimit()};
  },
  subscriptions: function() {
    this.blurtsSub = Meteor.subscribe('blurts', this.findOptions());
  },
  blurts: function() {
    return Blurts.find({}, this.findOptions());
  },
  data: function() {
    var self = this;
    return {
      blurts: self.blurts(),
      ready: self.blurtsSub.ready,
      nextPath: function() {
        if (self.blurts().count() === self.blurtsLimit())
          return self.nextPath();
      }
    };
  }
});

NewBlurtsListController = BlurtsListController.extend({
  sort: {submitted: -1, _id: -1},
  nextPath: function() {
    return Router.routes.newBlurts.path({blurtsLimit: this.blurtsLimit() + this.increment})
  }
});

BestBlurtsListController = BlurtsListController.extend({
  sort: {votes: -1, submitted: -1, _id: -1},
  nextPath: function() {
    return Router.routes.bestBlurts.path({blurtsLimit: this.blurtsLimit() + this.increment})
  }
});

// Routes
Router.route('/blurts/:_id', {
  name: 'blurtPage',
  waitOn: function() {
    return [
      Meteor.subscribe('singleBlurt', this.params._id),
      Meteor.subscribe('comments', this.params._id)
    ];
  },
  data: function() { return Blurts.findOne(this.params._id); }
});
Router.route('/blurts/:_id/edit', {
  name: 'blurtEdit',
  waitOn: function() { 
    return Meteor.subscribe('singleBlurt', this.params._id);
  },
  data: function() { return Blurts.findOne(this.params._id); }
});
Router.route('/submit', {
  name :'blurtSubmit',
  progress: false
});
Router.route('/admin', {
  name :'admin',
});
Router.route('/', {
  name :'home',
  controller: NewBlurtsListController
});
Router.route('new/:blurtsLimit?', {
  name :'newBlurts',
  controller: NewBlurtsListController
});
Router.route('best/:blurtsLimit?', {
  name :'bestBlurts',
  controller: BestBlurtsListController
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

var requireAdmin = function() {
  var loggedInUser = Meteor.user();
  if (! loggedInUser) {
    if (Meteor.loggingIn()) {
      this.render(this.loadingTemplate);
    } else {
      this.render('accessDenied');
    }
  } else {
    if (! Roles.userIsInRole(loggedInUser, ['admin'])) {
      this.render('accessDenied');
    } else {
      this.next();
    }
  }
}

Router.onBeforeAction('dataNotFound', {only: 'blurtPage'});
Router.before(requireLogin, {only: 'blurtSubmit'});
Router.before(requireLogin, {only: 'blurtEdit'});
Router.before(requireAdmin, {only: 'admin'});