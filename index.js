//      http://localhost:9001

//https://wyrmhol2.herokuapp.com/

// "request.body"


// localhost:3010 in browser
// http://localhost:9001/ in "add snake"

/*
{ game: { id: 'ed3088b6-2860-4365-ae67-52538e55af65' },
  turn: 99,
  board:
   { height: 15,
     width: 15,
     food:
      [ [Object],
        [Object],
        [Object],
        [Object],
        [Object],
        [Object],
        [Object],
        [Object],
        [Object],
        [Object] ],
     snakes: [ [Object] ] },
  you:
   { id: '60f13cc4-c3b4-4b8a-a78b-64c410e02d73',
     name: 'oscar',
     health: 1,
     body: [ [Object], [Object], [Object] ] } }

*/

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
//var bx = 11
//var by = 11
var Board
var BoardCopy
var wx
var wy
var nu = false
var nd = false
var nl = false
var nr = false
var last = u
var rndm = 0
var distance
var do_nothing = 0
// var dist
var closestfx
var closestfy
var manhattan
//var segs = [][]
//var food = [][]

function printboard(board) {
	var boardstr = ""
	//console.log("-----------------------------");
	for (var i = 0; i < board.length; i++) {
		for (var j = 0; j < board[i].length; j++){
			boardstr += board[i][j]+" ";
		}
		boardstr += "\n";
	}
	console.log(boardstr)
}

// print from string
function print_board(boardstring, width, height) {
	var boardstr = ""
	for (var j = 0; j < height; j++){
		boardstr += boardstring.substr(j*width, width-1) + "\n"
	}
	console.log(boardstr)
}

// use BEFORE dfs. Takes in 2d array (board)
function board_string(board, x, y) {
	var boardstr = ""
	for (var i = 0; i < board.length; i++) {
		for (var j = 0; j < board[i].length; j++){
			boardstr += board[i][j];
		}
		boardstr += "\n";
	}
	return boardstr;
}

function replaceAt(string, index, replacement) {
    return string.substr(0, index) + replacement + string.substr(index + replacement.length);
}

function count(string, width, height){
	return true;
}

// use inside dfs
function board_string_edit(boardstring, width, x, y, new_symbol="") {
	var boardstr = ""
	
	for (var i = 0; i < boardstring.length; i++) {
		
		for (var j = 0; j < boardstring.length; j++){
				boardstr += board[i][j];
		}
		
	}
	return boardstr;
}



//if (i == y && j == x) {

function arrayClone( arr ) {
    var i, copy;
    if( Array.isArray( arr ) ) {
        copy = arr.slice( 0 );
        for( i = 0; i < copy.length; i++ ) {
            copy[ i ] = arrayClone( copy[ i ] );
        }
        return copy;
    } else if( typeof arr === 'object' ) {
        throw 'Cannot clone array containing an object!';
    } else {
        return arr;
    }
}

// string versions of below functions
function safe_up(board, sx, sy){
	return (sy-1 >= 0 && (board[sy-1][sx] == '.' || board[sy-1][sx] == 'O' || board[sy-1][sx] == 'o'));
}
function safe_left(board, sx, sy){
	return (sx-1 >= 0 && (board[sy][sx-1] == '.' || board[sy][sx-1] == 'O' || board[sy][sx-1] == 'o'));
}
function safe_down(board, sx, sy){
	return (sy+1 < board.length && (board[sy+1][sx] == '.' || board[sy+1][sx] == 'O' || board[sy+1][sx] == 'o'));
}
function safe_right(board, sx, sy){
	return (sx+1 < board[0].length && (board[sy][sx+1] == '.' || board[sy][sx+1] == 'O' || board[sy][sx+1] == 'o'));
}



/* needs some work
*/
function dfs(board, sx, sy, m, depth) {
	if (depth == 0) {
		return true;
	}
	board_string
	// use board strings instead of 2d arrays.
	// change string version of board[sx][sy] to '#';
	if (m == 'up' && safe_up(board, sx, sy)) {
		return (dfs(board, sx, sy-1, 'up', depth-1))
	} 
	if (m == 'left' && safe_left(board, sx, sy)) {
		return (dfs(board, sx-1, sy, 'left', depth-1))
	}
	if (m == 'down' && safe_down(board, sx, sy)) {
		return (dfs(board, sx, sy+1, 'down', depth-1))
	}
	if (m == 'right' && safe_right(board, sx, sy)) {
		return (dfs(board, sx+1, sy, 'right', depth-1))
	}
	return false;
}


/*
function random_queue() {
	q = Math.floor(Math.random() * );
	if (q)
}
*/

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
    color: '#666333',
  }

  return response.json(data)
})

