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
	secret: 'oh wow very secret much security',
	resave: true,
	saveUninitialized: false
}));

//just for testing
app.get("/ping", (req, res) => {
	
	res.send("pong")
})


//Here I get all the necessary pages
app.get("/registration", (req, res) => {

	res.render("registration")
})


app.get("/login", (req, res) => {

	res.render("login")
})

app.get("/", (req, res) => {

	 res.render("index")
})

// app.post("/registration", (req, res) => {



// })

app.post("/login", bodyParser.urlencoded({extended: true}), function (request, response) {

	if(request.body.username.length === 0) {
		console.log("I'm fine right ?")
		response.redirect('/?message=' + encodeURIComponent("there is something wrong with either you, or your username"));
		return;
	}

	if(request.body.password.length === 0) {
		console.log("I'm fine")
		response.redirect('/?message=' + encodeURIComponent("Mentor already used this password"));
		return;
	}

	User.findOne({
		where: {
			username: request.body.username
		}
	
	}).then(function (user) {
		if (user !== null && request.body.password === user.password) {
			request.session.user = user;
			response.redirect('/');

		}
	}),

	function (error) {
        response.redirect('/?message=' + encodeURIComponent("Invalid email or password."));
    };
});


// Defining a  model for the user this will create a table in the existing database
let User = database.define('User', {
	username: Sequelize.STRING,
	password: Sequelize.STRING,
	email: Sequelize.STRING,
	firstname: Sequelize.STRING,
	lastname: Sequelize.STRING

})


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
})


//Make the server listen on part 8080
app.listen(8080, ( ) => {
	console.log("Local server is responding")
})