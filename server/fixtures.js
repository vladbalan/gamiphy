// Fixture data 
if (Posts.find().count() === 0) {
  var now = new Date().getTime();
  var words = [
    ["Big stupid", "Very basic", "Awesome", "Cool", "Easy", "DAE hate", "Me and my", "Bad", "The legend of", "Ask me about my", "About the", "Looking for my", "The definition of", "In love with the", "Damn it feels good to be"],
    ["car", 'ship', 'plane', 'cat', 'dog', 'sword', 'droid', 'chair', 'dream', 'skill', 'awesomenes', 'game', 'dragon', 'gangsta'],
    ["s", "", "", "", ""]
  ]

  var jonId = Meteor.users.insert({
    profile: { name: 'Jon Doe' }
  });
  var jon = Meteor.users.findOne(jonId);

  for (var i = 0; i < 50; i++) {
    var noun = words[1][Math.floor(Math.random()*words[1].length)];
    Posts.insert({
      title:  words[0][Math.floor(Math.random()*words[0].length)] + ' ' +
              noun + words[2][Math.floor(Math.random()*words[2].length)],
      author: jon.profile.name,
      userId: jon._id,
      url: 'http://gamiphy.meteor.com/links/' + noun + '-' + i,
      submitted: now - i * 3600 * 1000,
      commentsCount: 0,
      upvoters: [], votes: 0
    });
  }
}