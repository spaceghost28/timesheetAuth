module.exports = function(app) {

  var User = require('./models/user');
  var jwt = require("jsonwebtoken");

  app.post('/login', function(req, res) {
    User.findOne({email: req.body.email }, function(err, user) {
      if (err) {
        res.status(400).json(err);
      } else if (!user) {
        res.status(401).json({ "message": "invalid email"});
      } else if (!user.checkPassword(req.body.password)){
        res.status(401).json({ "message": "invalid password"});
      } else {
        var token = user.generateJwt();
        res.json({
          "token": token,
          "user": user
        });
      }
    });
  });

  app.post('/register', function(req, res) {
    User.findOne({email: req.body.email}, function(err, existingUser) {
      if (err) {
        res.status(400).json(err);
      } else if (existingUser) {
        res.status(401).json({ "message": "that email is already registered"});
      } else {
        var user = new User();
        user.email = req.body.email;
        user.setPassword(req.body.password);
        console.log(user);
        user.save(function(err) {
          var token = user.generateJwt();
          res.json({
            "token": token
          });
        });
      }
    });
  });

};
