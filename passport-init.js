// javascript/passport-init.js

var mongoose = require('mongoose');   
var User = mongoose.model('User');
var LocalStrategy   = require('passport-local').Strategy;
var bCrypt = require('bcrypt-nodejs');

module.exports = function(passport){

    // Passport needs to be able to serialize and deserialize users to support persistent login sessions
    passport.serializeUser(function(user, done) {
        console.log('serializing user:',user.username);
        //return the unique id for the user
        return done(null, user._id);
    });

    //Deserialize user will call with the unique id provided by serializeuser
    passport.deserializeUser(function(id, done) {
				User.findById(id,function(err, user){
					console.log('deserializing user: ', user.username);
					done(err,user);
				});
        
    });

    passport.use('login', new LocalStrategy({
            passReqToCallback : true
        },
        function(req, username, password, done) {
        	
        	User.findOne({'username': username}, function(err,user){
        		if(err){
        			return done (err);
						}
        		if (!user){
        				console.log('User Not Found with username ' + username);
        				return done(null,false);
        		}
        		if (!isValidPassword(user, password)){
        					console.log('Invalid Password');
        					//wrong password
        					return done(null,false); // redirect back to login page
        					}
									// User and password both match, return user from done method
									// which will be treated like success
        					return done (null, user);
        		})
        	
        }
    ));

    passport.use('signup', new LocalStrategy({
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) {
        	
        	//find a user in mongo with this username
        	User.findOne({'username': username}, function(err, user){
        		// error check, return using the done method
        		if(err){
        			console.log('Error in sign up: ' + err);
        			return done (err);
        			}
        			//already exist
        			if(user){
        				console.log('User already exist with username: ' + username);
        				return done(null, false);
        				} else {
        					// if there is no user, create the user
        					var newUser = new User ();
        					
        					//set the user's local credentials
        					newUser.username = username;
        					newUser.password = createHash(password);
									newUser.usrEmail = req.param('usrEmail');
									newUser.usrFirst = req.param('usrFirst');
									newUser.usrLast = req.param('usrLast');
									newUser.usrTimezone = req.param('usrTimezone');
									newUser.usrCountry = req.param('usrCountry');
									newUser.usrZipCode = req.param('usrZipCode');
									newUser.usrGender = req.param('usrGender');
									newUser.usrBirth = req.param('usrBirth');
									newUser.usrPrefHours = req.param('usrPrefHours');
									newUser.usrSocAuth = req.param('usrSocAuth');
									newUser.usrCreatedDate = req.param('usrCreatedDate');
        					
        					// save the user
        				  newUser.save(function(err){
        					if(err){
        						console.log('Error saving user: ' + err);
        						throw err;
        					}
        						console.log(newUser.username + ' Registration successful');
        						return done(null, newUser); 
        						});
        					}
        		});
        	})
        );

var isValidPassword = function(user, password){
    return bCrypt.compareSync(password, user.password);
};
// Generates hash using bCrypt
var createHash = function(password){
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};
  };