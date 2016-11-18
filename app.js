// required modules
const express = require ('express');
const bodyParser = require('body-parser');
const Sequelize = require('Sequelize');
const session = require('express-session');
const app = express()

//connecting to the database
const database = new Sequelize('ethereal', 'postgres', 'falafeldragon', {
	host: 'localhost',
	dialect: 'postgres'
})

//setting the view engine to read from views and read pug
app.set("view engine", "pug")
app.set("views", __dirname + "/views")

// tell express to use the static folder
app.use(express.static('static'))
app.use(bodyParser.urlencoded({ extended: true }))

app.use(session({
	secret: 'Is submission not preferable to extinction?',
	resave: true,
	saveUninitialized: false
}));


///////////////////////////////////////////
/*THIS SECTION IS FOR ALL THE GET ROUTES */
///////////////////////////////////////////

// purely for test purposes
app.get("/ping", (req, res) => {
	
	res.send("Things went to hell seven ways to shit sunday")
})

// get and render the main page, which is the log in page
app.get("/", (req, res) => {

	res.render("index")
})


// get and render the account creation page
app.get("/registration", (req, res) => {

	res.render("registration")
})

// get and render the personal/profile page
app.get("/profile", (req, res) => {

	Message.findAll({
		include: User
	})
	.then(function (messages) {

		res.render("profile", {data: messages})
	})


	
})

app.get('/logout', function (request, response) {
	request.session.destroy(function(error) {
		if(error) {
			throw error;


		}
		console.log("user has succesfully logged out")
		response.redirect('/')
	})
});

///////////////////////////////////////////
/*THIS SECTION IS FOR ALL THE POST ROUTES */
///////////////////////////////////////////

app.post("/registration", (req, res) => {

	User.create ({
		username: req.body.username,
		password: req.body.password,
		email: req.body.email,
		firsname: req.body.firstname,
		lastname: req.body.lastname
	}).then( () => {
		console.log("New account created !")
		res.redirect('/')
	})

	
})

app.post('/profile', (req, res) => {
	let user = req.session.user

	Message.create({
		message: req.body.message,
		userId: user.id
	}).then( () => {
		res.redirect('/profile')
	})

})

app.post('/comment', bodyParser.urlencoded({extended: true}), (req, res) => {

	console.log('new comment stored')
	let user = req.session.user

Comment.create({
		comment: req.body.comment,
		userId: user.id,
		
	}).then( () => {
		res.redirect('/profile')
	})
})

// listening to my index pug and once log in is verified redirect to the profile
app.post("/index", bodyParser.urlencoded({extended: true}), function (request, response) {

	if(request.body.username.length === 0) {

		console.log("I'm fine right ?")

		response.redirect('/?message=' + encodeURIComponent("you sir are one giant fuck up"));
		return;
	}

	if(request.body.password.length === 0) {

		console.log("I'm fine")

		response.redirect('/?message=' + encodeURIComponent("Hey Dumbass you forgot something "));
		return;
	}

	User.findOne({
		where: {
			username: request.body.username
		}

	}).then(function (user) {
		if (user !== null && request.body.password === user.password) {
			request.session.user = user;
			response.redirect('profile');

		} else {
			console.log("no user found")
		}
	}),

	function (error) {
		response.redirect('/?message=' + encodeURIComponent("Invalid email or password."));
	};
});

///////////////////////////////////////////
/*THIS SECTION IS WHERE I DEFINE MY MODELS AND SYNC MY DATABASE */
///////////////////////////////////////////

// Defining a  model for the user this will create a table in the existing database
let User = database.define('user', {
	username: Sequelize.STRING,
	password: Sequelize.STRING,
	email: {type: Sequelize.STRING, unique: true},
	firstname: Sequelize.STRING,
	lastname: Sequelize.STRING

})

let Message = database.define('message', {
	message: Sequelize.STRING,
})


let Comment = database.define('comment', {
	comment: Sequelize.STRING
})




//defining relations
User.hasMany( Message )
Message.belongsTo( User)

User.hasMany( Comment )
Message.hasMany( Comment )
Comment.belongsTo( User )
Comment.belongsTo( Message ) 

//syncing the database 
database.sync({force: true}).then( ( ) => {
	console.log("database synced and ready to go")

	User.create ({
		username: "NuminousX",
		password: "one",
		email: "a@a",
		firsname: "a",
		lastname: "b"
	})

	Message.create ({
		message: "Things went to hell seven ways to shit sunday",
		userId: 1
	})
})


//Make the server listen on part 8080
app.listen(8080, ( ) => {
	console.log("Local server is responding")
})