// Handle POST request to '/move'
app.post('/move', (request, response) => {
  // NOTE: Do something here to generate your move
  // ------------------------------------------------
	//b = request.body.board
	 
	//console.log(bx)
	/*
			need a plan
	- starting direction, check surroundings first
	- check priorities: food? attack? avoid?
	- algorithm
	
	
	A* algorithm + chicken snake for safety
	Best first search -
		go in the direction of the best node?
	
	chicken snake:
		odd number of segments means having a gap in the loop.
		Maybe alternate between chicken strategy and others?
		
	new strategy: running around the food?
	
	
	"probabilities" for areas
	- where all the heads are (area is probaby safe if the head isn't there)
	- and how long it takes for each snake to get the nearest food: only grab ones they wont be able to
	
	Attack strategies:
		- trap smaller snakes: in the corner, make a
	*/
	
	// food = *
	// 
	// 
	nu = false;
	nd = false;
	nl = false;
	nr = false;
	
	var sx = 0;
	var sy = 0;
	
	// BOARD - width and height
	bwidth = request.body.board.width;
	bheight = request.body.board.height;
	Board = new Array(bheight);
	for (var i = 0; i < Board.length; i++) {
	  Board[i] = new Array(bwidth);
		for (var j=0; j<bwidth; j++){
			Board[i][j] = ".";
		}
	}
	
	
	// number of SNAKES left, and their positions
	numS = request.body.board.snakes.length;
	for (var i=0; i<numS; i++) {
		slen = request.body.board.snakes[i].body.length;
		for (var seg=0; seg<slen; seg++){
			sx = request.body.board.snakes[i].body[seg].x;
		  sy = request.body.board.snakes[i].body[seg].y;
			if (seg == 0) {
				if (i == 0) {
					Board[sy][sx] = "W";
				} else {
					Board[sy][sx] = i;
				}
			} else {
				Board[sy][sx] = "#";
			}
		}
		
	}
	
	// Location of Wyrmhol
	wx = request.body.you.body[0].x;
	wy = request.body.you.body[0].y;
	
	
	distance = 100;
	// number FOOD left, and their positions.
	// finds closest one based on manhattan distance
	numF = request.body.board.food.length;
	for (var i=0; i<numF; i++) {
		fx = request.body.board.food[i].x;
		fy = request.body.board.food[i].y;
		Board[fy][fx] = "o";
		manhattan = Math.abs(fx - wx) + Math.abs(fy - wy)
		if (manhattan <= distance) {
			closestfx = fx;
			closestfy = fy;
			distance = manhattan;
		}
	}
	
	Board[closestfy][closestfx] = "O";
	
	
	
	if (Math.abs(closestfx - wx) > Math.abs(closestfy - wy)) { // horizontal
		if ((closestfx - wx) < 0) { // left
			if (safe_left(Board, wx, wy)) {
				m = 'left';
			}
		} else if ((closestfx - wx) > 0) { // right
			if (safe_right(Board, wx, wy)) {
				m = 'right';
			}
		} else { //neither, on same column
			if ((closestfy - wy) < 0) { // up
				if (safe_up(Board, wx, wy)) {
					m = 'up';
				}
			} else if ((closestfy - wy) > 0) { // down
				if (safe_down(Board, wx, wy)) {
					m = 'down';
				}
			}
		}
	} else if (Math.abs(closestfx - wx) <= Math.abs(closestfy - wy)) { // vertical
		if ((closestfy - wy) < 0) { // up
			if (safe_up(Board, wx, wy)) {
				m = 'up';
			}
		} else if ((closestfy - wy) > 0) { // down
			if (safe_down(Board, wx, wy)) {
				m = 'down';
			}
		} else { // neither, on same row
			if ((closestfx - wx) < 0) { // left
				if (safe_left(Board, wx, wy)) {
					m = 'left';
				}
			} else if ((closestfx - wx) > 0) { // right
				if (safe_right(Board, wx, wy)) {
					m = 'right';
				}
			}
		}
	}
	
	// avoid walls
	if (m == 'up' && !safe_up(Board, wx, wy)) {
		if (safe_left(Board, wx, wy)) {
			m = 'left'
		} else if (safe_right(Board, wx, wy)) {
			m = 'right'
		} else if (safe_down(Board, wx, wy)) {
			m = 'down'
		}
	}
	if (m == 'left' && !safe_left(Board, wx, wy)) {
		if (safe_up(Board, wx, wy)) {
			m = 'up'
		} else if (safe_down(Board, wx, wy)) {
			m = 'down'
		} else if (safe_right(Board, wx, wy)) {
			m = 'right'
		}
	}
	if (m == 'down' && !safe_down(Board, wx, wy)) {
		if (safe_left(Board, wx, wy)) {
			m = 'left'
		} else if (safe_right(Board, wx, wy)) {
			m = 'right'
		} else if (safe_up(Board, wx, wy)) {
			m = 'up'
		}
	}
	if (m == 'right' && !safe_right(Board, wx, wy)) {
		if (safe_up(Board, wx, wy)) {
			m = 'up'
		} else if (safe_down(Board, wx, wy)) {
			m = 'down'
		} else if (safe_left(Board, wx, wy)) {
			m = 'left'
		}
	}
	
	// avoid traps by doing a depth-first search. 
	// if it exceeds own length, then it is safe to go that direction
	// use a temporary board to be able to modify it inside the dfs
	BoardCopy = arrayClone(Board);
	depth = request.body.you.body.length;
	if (!dfs(BoardCopy, wx, wy, m, depth)) {
		console.log("!!!!");
	}
	
	/*
	if (m == 'up') {
		do_nothing = dfs(BoardCopy, wx, wy, m, depth) // (Board, x, y, count). recursive
	}
	BoardCopy = arrayClone(Board);
	if (m == 'left') {
		do_nothing = dfs(BoardCopy, wx, wy, m, depth)
	}
	BoardCopy = arrayClone(Board);
	if (m == 'down') {
		do_nothing = dfs(BoardCopy, wx, wy, m, depth)
	}
	BoardCopy = arrayClone(Board);
	if (m == 'right') {
		do_nothing = dfs(BoardCopy, wx, wy, m, depth)
	}
	*/
	
	last = m;
	
	
	var picked = false;

	printboard(Board);
	//printboard(BoardCopy);
	//console.log(BoardCopy);
	// ------------------------------------------------
	
  // Response data
  const data = {
    move: m, // one of: ['up','down','left','right']
  }
	last = m
  // console.log(request.body)
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
