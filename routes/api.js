//api.js

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var Con = mongoose.model('Con');
var User = mongoose.model('User');

//var conId = mongoose.Schema.Types.ObjectID; // not working to allow me access to _id

// Used for routes that must be authenticated.
var isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	
	//allow all get request methods
	if (req.method === "GET") {
		return next();
	}
	if (req.isAuthenticated()) {
		return next();
	}
			
	// if the user is not authenticated then redirect them to the login page
	res.redirect('/#login');
};

// Register the authentication middleware
router.use('/posts', isAuthenticated);
// add new route which must be authenticated
router.use('/cons', isAuthenticated);
// [To Do] add for all the api calls

//api for all posts
router.route('/posts')

//gets all posts
	.get(function (req, res) {
		Post.find(function (err, posts) {
			if (err) {
				return res.send(500, err);
			}
			return res.send(posts);
		});
	})
    
//create a new post
	.post(function (req, res) {
		var post = new Post();

		post.eveUser = req.body.eveUser;
		post.eveTitle = req.body.eveTitle;
		post.eveType = req.body.eveType;
		post.eveTime = req.body.eveTime;
		post.eveTimezone = req.body.eveTimezone;
		post.eveDuration = req.body.eveDuration;
		post.eveSystem = req.body.eveSystem;
		post.eveSetting = req.body.eveSetting;
		post.evePlayMax = req.body.evePlayMax;
		post.eveKnow = req.body.eveKnow;
		post.eveMaturity = req.body.eveMaturity;
		post.evePreGen = req.body.evePreGen;
		post.eveLink = req.body.eveLink;
		post.eveEmail = req.body.eveEmail;
		post.eveHost = req.body.eveHost;
		post.eveImage = req.body.eveImage;
		post.eveWebsite = req.body.eveWebsite;
		post.eveJoin = req.body.eveJoin;
		post.eveRegCon = req.body.eveRegCon;
		post.eveApproved = req.body.eveApproved;
		post.eveComplete = req.body.eveComplete;
		post.eveCreatedDate = req.body.eveCreatedDate;
		post.evePlayers = req.body.evePlayers;

		post.save(function (err, post) {
			if (err) {
				return res.send(500, err);
			}
			return res.json(post);
		});
	})
	
	.put(function (req,res){
				//console.log('beginning of .put(api/cons)'); // [DEBUG]
				
		// save player name to use in update
		var vEvePlayers = req.body.eveUser;
		var vEveTitle = req.body.eveTitle;
	
		// find the submitted convention and add a player
		Post.findOne({ 'eveTitle': vEveTitle }, function (err, onePost) {
			onePost.evePlayers.push(vEvePlayers);
			onePost.save();
		});

		//console.log('end of .put(api/cons)'); // [DEBUG]
	})
	;

/*
//api for a specfic post
router.route('/posts/:id')

//updates specified post
    .put(function (req, res) {
		Post.findById(req.params.id, function (err, post) {
			if (err)
				res.send(err);

			post.user = req.body.user;
			post.title = req.body.title; // added title as a test
			post.type = req.body.type;
			post.time = req.body.time;
			post.timezone = req.body.timezone;
			post.duration = req.body.duration;
			post.system = req.body.system;
			post.setting = req.body.setting;
			post.players = req.body.players;
			post.knowledge = req.body.knowledge;
			post.maturity = req.body.maturity;
			post.preGen = req.body.preGen;
			post.link = req.body.link;
			post.email = req.body.email;
			post.name = req.body.name;
			post.image = req.body.image;
			post.website = req.body.website;
			post.join = req.body.join;

			post.save(function (err, post) {
				if (err)
					res.send(err);

				res.json(post);
			});
		});
	})

//gets specified post
    .get(function (req, res) {
		console.log('req.params._id' + req.params._id); // DEBUG
		Post.findById(req.params._id, function (err, post) {
			if (err)
				res.send(err);
			console.log('/posts/:id post in api.js = ' + post); // DEBUG
			res.json(post);
		});
	}) 

//deletes the post
    .delete(function (req, res) {
		Post.remove({
			_id: req.params.id
		}, function (err) {
            if (err)
                res.send(err);
            res.json("deleted :(");
        });
	});
	*/
	
