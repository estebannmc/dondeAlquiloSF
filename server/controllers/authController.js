const passport = require('passport');

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

if (process.env.GOOGLE_CLIENT_ID) {
  const GoogleStrategy = require('passport-google-oauth20').Strategy;
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  }, async (accessToken, refreshToken, profile, done) => {
    const { db } = require('../config/firebase');
    const userRef = db.collection('users').doc(profile.id);
    const doc = await userRef.get();
    const userData = {
      id: profile.id,
      nombre: profile.displayName,
      email: profile.emails ? profile.emails[0].value : '',
      proveedor_login: 'google'
    };
    if (!doc.exists) await userRef.set(userData);
    return done(null, userData);
  }));
}

exports.googleAuth = (req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    return res.redirect('/auth/mock-callback?provider=google');
  }
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
};

exports.googleAuthCallback = (req, res) => {
  passport.authenticate('google', {
    successRedirect: CLIENT_URL,
    failureRedirect: '/auth/login/failed',
  })(req, res);
};

exports.mockCallback = (req, res) => {
  const mockUser = {
    id: 'mock_user_1',
    nombre: 'Usuario Demo',
    email: 'demo@ejemplo.com',
    proveedor_login: 'google'
  };
  req.login(mockUser, (err) => {
    if (err) return res.redirect('/auth/login/failed');
    res.redirect(CLIENT_URL);
  });
};

exports.mockLogin = (req, res) => {
  const mockUser = {
    id: 'mock_user_1',
    nombre: 'Usuario Demo',
    email: 'demo@ejemplo.com',
    proveedor_login: 'demo'
  };
  req.session.user = mockUser;
  res.json({ success: true, user: mockUser });
};

exports.microsoftAuth = passport.authenticate('microsoft', { scope: ['user.read'] });

exports.microsoftAuthCallback = passport.authenticate('microsoft', {
  successRedirect: CLIENT_URL,
  failureRedirect: '/auth/login/failed',
});

exports.getUser = (req, res) => {
  if (req.user) {
    res.status(200).json({ success: true, user: req.user });
  } else if (req.session?.user) {
    res.status(200).json({ success: true, user: req.session.user });
  } else {
    res.status(401).json({ success: false, message: "Not authenticated" });
  }
};

exports.loginFailed = (req, res) => {
  res.status(401).json({ success: false, message: "failure" });
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ success: false, message: 'Logout failed' });
    res.clearCookie('session', { path: '/' });
    res.json({ success: true });
  });
};