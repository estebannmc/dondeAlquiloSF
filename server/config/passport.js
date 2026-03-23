const MicrosoftStrategy = require('passport-microsoft').Strategy;
const passport = require('passport');
const { db } = require('./firebase');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const userRef = db.collection('users').doc(profile.id);
      const doc = await userRef.get();
      
      const userData = {
        id: profile.id,
        nombre: profile.displayName,
        email: profile.emails ? profile.emails[0].value : '',
        proveedor_login: 'google'
      };

      if (!doc.exists) {
        await userRef.set(userData);
      }
      
      return done(null, userData);
    } catch (error) {
      return done(error, null);
    }
  }
));

passport.use(new MicrosoftStrategy({
    clientID: process.env.MICROSOFT_CLIENT_ID,
    clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
    callbackURL: "/auth/microsoft/callback",
    scope: ['user.read']
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const userRef = db.collection('users').doc(profile.id);
      const doc = await userRef.get();
      
      const userData = {
        id: profile.id,
        nombre: profile.displayName,
        email: profile.emails ? profile.emails[0].value : '',
        proveedor_login: 'microsoft'
      };

      if (!doc.exists) {
        await userRef.set(userData);
      }
      
      return done(null, userData);
    } catch (error) {
      return done(error, null);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const doc = await db.collection('users').doc(id).get();
    done(null, doc.data());
  } catch (error) {
    done(error, null);
  }
});
