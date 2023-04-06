const passport = require('passport');
const FacebookStrategy = require("passport-facebook").Strategy

const FACEBOOK_CLIENT_ID = process.env.FACEBOOK_CLIENT_ID;
const FACEBOOK_CLIENT_SECRET = process.env.FACEBOOK_CLIENT_SECRET;

  passport.use( new FacebookStrategy(
      {
        clientID: "638165178124178", //236492138851534
        clientSecret: "e718d8470729c418eeab4d29ae204d9d",// b3cacc60a401b2e86834aa3742e3f794
        callbackURL: "/auth/facebook/callback",
        passReqToCallback : true,
      },
      function(accessToken, refreshToken, profile, done) {
        return done(null, profile)
      }
    )
  )
passport.serializeUser(function(user, done) {
    cb(null, user)
  })
passport.deserializeUser(function(user, done) {
    cb(null, user)
  })