// add router to list all conventions
router.route('/cons')

// get all conventions
	.get(function (req, res) {
		Con.find(function (err, cons) {
			if (err) { return res.send(500, err); }
			return res.send(cons);
		});		
		/* ORIGINAL
		Con.find(function (err, cons) {
			if (err) { return res.send(500, err); }
			return res.send(cons);
		});
		*/
		
		/*
		if (req.body._id){
			Con.findOne({ 'conName': req.body.conName }, function (err, cons) {
				if (err) res.send(err);
				return res.send(cons)
				})
		}else{
			Con.find(function (err, cons) {
			if (err) { return res.send(500, err); }
			return res.send(cons);
		});
		};
		*/
	})
	
//trying a save instead of an update
	.put(function (req, res) {
		//console.log('beginning of .put(api/cons)'); // [DEBUG]
				
		// save player name to use in update
		var vConPlayerList = req.body.conPlayerList;
		var vConName = req.body.conName;
	
		// find the submitted convention and add a player
		Con.findOne({ 'conName': vConName }, function (err, oneCon) {
			oneCon.conPlayerList.push(vConPlayerList);
			oneCon.save();
		});

		//console.log('end of .put(api/cons)'); // [DEBUG]
	})
	
//.delete(); // mongoose callback remove ( http://mongoosejs.com/docs/api.html#query_Query-remove )
	
	.post(function (req, res) {
		var con = new Con();

		con.conName = req.body.conName;
		con.conDesc = req.body.conDesc;
		con.conDateStart = req.body.conDateStart;
		con.conDateEnd = req.body.conDateEnd;
		con.conLogo = req.body.conLogo;
		con.conWww = req.body.conWww;
		con.conCreate = req.body.conCreate;
		con.conOwner = req.body.conOwner;
		con.conCreatedDate = req.body.conCreatedDate;
		con.conPlayerList = req.body.conPlayerList;
		//con._id = req.body.id; // added convention id
		
		con.save(function (err, con) {
			if (err) {
				return res.send(500, err);
			}
			return res.json(con);
		});
	});

// convention profile, return only one
router.route('/conProfile')

// get
	.get(function (req, res) {
		Con.findOne({ _id: req.params.id }, function (err, conData) {
			
			//console.log('/conProfile conData in api.js = ' + conData); // DEBUG
			
			return res.json(conData);
		});
	})
	
// put
	.put(function (req, res) { })
	
// delete
	.delete()

// post	
	.post(function (req, res) { });
	
// convention profile, return only one
// I don't think I got this to work
router.route('/conProfile/:id')

// get
	.get(function (req, res) {
		Con.findById({ _id: req.params.id }, function (err, conData) {
			
			//console.log('/conProfile/:id conData in api.js = ' + conData); // DEBUG
			
			return res.json(conData);
		});
	})
	
// put
	.put(function (req, res) { })
	
// delete
	.delete()

// post	
	.post(function (req, res) { })

// user profile information, shows only one
router.route('/usrProfile')
// get 
.get(function(req,res){
	
	//console.log('/usrProfile req.body.username in api.js = ' + req.query.username); // DEBUG
	
	User.findOne({username:req.query.username}, function (err, user) {
		
		//console.log('/usrProfile user in api.js = ' + user); // DEBUG
		
			if (err) { return res.send(500, err); }
			return res.send(user);
		});
})

// event profile info ...
router.route('/eveProfile')
.get(function(req, res){
	
	Post.findOne({eveTitle:req.query.eveTitle}, function(err,post){
		
		console.log('/eveProfile user in api.js = ' + post); // DEBUG
		
		if (err){return res.send(500,err);}
		return res.send(post);
	});
})
;

module.exports = router;


/*
// router
router.route('/cons')

// get
.get(function (req, res) {})
	
// put
.put(function (req, res) {})
	
// delete
.delete()

// post	
.post(function (req, res) {});
*/

