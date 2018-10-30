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
let classNames = [...validClassNames, ...validClassNames];
let game = memoryGame();
let arrayStack = [];

document.addEventListener('DOMContentLoaded', function() {
	createMemoryBoard();
	document.querySelector('.restart').addEventListener('click', game.restartGame);
});

function createMemoryBoard() {
	let classArray = shuffle(classNames);
	let fragment = document.createDocumentFragment();
	for (let i = 0; i < classArray.length; i++) {
		const listElement = document.createElement('li');
		listElement.classList.add('card');
		const childElement = document.createElement('i');
		childElement.classList.add('fa', classArray[i]);
		listElement.appendChild(childElement);
		listElement.addEventListener('click', toggleCard);
		fragment.appendChild(listElement);
	}
	let parentElement = document.querySelector('.deck');
	parentElement.appendChild(fragment);
}

function shuffle(array) {
	var currentIndex = array.length,
		temporaryValue,
		randomIndex;
	while (currentIndex !== 0) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}
	return array;
}

//let previousElement = null;

function toggleCard(event) {
	let currentElement = event.currentTarget;
	let currentClassList = currentElement.classList;
	let icons = currentElement.childNodes[0].classList;
	//console.log( icons);

	if (currentClassList.contains('open')) {
		//targetElement.classList.toggle('open',targetElement.classList.contains('open'));
		if (arrayStack[0] != arrayStack[1]) currentClassList.remove('open');
	} else {
		currentClassList.add('open');
		if (!arrayStack.includes(currentElement)) {
			arrayStack.push(currentElement);
		}
		if (arrayStack.length > 1) {
			//if (previousElement != null && previousElement.classList.contains('open')) {
			if (isMatch()) {
				//alert('matched');
				arrayStack[0].classList.add('match');
				arrayStack[1].classList.add('match');
				// arrayStack[0].removeEventListener('click', toggleCard);
				// arrayStack[1].removeEventListener('click', toggleCard);
				arrayStack = [];
				if (document.querySelectorAll('.card.open').length === 4) {
					document.querySelector('.winning-message').classList.remove('hide');
					document.querySelector('.container').classList.add('hide');
					let stars = document.querySelectorAll('.fa-star:not(.hide)').length;
					document.querySelector(
						'.result-message'
					).textContent = `With ${game.getMoves()} and ${stars} stars`;
					document.querySelector('.start-game').addEventListener('click', function() {
						document.querySelector('.winning-message').classList.add('hide');
						document.querySelector('.container').classList.remove('hide');
						game.restartGame();
					});
				}
			} else {
				nomatch();
			}
		}
		game.updateMoveCount();
	}
	game.updateStarRating();
}

// function isMatch(ele) {
// 	let selectElements = document.querySelectorAll(`.open .${[...ele].join('.')}`);
// 	if (selectElements.length > 1) {
// 		return true;
// 	} else {
// 		return false;
// 	}
// }

function isMatch() {
	if (arrayStack[0].querySelector('.fa').className === arrayStack[1].querySelector('.fa').className) {
		return true;
	} else {
		return false;
	}
}

function nomatch() {
	//alert('did not match');
	arrayStack[0].classList.add('nomatch');
	arrayStack[1].classList.add('nomatch');

	setTimeout(function() {
		arrayStack[0].classList.remove('nomatch');
		arrayStack[1].classList.remove('nomatch');
		arrayStack[0].classList.remove('open');
		arrayStack[1].classList.remove('open');
		arrayStack = [];
	}, 500);
}

function memoryGame() {
	let moves = 0;

	return {
		getMoves: function() {
			return moves;
		},
		updateMoveCount: function() {
			moves++;
			let ele = document.querySelector('.moves');

			ele.textContent = `${moves} ${moves === 1 ? 'Move' : 'Moves'}`;
		},
		updateStarRating: function() {
			if (moves >= 10 && moves < 16) {
				document.querySelector('.stars .rating-three').classList.add('hide');
			} else if (moves >= 16 && moves <= 30) {
				document.querySelector('.stars .rating-two').classList.add('hide');
			}
		},
		restartGame: function() {
			moves = 0;
			document.querySelector('.moves').textContent = '0 Moves';
			document.querySelector('.stars .rating-three').classList.remove('hide');
			document.querySelector('.stars .rating-two').classList.remove('hide');
			document.querySelectorAll('.card').forEach(element => {
				element.removeEventListener('click', toggleCard);
				element.remove();
			});
			createMemoryBoard();
			//shuffle(classNames);
		},
	};
}
