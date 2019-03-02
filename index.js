//      http://localhost:9001

//https://wyrmhol2.herokuapp.com/

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
var last = u
var rndm = 0
var closestfx = 100
var closestfy = 100
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
	
	/*
	if (last == 'right') {
		nr = true
	}
	if (last == 'left') {
		nl = true
	}
	if (last == 'up') {
		nu = true
	}
	if (last == 'down') {
		nd = true
	}
	*/
	
	rndm = Math.floor((Math.random() * 3) + 1);
	
	var picked = false
	
	while (!picked) {
		rndm = Math.floor((Math.random() * 4));
		if (rndm == 0 && !nu) {
			if (segs[wy-1][wx] != 1) {
				m = u
				picked = true
			}
		} else if (rndm == 1 && !nr) {
			if (segs[wy][wx+1] != 1) {
				m = r
				picked = true
			}
		} else if (rndm == 2 && !nd) {
			if (segs[wy+1][wx] != 1) {
				m = d
				picked = true
			}
		} else if (rndm == 3 && !nl) {
			if (segs[wy][wx-1] != 1) {
				m = l
				picked = true
			}
		}
	}
	
	
	/*
	for (var y=0; y<by; y++){
		for (var x=0; x<bx; x++){
		  (if segs[x][y] == 2) {
		  	if (Math.abs(wx-x) <= closestfx) {
		  		closestfx = x
		  	}
		  	if (Math.abs(wy-y) <= closestfy) {
		  		closestfy = y
		  	}
		  }
		}
	}
	*/
	
	
	//test = request.body.board.snakes[0].body[0]
	
	
	
	
	//console.log(segs)
	
	
	
	
	
	
	
	// ------------------------------------------------
	
  // Response data
  const data = {
    move: m, // one of: ['up','down','left','right']
  }
	last = m
  console.log(last)
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
