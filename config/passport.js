var LocalStrategy   = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('../models/user');
var configAuth = require('./auth');

module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // for local authentication
    passport.use('local-login', new LocalStrategy({
        usernameField : 'form-username',
        passwordField : 'form-password',
        passReqToCallback : true
    }, function(req, username, password, done) {
        User.findOne({ 'local.username' :  username }, function(err, user) {
            if (err) {
                return done(err);
            }

            if (!user) {
                return done(null, false, req.flash('loginMessage', 'No user found.'));
            }

            if (!user.validPassword(password)) {
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
            }

            return done(null, user);
        });
    }));


    // for local signup
    passport.use('local-signup', new LocalStrategy({
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true
    }, function(req, username, password, done) {
        process.nextTick(function() {
            User.findOne({'username': username}, function (err, user) {
                // if there are any errors, return the error
                if (err)
                    return done(err);

                // check to see if theres already a user with that email
                if (user) {
                    return done(null, false, req.flash('signupMessage', 'That username  is already taken.'));
                } else {

                    // if there is no user with that email
                    // create the user
                    var newUser = new User();

                    // set the user's local credentials
                    newUser.local.username = username;
                    newUser.local.password = newUser.generateHash(password);
                    newUser.local.name = req.body.name;
                    newUser.local.email = req.body.email;
                    // save the user
                    newUser.save(function (err) {
                        if (err)
                            return done(null, false, req.flash('signupMessage', 'Invalid email entered.'));
                        return done(null, newUser);
                    });
                }

            });
        });
    }));
    
    // for local authentication
    passport.use('facebook-login', new FacebookStrategy({
        clientID        : configAuth.facebookAuth.clientID,
        clientSecret    : configAuth.facebookAuth.clientSecret,
        callbackURL     : configAuth.facebookAuth.callbackURL
    }, function(token, refreshToken, profile, done) {
        process.nextTick(function() {
            User.findOne({ 'facebook.id' : profile.id }, function (err, user) {
                // if there are any errors, return the error
                if (err)
                    return done(err);

                // check to see if theres already a user with that email
                if (user) {
                    return done(null, user);
                } else {
                    var newUser = new User();
                    newUser.facebook.id    = profile.id;             
                    newUser.facebook.token = token;
                    newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
                    newUser.facebook.email = profile.emails[0].value; 
                    // save the user
                    newUser.save(function (err) {
                        if (err)
                            throw err;
                        return done(null, newUser);
                    });
                }

            });
        });
    }));

}
