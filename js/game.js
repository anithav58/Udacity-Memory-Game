let game = memoryGame();
let arrayStack = []; //to track the previous and current element

document.addEventListener('DOMContentLoaded', function() {
	game.generateMemoryBoard();
	game.startTimer();
	document.querySelector('.restart').addEventListener('click', game.restartGame);
});

function toggleCard(event) {
	let currentElement = event.currentTarget;
	let currentClassList = currentElement.classList;
	if (currentClassList.contains('open')) {
		if (arrayStack[0] != arrayStack[1]) currentClassList.remove('open');
	} else {
		currentClassList.add('open');
		if (!arrayStack.includes(currentElement)) {
			arrayStack.push(currentElement);
		}
		if (arrayStack.length > 1) {
			game.updateMoveCount();
			if (isMatch()) {
				if (document.querySelectorAll('.card.open').length === game.getCardNames().length) {
					document.querySelector('.winning-message').classList.remove('hide');
					document.querySelector('.main-container').classList.add('hide');
					let stars = document.querySelectorAll('.fa-star').length;
					document.querySelector(
						'.result-message'
					).textContent = `In ${game.getTimer()} seconds with ${game.getMoves()} Moves and ${stars} star rating`;
					document.querySelector('.start-game').addEventListener('click', function() {
						document.querySelector('.winning-message').classList.add('hide');
						document.querySelector('.main-container').classList.remove('hide');
						game.restartGame();
					});
				}
			} else {
				nomatch();
				arrayStack = [];
			}
		}
	}
	game.updateStarRating();
}

function isMatch() {
	if (arrayStack[0].querySelector('.fa').className === arrayStack[1].querySelector('.fa').className) {
		arrayStack[0].classList.add('match');
		arrayStack[1].classList.add('match');
		arrayStack = [];
		return true;
	} else {
		return false;
	}
}

function nomatch() {
	arrayStack[0].classList.add('nomatch');
	arrayStack[1].classList.add('nomatch');
	let tempArray = arrayStack; //use tempArray because the functions that follow get executed before this is done.
	setTimeout(function() {
		tempArray[0].classList.remove('nomatch');
		tempArray[1].classList.remove('nomatch');
		tempArray[0].classList.remove('open');
		tempArray[1].classList.remove('open');
		tempArray = [];
	}, 500);
}

function memoryGame() {
	let moves = 0;
	let validClassNames = [
		'fa-diamond',
		'fa-paper-plane-o',
		'fa-anchor',
		'fa-bolt',
		'fa-cube',
		'fa-leaf',
		'fa-bicycle',
		'fa-bomb',
	];
	let cardNames = [...validClassNames, ...validClassNames];
	let gameTime = 0;
	let timer;
	return {
		getCardNames: function() {
			return cardNames;
		},
		getMoves: function() {
			return moves;
		},
		getTimer: function() {
			return gameTime;
		},
		updateMoveCount: function() {
			moves++;
			let ele = document.querySelector('.moves');

			ele.textContent = `${moves} ${moves === 1 ? 'Move' : 'Moves'}`;
		},
		updateStarRating: function() {
			if (moves >= 10 && moves < 16) {
				document.querySelector('.stars .rating-three').classList.toggle('fa-star', false);
				document.querySelector('.stars .rating-three').classList.toggle('fa-star-o', true);
			} else if (moves >= 16 && moves <= 30) {
				document.querySelector('.stars .rating-two').classList.toggle('fa-star', false);
				document.querySelector('.stars .rating-two').classList.toggle('fa-star-o', true);
			}
		},
		//reset moves, star rating, reset cards in the deck, re-shuffle the deck of cards, clear and start timer
		restartGame: function() {
			moves = 0;
			arrayStack = [];
			document.querySelector('.moves').textContent = '0 Moves';
			document.querySelector('.stars .rating-three').classList.toggle('fa-star', true);
			document.querySelector('.stars .rating-three').classList.toggle('fa-star-o', false);
			document.querySelector('.stars .rating-two').classList.toggle('fa-star', true);
			document.querySelector('.stars .rating-two').classList.toggle('fa-star-o', false);
			document.querySelectorAll('.card').forEach(x => {
				x.classList.remove(...['open', 'match', 'nomatch']);
			});
			game.generateMemoryBoard();
			gameTime = 0;
			document.querySelector('.timer').textContent = `0 s`;
			clearInterval(timer);
			game.startTimer();
		},
		//shuffle the cards radomly
		generateMemoryBoard: function() {
			let parentElement = document.querySelector('.deck');
			let length = parentElement.children.length;
			if (length === 0) {
				game.createMemoryBoard();
				length = parentElement.children.length;
			}
			for (let i = length; i >= 0; i--) {
				parentElement.appendChild(parentElement.children[(Math.random() * i) | 0]);
			}
		},
		//create the deck of cards, add event listeners, and append to the DOM
		createMemoryBoard: function() {
			let fragment = document.createDocumentFragment();
			for (let i = 0; i < cardNames.length; i++) {
				const listElement = document.createElement('li');
				listElement.classList.add('card');
				const childElement = document.createElement('i');
				childElement.classList.add('fa', cardNames[i]);
				listElement.appendChild(childElement);
				listElement.addEventListener('click', toggleCard);
				fragment.appendChild(listElement);
			}
			let parentElement = document.querySelector('.deck');
			parentElement.appendChild(fragment);
		},
		startTimer: function() {
			timer = setInterval(function() {
				gameTime++;

				document.querySelector('.timer').textContent = `${gameTime} s`;
			}, 1000);
		},
	};
}
