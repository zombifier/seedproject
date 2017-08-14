var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var request = require('request');
var GoogleAuth = require('google-auth-library');
var auth = new GoogleAuth;
var client = new auth.OAuth2('478522410885-hf7mscv37311pki0g9n1apb7fnhoo5el.apps.googleusercontent.com', '', '');


var User = require('../models/user');

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
        var token = jwt.sign({user: user}, 'secret', {expiresIn: 7200});
        res.status(200).json({
            message: 'Successfully logged in',
            token: token,
            userId: user._id
        });
    });
});

router.post('/signin/facebook', function(req, res, next) {
    // verify the token
    // TODO: request's error object cannot be used with the handler
    request("https://graph.facebook.com/debug_token?input_token=" + req.body.facebookToken + "&access_token=478473549211549|fef2c12de0dd3a6f4d56970909b2643b", function(err, response, body) {
        if (err) {
            return res.status(500).json({
                title: 'An error occured',
                error: err
            });
        }
        data = JSON.parse(body).data;
        if (data.app_id == '478473549211549' && data.user_id == req.body.facebookID) {
            User.findOne({facebookID: req.body.facebookID}, function(err, user) {
                if (err) {
                    return res.status(500).json({
                        title: 'An error occurred',
                        error: err
                    });
                }
                // create a new account with this Facebook ID
                if (!user) {
                    var user = new User({
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        email: req.body.email,
                        facebookID: req.body.facebookID
                    });
                    user.save(function(err, result) {
                        if (err) {
                            return res.status(500).json({
                                title: 'An error occurred',
                                error: err
                            });
                        }
                        var token = jwt.sign({user: user}, 'secret', {expiresIn: 7200});
                        return res.status(200).json({
                            message: 'Successfully created user and logged in',
                            token: token,
                            userId: user._id
                        });
                    });
                }
                else {
                    var token = jwt.sign({user: user}, 'secret', {expiresIn: 7200});
                    return res.status(200).json({
                        message: 'Successfully logged in',
                        token: token,
                        userId: user._id
                    });
                }
            });
        }
        else {
            return res.status(500).json({
                title: 'An error occurred',
                error: { message: "Access token cannot be verified" }
            });
        }
    });

});

router.post('/signin/google', function(req, res, next) {
    // verify the token with Google's official package
    client.verifyIdToken(
    req.body.googleToken,
    '478522410885-hf7mscv37311pki0g9n1apb7fnhoo5el.apps.googleusercontent.com',
    function(err, login) {
        if (err) {
            return res.status(500).json({
                title: 'An error occured',
                error: err
            });
        }
        var payload = login.getPayload();
        var userid = payload['sub'];
        if (userid != req.body.googleID) {
            return res.status(500).json({
                title: 'An error occured',
                error: { message: "Token ID does not match user ID" }
            });
        }
        User.findOne({googleID: req.body.googleID }, function(err, user) {
            if (err) {
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                });
            }
            // create a new account with this Google ID
            if (!user) {
                var user = new User({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    googleID: req.body.googleID
                });
                user.save(function(err, result) {
                    if (err) {
                        return res.status(500).json({
                            title: 'An error occurred',
                            error: err
                        });
                    }
                    var token = jwt.sign({user: user}, 'secret', {expiresIn: 7200});
                    return res.status(200).json({
                        message: 'Successfully created user and logged in',
                        token: token,
                        userId: user._id
                    });
                });
            }
            else {
                var token = jwt.sign({user: user}, 'secret', {expiresIn: 7200});
                return res.status(200).json({
                    message: 'Successfully logged in',
                    token: token,
                    userId: user._id
                });
            }
        });
    });
});

module.exports = router;
