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
    ["Big stupid", "This is my favorite", "Paragon", "Renegade", "Me and my", "In the middle of some", "The legend of", "Ask me about my", "About the", "Looking for my", "The definition of", "In love with the", "Damn it feels good to be a"],
    ["sheppard", "ship", "jellyfish", "calibration", "citadel", "alien", "AI", "omnitool", "dream", "catalyst", "awesomenes", "game", "dragon", "gangsta", "beacon", "scientist salarian", "relay"],
    ["", "", "", "", ""],
    [".", ".", ".", ",", ",", ",", ",", ";", "!", "!", "?"]
  ]

  var users = [
      {name:"Commander Sheppard", username:'shep', email:"csheppard@alliance.sol",roles:[]},
      {name:"Admin", username:'admin', email:"admin@gamiphy.me",roles:['admin']}
    ];

  _.each(users, function (user) {
    var id;

    id = Accounts.createUser({
      email: user.email,
      username: user.username,
      password: "wordpass",
      profile: { name: user.name }
    });

    if (user.roles.length > 0) {
      // Need _id of existing user record so this call must come 
      // after `Accounts.createUser` or `Accounts.onCreate`
      Roles.addUsersToRoles(id, user.roles);
    }

    if (user.username == 'shep') {
      var shep = Meteor.users.findOne(id);

      for (var i = 0; i < 50; i++) {
        var noun = randArray(words[1]);
        var commentsCount = rand(10);
        var postId = Posts.insert({
          title:  randArray(words[0]) + ' ' +
                  noun + randArray(words[2]),
          author: shep.profile.name,
          userId: shep._id,
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
            userId: shep._id,
            author: shep.profile.name,
            postId: postId,
            submitted: now - dateFactor * 3600 * 1000,
            body: currentBody
          })
        }
      }
      
    }

  });

}