var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var request = require('request');
var passport = require('passport');

var User = require('../models/user');

var returnToken = function(req, res) {
    var token = jwt.sign({user: req.user}, 'secret', {expiresin: 7200});
    res.redirect('/token?token=' + encodeURIComponent(token) + '&userId=' + encodeURIComponent(req.user._id));
};

router.post('/', function (req, res, next) {
    var user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: bcrypt.hashSync(req.body.password, 10),
        email: req.body.email
    });
    user.save(function(err, result) {
        if (err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }
        res.status(201).json({
            message: 'User created',
            obj: result
        });
    });
});

router.post('/signin', function(req, res, next) {
    User.findOne({email: req.body.email}, function(err, user) {
        if (err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }
        if (!user) {
            return res.status(401).json({
                title: 'Login failed',
                error: {message: 'Invalid login credentials'}
            });
        }
        if (!bcrypt.compareSync(req.body.password, user.password)) {
            return res.status(401).json({
                title: 'Login failed',
                error: {message: 'Invalid login credentials'}
            });
        }
        var token = jwt.sign({user: user}, 'secret', {expiresin: 7200});
        res.status(200).json({
            message: 'Successfully logged in',
            token: token,
            userId: user._id
        });
    });
});


router.get('/signin/facebook', passport.authenticate('facebook', { scope : 'email' }));

router.get('/signin/facebook/callback',
            passport.authenticate('facebook', {
                failureRedirect : '/',
                session: false
            }), returnToken);

router.get('/signin/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

router.get('/signin/google/callback',
            passport.authenticate('google', {
                failureRedirect : '/',
                session: false
            }), returnToken);

router.get('/signin/twitter', passport.authenticate('twitter'));

router.get('/signin/twitter/callback',
            passport.authenticate('twitter', {
                failureRedirect : '/',
                session: false
            }), returnToken);

router.get('/signin/linkedin', passport.authenticate('linkedin'));

router.get('/signin/linkedin/callback',
            passport.authenticate('linkedin', {
                failureRedirect : '/',
                session: false
            }), returnToken);

module.exports = router;
