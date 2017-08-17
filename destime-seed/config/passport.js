// var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth2').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
var configAuth = require('./auth');

var User = require('../models/user');

module.exports = function(passport) {
    passport.use(new FacebookStrategy({
        clientID        : configAuth.facebookAuth.clientID,
        clientSecret    : configAuth.facebookAuth.clientSecret,
        callbackURL     : configAuth.facebookAuth.callbackURL,
        passReqToCallback : true,
        profileFields: ['id', 'emails', 'name']
    },
    function(req, token, refreshToken, profile, done) {
        process.nextTick(function() {
            User.findOne({facebookID: profile.id}, function(err, user) {
                if (err) {
                    return done(err);
                }
                // create a new account with this Facebook ID
                if (!user) {
                    var newUser = new User({
                        firstName: profile.name.givenName,
                        lastName: profile.name.familyName,
                        email: profile.emails[0].value,
                        facebookID: profile.id
                    });
                    newUser.save(function(err, result) {
                        if (err) {
                            return done(err);
                        }
                        return done(null, newUser);
                    });
                }
                else {
                    return done(null, user);
                }
            });

        });
    }));

    passport.use(new GoogleStrategy({
        clientID        : configAuth.googleAuth.clientID,
        clientSecret    : configAuth.googleAuth.clientSecret,
        callbackURL     : configAuth.googleAuth.callbackURL,
        passReqToCallback : true,
    },
    function(req, token, refreshToken, profile, done) {
        process.nextTick(function() {
            User.findOne({googleID: profile.id}, function(err, user) {
                if (err) {
                    return done(err);
                }
                // create a new account with this Facebook ID
                if (!user) {
                    var newUser = new User({
                        firstName: profile.name.givenName,
                        lastName: profile.name.familyName,
                        email: profile.emails[0].value,
                        googleID: profile.id
                    });
                    newUser.save(function(err, result) {
                        if (err) {
                            return done(err);
                        }
                        return done(null, newUser);
                    });
                }
                else {
                    return done(null, user);
                }
            });

        });
    }));

    passport.use(new TwitterStrategy({

        consumerKey     : configAuth.twitterAuth.consumerKey,
        consumerSecret  : configAuth.twitterAuth.consumerSecret,
        callbackURL     : configAuth.twitterAuth.callbackURL

    },
    function(token, tokenSecret, profile, done) {
        User.findOne({twitterID: profile.id}, function(err, user) {
            if (err) {
                return done(err);
            }
            // create a new account with this Facebook ID
            if (!user) {
                var newUser = new User({
                    // Twitter does not split first and family name
                    firstName: profile.name.split(" ")[0],
                    lastName: profile.name.split(" ")[1],
                    email: profile.emails[0].value,
                    twitterID: profile.id
                });
                newUser.save(function(err, result) {
                    if (err) {
                        return done(err);
                    }
                    return done(null, newUser);
                });
            }
            else {
                return done(null, user);
            }
        });
    }));


    passport.use(new LinkedInStrategy({
        clientID        : configAuth.linkedinAuth.clientID,
        clientSecret    : configAuth.linkedinAuth.clientSecret,
        callbackURL     : configAuth.linkedinAuth.callbackURL,
        scope: ['r_emailaddress', 'r_basicprofile'],
        state: true,
        passReqToCallback : true,
    },
    function(req, token, refreshToken, profile, done) {
        process.nextTick(function() {
            User.findOne({linkedinID: profile.id}, function(err, user) {
                if (err) {
                    return done(err);
                }
                // create a new account with this Facebook ID
                if (!user) {
                    var newUser = new User({
                        firstName: profile.name.givenName,
                        lastName: profile.name.familyName,
                        email: profile.emails[0].value,
                        linkedinID: profile.id
                    });
                    newUser.save(function(err, result) {
                        if (err) {
                            return done(err);
                        }
                        return done(null, newUser);
                    });
                }
                else {
                    return done(null, user);
                }
            });

        });
    }));



};


