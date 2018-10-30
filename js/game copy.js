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

document.addEventListener('DOMContentLoaded', function() {
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
});

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
let previousElement = null;
function toggleCard(event) {
	game.updateMoveCount();
	let currentElement = event.currentTarget;
	let currentClassList = currentElement.classList;
	let icons = currentElement.childNodes[0].classList;
	//console.log( icons);

	if (currentClassList.contains('open')) {
		//targetElement.classList.toggle('open',targetElement.classList.contains('open'));
		if (currentElement != previousElement) currentClassList.remove('open');
	} else {
		currentClassList.add('open');
		if (previousElement != null && previousElement.classList.contains('open')) {
			if (isMatch(icons)) {
				//alert('matched');
				currentClassList.add('match');
				previousElement.classList.add('match');
				currentElement.removeEventListener('click', toggleCard);
				previousElement.removeEventListener('click', toggleCard);
				previousElement = null;
			} else {
				setTimeout(function() {
					nomatch(currentElement, previousElement);
				}, 500);
				//previousElement = null;
			}
		} else {
			previousElement = currentElement;
		}
	}
}

function isMatch(ele) {
	let selectElements = document.querySelectorAll(`.open .${[...ele].join('.')}`);
	if (selectElements.length > 1) {
		return true;
	} else {
		return false;
	}
}

function nomatch(curr, prev) {
	//alert('did not match');
	curr.classList.remove('open');
	prev.classList.remove('open');
	previousElement = null;
}

function memoryGame() {
	let moves = 0;

	return {
		updateMoveCount: function() {
			moves++;
			var ele = document.querySelector('.moves');
			ele.textContent = `${moves} Moves`;
		},
	};
}
