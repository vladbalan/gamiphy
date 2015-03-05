// Fixture data 
function rand(max) {
  return Math.floor(Math.random() * max);
}

function randArray(array) {
  return array[rand(array.length)];
}

if (Posts.find().count() === 0) {
  var now = new Date().getTime();
  var words = [
    ["Big stupid", "Very basic", "Awesome", "Cool", "Easy", "DAE hate", "Me and my", "Bad", "The legend of", "Ask me about my", "About the", "Looking for my", "The definition of", "In love with the", "Damn it feels good to be"],
    ["car", 'ship', 'plane', 'cat', 'dog', 'sword', 'droid', 'chair', 'dream', 'skill', 'awesomenes', 'game', 'dragon', 'gangsta'],
    ["s", "", "", "", ""],
    [".", ".", ".", ",", ",", ",", ",", ";", "!", "!", "?"]
  ]

  var jonId = Meteor.users.insert({
    profile: { name: 'Jon Doe' }
  });
  var jon = Meteor.users.findOne(jonId);

  for (var i = 0; i < 50; i++) {
    var noun = randArray(words[1]);
    var commentsCount = rand(10);
    var postId = Posts.insert({
      title:  randArray(words[0]) + ' ' +
              noun + randArray(words[2]),
      author: jon.profile.name,
      userId: jon._id,
      url: 'http://gamiphy.meteor.com/links/' + noun + '-' + i,
      submitted: now - i * 3600 * 1000,
      commentsCount: commentsCount,
      upvoters: [], votes: 0
    });

    for (var j = 0; j < commentsCount; j++) {
      var currentBody = '';
      for (var k = 1; k < rand(10); k++) {
        currentBody +=  randArray(words[0]) + ' ' +
                        randArray(words[1]) + 
                        randArray(words[2]) + 
                        randArray(words[3]) + ' ';
      }
      var dateFactor = (j > i) ? i : j;
      Comments.insert({
        userId: jon._id,
        author: jon.profile.name,
        postId: postId,
        submitted: now - dateFactor * 3600 * 1000,
        body: currentBody
      })
    }
  }
}