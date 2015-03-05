// Fixture data 
if (Posts.find().count() === 0) {
  var now = new Date().getTime();
  var words = [
    ["Big", "Simple", "Awesome", "Cool", "Easy", "Cute", "Angry", "Vicious", "Serious"],
    ["blue", "green", "red", "kind", "bad", "lovable", "independent", "black"],
    ["car", 'bike', 'ship', 'cruiser', 'frigate', 'plane', 'cart', 'scooter']
  ]

  var jonId = Meteor.users.insert({
    profile: { name: 'Jon Doe' }
  });
  var jon = Meteor.users.findOne(jonId);

  for (var i = 0; i < 50; i++) {
    var noun = words[2][Math.floor(Math.random()*words[2].length)];
    Posts.insert({
      title:  words[0][Math.floor(Math.random()*words[0].length)] + ' ' +
              words[1][Math.floor(Math.random()*words[1].length)] + ' ' +
              noun,
      author: jon.profile.name,
      userId: jon._id,
      url: 'http://gamiphy.meteor.com/links/' + noun + '-' + i,
      submitted: now - i * 3600 * 1000,
      commentsCount: 0,
      upvoters: [], votes: 0
    });
  }
}