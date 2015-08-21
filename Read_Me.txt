Read_Me.txt

A few things to note

- to install Express, after installing Node.js you need to do the following
1) cd to root folder

2) after that installs type "express --ejs ."
	use the . to install in the current directory
	
3) next type "npm install"
	this will install all the dependencies from the "package.json" file
	
- Starting the application
1) once in the root directory type "npm start" to start up server


- Testing API
1) location "http://localhost:3000/api/posts"

- Authentication
1) install Mongoose
2) create "./models/models.js"

	# install express session middleware
		npm install express-session --save
	# install passport
		npm install passport --save
	# install passport-local strategy for handling authentication
		npm install passport-local --save
	# install bcrypt-nodejs for handling creating password hashes
		npm install bcrypt-nodejs --save
		
NOTES

// [IN PROGRESS]
// [DEBUG]
// [NOTE]
// [TO DO]