const passport = require('passport');

exports.googleAuth = passport.authenticate('google', { scope: ['profile', 'email'] });

exports.googleAuthCallback = passport.authenticate('google', {
  successRedirect: process.env.CLIENT_URL || 'http://localhost:3000',
  failureRedirect: '/auth/login/failed',
});

exports.microsoftAuth = passport.authenticate('microsoft', { scope: ['user.read'] });

exports.microsoftAuthCallback = passport.authenticate('microsoft', {
  successRedirect: process.env.CLIENT_URL || 'http://localhost:3000',
  failureRedirect: '/auth/login/failed',
});

exports.getUser = (req, res) => {
  if (req.user) {
    res.status(200).json({
      success: true,
      user: req.user
    });
  } else {
    res.status(401).json({
      success: false,
      message: "Not authenticated"
    });
  }
};

exports.loginFailed = (req, res) => {
  res.status(401).json({
    success: false,
    message: "failure",
  });
};

exports.logout = (req, res) => {
  req.logout();
  res.redirect(process.env.CLIENT_URL || 'http://localhost:3000');
};
