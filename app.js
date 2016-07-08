var express 		= require('express'),
	app				= express(),
	mongoose		= require('mongoose'),
	bodyParser		= require('body-parser'),
	methodOverride 	= require('method-override');

// APP CONFIG
mongoose.connect('mongodb://localhost/roster');
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));

// MONGOOSE/MODEL CONFIG
var rosterSchema = new mongoose.Schema({
	name: String,
	age: Number,
	hometown: String,
	image: String,
	position: String,
	bats: String,
	throws: String,
	avg: {type: Number, default: 0},
	hr: {type: Number, default: 0},
	doubles: {type: Number, default: 0},
	triples: {type: Number, default: 0}
});

var Player = mongoose.model('Player', rosterSchema);

// Player.create({
// 	name: "Dan Smith",
// 	age: 23,
// 	hometown: "Brielle, NJ",
// 	image: "http://grfx.cstv.com/schools/kty/blog/Strieby_action.jpg",
// 	position: "1B",
// 	bats: "Right",
// 	throws: "Right",
// 	avg: .286,
// 	hr: 12,
// 	doubles: 21,
// 	triples: 2
// });

// RESTful ROUTES
app.get('/', function(req, res) {
	res.redirect('/roster');
});

// INDEX ROUTE
app.get('/roster', function(req, res) {
	Player.find({}, function(err, players) {
		if (err) {
			console.log(err);
		} else {
			res.render('index', {players: players});
		}
	});
});

// NEW ROUTE
app.get('/roster/new', function(req, res) {
	res.render('new');
});

// CREATE ROUTE
app.post('/roster', function(req, res) {
	Player.create(req.body.player, function(err, newPlayer) {
		if (err) {
			res.render('/new');
		} else {
			res.redirect('/roster');
		}
	});
});

// SHOW ROUTE
app.get('/roster/:id', function(req, res) {
	Player.findById(req.params.id, function(err, foundPlayer) {
		if(err) {
			res.redirect('/roster');
		} else {
			res.render('playerInfo', {player: foundPlayer});
		}
	});
});

// EDIT ROUTE
app.get('/roster/:id/edit', function(req, res) {
	Player.findById(req.params.id, function(err, foundPlayer) {
		if (err) {
			console.log(err);
		} else {
			res.render('edit', {player: foundPlayer});
		}
	});
});

// UPDATE ROUTE
app.put('/roster/:id', function(req, res) {
	Player.findByIdAndUpdate(req.params.id, req.body.player, function(err, updatePlayer) {
		if(err) {
			res.redirect('/roster');
		} else {
			res.redirect('/roster/' + req.params.id);
		}
	})
});

// LISTEN
app.listen(3000, function() {
	console.log('Roster server has started.');
});