//      http://localhost:9001



const bodyParser = require('body-parser')
const express = require('express')
const logger = require('morgan')
const app = express()
const {
  fallbackHandler,
  notFoundHandler,
  genericErrorHandler,
  poweredByHandler
} = require('./handlers.js')
const u = 'up'
const d = 'down'
const r = 'right'
const l = 'left'
var m = r
var job = 'x'
var bx = 11
var by = 11
var segs
var wx
var wy
var nu = false
var nd = false
var nl = false
var nr = false
//var segs = [][]
//var food = [][]


// For deployment to Heroku, the port needs to be set using ENV, so
// we check for the port number in process.env
app.set('port', (process.env.PORT || 9001))

app.enable('verbose errors')

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(poweredByHandler)

// --- SNAKE LOGIC GOES BELOW THIS LINE ---

// Handle POST request to '/start'
app.post('/start', (request, response) => {
  // NOTE: Do something here to start the game

  // Response data
  const data = {
    color: '#000000',
  }

  return response.json(data)
})

// Handle POST request to '/move'
app.post('/move', (request, response) => {
  // NOTE: Do something here to generate your move
  // ------------------------------------------------
	//b = request.body.board
	nu = false
	nd = false
	nl = false
	nr = false
	
	var sx = 0
	var sy = 0
	
	bx = request.body.board.width
	by = request.body.board.height
	
	segs = new Array(by);
	for (var i = 0; i < segs.length; i++) {
	  segs[i] = new Array(bx);
		for (var j=0; j<bx; j++){
			segs[i][j] = 0;
		}
	}
	
	numS = request.body.board.snakes.length
	numF = request.body.board.food.length
	
	for (var i=0; i<numS; i++) {
		slen = request.body.board.snakes[i].body.length
		for (var seg=0; seg<slen; seg++){
			sx = request.body.board.snakes[i].body[seg].x;
		  sy = request.body.board.snakes[i].body[seg].y;
			segs[sy][sx] = 1
		}
	}
	for (var i=0; i<numF; i++) {
		fx = request.body.board.food[i].x;
		fy = request.body.board.food[i].y;
		segs[fy][fx] = 2
	}
	
	
	wx = request.body.you.body[0].x
	wy = request.body.you.body[0].y
	
	if (wx == 0) {
		nl = true
	}
	if (wx == bx-1) {
		nr = true
	}
	if (wy == 0) {
		nu = true
	}
	if (wy == by-1) {
		nd = true
	}
	//test = request.body.board.snakes[0].body[0]
	
	
	
	
	console.log(wx)
	
	
	
	
	
	
	
	// ------------------------------------------------
	
  // Response data
  const data = {
    move: m, // one of: ['up','down','left','right']
  }
  
  return response.json(data)
})

app.post('/end', (request, response) => {
  // NOTE: Any cleanup when a game is complete.
	//print(response)
	//console.log(segs)
  return response.json({})
})

app.post('/ping', (request, response) => {
  // Used for checking if this snake is still alive.
  return response.json({});
})

// --- SNAKE LOGIC GOES ABOVE THIS LINE ---

app.use('*', fallbackHandler)
app.use(notFoundHandler)
app.use(genericErrorHandler)

app.listen(app.get('port'), () => {
  console.log('Server listening on port %s', app.get('port'))
})
