var fs = require('fs');
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var firebase = require('firebase');
var firepad = require('firepad');
var archiver = require('archiver');

var User = require('../models/user');
var Project = require('../models/project');

var config = {
	apiKey: "AIzaSyABCBP2MzvsVzqaZE89BImEadvjJiyNEv8",
	authDomain: "test-project-df431.firebaseapp.com",
	databaseURL: "https://test-project-df431.firebaseio.com",
	projectId: "test-project-df431",
	storageBucket: "test-project-df431.appspot.com",
	messagingSenderId: "284951005772"
};
firebase.initializeApp(config);

//TODO: Add Firebase token authentication
/*
router.get('/', function (req, res, next) {
    Message.find()
        .populate('user', 'firstName')
        .exec(function (err, messages) {
            if (err) {
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                });
            }
            res.status(200).json({
                message: 'Success',
                obj: messages
            });
        });
});
*/

router.use('/', function (req, res, next) {
    jwt.verify(req.query.token, 'secret', function (err, decoded) {
        if (err) {
            return res.status(401).json({
                title: 'Not Authenticated',
                error: err
            });
        }
        next();
    })
});

router.post('/create/:name', function (req, res, next) {
    var decoded = jwt.decode(req.query.token);
    User.findById(decoded.user._id, function (err, user) {
        if (err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }
        Project.findOne({name: req.params.name}, function(err, project) {
            if (err) {
                return res.status(500).json({
                    title: 'An error occured',
                    error: err
                });
            }
            if (project) {
                return res.status(201).json({
                    message: 'Saved project',
                    obj: project
                });
            }
            else {
                var project = new Project({
                    name: req.params.name,
                    files: [],
                    users: [user]
                });
                project.save(function (err, result) {
                    if (err) {
                        return res.status(500).json({
                            title: 'An error occurred',
                            error: err
                        });
                    }
                    user.projects.push(result);
                    user.save();
                    res.status(201).json({
                        message: 'Saved project',
                        obj: result
                    });
                });
            }
        });
    });
});

router.post('/:id/file', function(req, res, next) {
    var decoded = jwt.decode(req.query.token);
    User.findById(decoded.user._id, function (err, user) {
        if (err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }
        Project.findById(req.params.id, function(err, project) {
            if (err) {
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                });
            }
            var equalID = function(e) {
                return e.equals(user._id);
            }
            if (project.users.find(equalID)) {
                // remove all leading and trailing slashes
                var fileName = req.body.name.replace(/^\/|\/$/g,'');
                if (!project.files.includes(fileName)) {
                    project.files.push(fileName);
                    project.save();
                }
                return res.status(200).json({
                    title: 'File created'
                });
            }
            else {
                return res.status(401).json({
                    title: 'Not Authenticated',
                    error: {message: 'User not allowed to modify this project'}
                });
            }
        });
    });
});

router.post('/:id/launch', function(req, res, next) {
    var decoded = jwt.decode(req.query.token);
    User.findById(decoded.user._id, function (err, user) {
        if (err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }
        Project.findById(req.params.id, function(err, project) {
            if (err) {
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                });
            }
            var equalID = function(e) {
                return e.equals(user._id);
            }
            if (project.users.find(equalID)) {
                // make a zip file to upload
                var output = fs.createWriteStream('/tmp/example.zip');
                var archive = archiver('zip', {
                    zlib: { level: 9 } // Sets the compression level.
                });
                archive.pipe(output);
                // create a promises array that reads the content of the files
                var promiseArray = project.files.map(function(fileName) {
                    return new Promise((resolve, reject) => {
                        var ref = firebase.database().ref("firepad/" + project._id + "/" + fileName);
                        var headless = new firepad.Headless(ref);
                        headless.getText(function(text) {
                            archive.append(text, { name: fileName });
                            headless.dispose();
                            resolve(text);
                        });
                    });
                });
                // all files added, now we upload the zip file
                Promise.all(promiseArray).then((values) => {
                    // Upload the file to the API
                    archive.finalize();
                    return res.status(200).json({
                        title: "LAUNCHED!"
                    });
                });
            }
            else {
                return res.status(401).json({
                    title: 'Not Authenticated',
                    error: {message: 'User not allowed to modify this project'}
                });
            }
        });
    });
});
            
    
/*
router.patch('/:id', function (req, res, next) {
    var decoded = jwt.decode(req.query.token);
    Message.findById(req.params.id, function (err, message) {
        if (err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }
        if (!message) {
            return res.status(500).json({
                title: 'No Message Found!',
                error: {message: 'Message not found'}
            });
        }
        if (message.user != decoded.user._id) {
            return res.status(401).json({
                title: 'Not Authenticated',
                error: {message: 'Users do not match'}
            });
        }
        message.content = req.body.content;
        message.save(function (err, result) {
            if (err) {
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                });
            }
            res.status(200).json({
                message: 'Updated message',
                obj: result
            });
        });
    });
});

router.delete('/:id', function (req, res, next) {
    var decoded = jwt.decode(req.query.token);
    Message.findById(req.params.id, function (err, message) {
        if (err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }
        if (!message) {
            return res.status(500).json({
                title: 'No Message Found!',
                error: {message: 'Message not found'}
            });
        }
        if (message.user != decoded.user._id) {
            return res.status(401).json({
                title: 'Not Authenticated',
                error: {message: 'Users do not match'}
            });
        }
        message.remove(function (err, result) {
            if (err) {
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                });
            }
            res.status(200).json({
                message: 'Deleted message',
                obj: result
            });
        });
    });
});
*/

module.exports = router;
