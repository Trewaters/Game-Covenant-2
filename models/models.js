// models/models.js

var mongoose = require('mongoose');

var eveSchema = new mongoose.Schema({ // [To Do] change to 'eventSchema'

	//eveCreatedBy: {type:String, trim:true},		//should be changed to ObjectId, ref "User"	

	// look up mongoose specs and add these as the new schema for post.
	// (http://mongoosejs.com/docs/schematypes.html)
	
	eveUser: { type: String, trim: true }, 
	// This should be the unique _id for the MongoDB record that created this event
	// example: "trewaters"
		
	eveTitle: { type: String, trim: true },
	// Event name or Title
	//example: "Star Wars D6: A Night At the Opera"
	
	eveType: { type: String, trim: true }, 
	// Pick list ("Event, Game")
		
	eveTime: { type: Date, default: Date.now }, 
	// The user should add this in manually, format (Day name, comma, Month name, space, day number, comma, year number, comma, hour, AM/PM, hyphen, hour, AM/PM, open parenthesis, Timezone abbreviation, closing parenthesis)
	//example: "Sunday, June 7, 2:00 AM - 5:00 AM (EST)"
	// Post time consist of many parts
	
	//eve.date: Date, // Month, day, year
	//eve.clock: Date, // hour and minutes, AM/PM, do a 24 hour clock time
	//eve.day: {type:String, trim:true}, // calculate what day of the week this takes place	
	
	eveTimezone: { type: String, trim: true }, 
	// Make a short list of timezones for the user to select from
	// example: "Hong Kong Time (GMT +8, HKT)"
	
	eveDuration: { type: String, trim: true },
	//duration: {type: Number, min:0, max:24}, //this is what it will be after testing, maybe
	// the calculated time using the 
	// example: "3 hours 15 minutes"
	
	eveSystem: { type: String, trim: true }, 
	// Game System they plan to use
	
	eveSetting: { type: String, trim: true }, 
	// Short description for the game or setting they are using
	
	evePlayMax: Number, 
	// Max Number of players allowed in the game, eventually add min number too
	// Later I would like this to also list the player {{name}}s that are in this event too
	
	eveKnow: { type: String, trim: true }, 
	// Pick list of player knowledge, (Never Played, Beginner (needs to ask questions about game), Proficient (can find answers to questions in the rule system material, if needed), Master (can run the game, if needed) )
	// example: "Never Played"
	
	eveMaturity: { type: String, trim: true }, 
	// Pick list of maturity, (E: Everyone, T: Teen (13+), NC 17: No Children (17+), A: Adults Only (18+))
	// example: "E: Everyone"
	
	evePreGen: Boolean, // Yes or No for GM making pre-gens available.

	eveLink: { type: String, trim: true }, // http link, example: "http://www.1km1kt.net/"
	
	eveEmail: { type: String, trim: true }, // email, example: "person@gmail.com"
	
	eveHost: { type: String, trim: true }, // Same as the GM of the game or host of panel, Admin for this game
	// The host of the game that doesn't have to be the creator
	// This should relate to the post.User field, but not unique field
	//example: "Tre' Grisby"
	
	eveImage: { type: String, trim: true }, // http link to a file or the image, example: "http://www.1km1kt.net/"
	
	eveWebsite: { type: String, trim: true }, // http link, Game website, marketplace information , example: "http://www.1km1kt.net/"
	
	eveJoin: { type: String, trim: true }, //  http link that will help players join the game, example: "http://www.1km1kt.net/"
	
	eveRegCon: {type: String, trim: true}, // name of the convention that this event is part of
	
	eveComplete : Boolean, // game is done and ready to be listed on the schedule
	
	eveApproved : Boolean, // game has been approved by the convention organizer
	
	eveCreatedDate: {type: Date, default: Date.now}, //date this user was created
	//eveComments: [{type: String, trim: true }] //array of comments about the event, embed document {user, comment, date/time}
	//evePlayerWait/playerWait: [{type: String, trim: true}] - array of users that are waiting to get into the event
	evePlayers: [{type: String, trim: true}] //array of players in the game
});

var userSchema = new mongoose.Schema({
	
	username: { type: String, trim: true }, // call sign the user wants to be known by 
	// usrName/username - I can't change this because passport uses it for authentication. 8/20/2015
	password: { type: String, trim: true }, //hash created from password 
	// usrPass/password - I can't change this because passport uses it for authentication. 8/20/2015
	usrEmail: { type: String, trim: true }, //user contact email and verification
	usrFirst: { type: String, trim: true }, //user first name
	usrLast: { type: String, trim: true }, //user last name
	usrTimezone: { type: String, trim: true }, //user local timezone for game scheduling and event time conversion, eventually a pick list in GMT
	usrCountry: { type: String, trim: true }, //user country
	usrZipCode: { type: String, trim: true }, //user zip code
	usrGender: { type: String, trim: true }, //user gender, pick list (male,female,other)
	usrBirth: { type: String, trim: true }, //user birthdate, later make this a date field so I can do some conversions, validations, and calculations on it
	usrPrefHours: { type: String, trim: true }, //user preferred playing hours, make this a pick list of time blocks by hours (Morning, Noon, Night), use local timezone for this
	usrSocAuth: { type: String, trim: true }, //users preferred social media authentication	
	usrCreatedDate: { type: Date, default: Date.now } //user profile created date,
	//usrID/userID: { type : Number } //user ID based on when they joined the system. Unique number but not a unique id for the database objects
});

var conSchema = new mongoose.Schema({
	//_id: {type: mongoose.Schema.Types.ObjectId}, // add conID so identify a specific MongoDB data item
	conName: { type: String, trim: true }, // name of the convention, validate that this is unique (http://mongoosejs.com/docs/api.html#schematype_SchemaType-validate)
	conDesc: { type: String, trim: true }, // description of the convention
	conDateStart: { type: Date, default: Date.now }, // date and time the convention starts
	conDateEnd: { type: Date, default: Date.now }, // date and time the convention ends
	conLogo: { type: String, trim: true }, // branding for the convention
	conWww: { type: String, trim: true }, // convention website
	conCreate: Boolean, // users can create games
	conOwner: [{ type: String, trim: true }], // owner or organizer of the convention. Allows an array of names to search on
	conCreatedDate: { type: Date, default: Date.now }, // date the convention was created
	conPlayerList: [{ type: String, trim: true }] //Make this an array when it works. validate this in the future.
});

mongoose.model('Post', eveSchema);
mongoose.model('User', userSchema);
mongoose.model('Con', conSchema);

//utility functions

//find users
var User = mongoose.model('User');

// reference - https://scotch.io/tutorials/using-mongoosejs-in-node-js-and-mongodb-applications
// [DEBUG] - I can't get this to work for me. I have had to abandon it
exports.findByUsername = function (userName, callback) {
	User.findOne({ usrName: userName }, function (err, user) { 
		if (err) {
			return callback(err);
		}
		//success
		return callback(null, user);
	});
};

// [TO DO] - for clarity change to "findByUserId"
exports.findById = function (id, callback) {
	User.findById(id, function (err, user) {
		if (err) {
			return callback(err);
		}
		return callback(null, user);
	});
};

//find conventions
var Con = mongoose.model('Con');

// [In Progress] -
exports.findById = function (id, callback) {
	Con.findById(id, function (err, con) {
		if (err) {
			return callback(err);
		}
		return callback(null, con);
	});
};