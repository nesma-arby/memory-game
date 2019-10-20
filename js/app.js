/*
 * Display the cards on the page
 *   -1 shuffle the list of cards using the provided "shuffle" method below
 *   -2 loop through each card and create its HTML
 *   -3 add each card's HTML to the page
 */

// variable declaration
let openCards, moveCounter, element, matchedCards, timeCounter, interval;

const list = document.querySelector('.deck');
const fragment = document.createDocumentFragment();

const icons = ['fa-diamond', 'fa-paper-plane-o', 'fa-anchor', 'fa-bolt', 'fa-cube', 'fa-leaf', 'fa-bicycle', 'fa-bomb',
    'fa-diamond', 'fa-paper-plane-o', 'fa-anchor', 'fa-bolt', 'fa-cube', 'fa-leaf', 'fa-bicycle', 'fa-bomb'
];

shuffle(icons);

for (let i = 0; i < 16; i++) {
    const card = document.createElement('li');
    card.setAttribute('class', 'card');
    const icon = document.createElement('i');
    icon.setAttribute('class', 'fa ' + icons[i]);
    card.appendChild(icon);
    fragment.appendChild(card);
}
list.appendChild(fragment); // reflow and repaint here -- once!
const allCards = document.querySelectorAll('.card');

init();


document.querySelector('.restart').addEventListener('click', function () {
    init();
    location.reload();
});

document.querySelector('.play-again').addEventListener('click', function () {
    init();
    location.reload();
});


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */


allCards.forEach(function (myCard) {
    myCard.addEventListener('click', flippingCard);
});

function flippingCard(e) {
    // start timer when start gaming
    interval = setInterval(timer, 1000);
    element = e.target;
    // to prevent clicking on i
    if (e.target.nodeName === 'LI') {
        if (!element.classList.contains('open') && !element.classList.contains('show') && !element.classList.contains('match')) {
            element.classList.remove('animated', 'wobble');
            addCard(element);
            checkOpenCards(openCards);
        }
    }
}

function addCard(myElement) {
    myElement.classList.add('open', 'show');
    openCards.push(myElement);
}

function checkOpenCards(openCardsList) {
    if (openCardsList.length === 2) {
        const item1 = openCardsList[0].querySelector('i').classList.item(1);
        const item2 = openCardsList[1].querySelector('i').classList.item(1);
        item1 === item2 ? match(openCardsList) : notMatch(openCardsList);
        moveCounter += 1;
        displayMoveCounter(moveCounter);
    }
}

function match(openCardsList) {
    openCardsList.forEach(function (c) {
        c.classList.add('match', 'animated', 'bounce');
        matchedCards.push(c);

        if (matchedCards.length === 16) {
            setTimeout(function () {
                document.querySelector('.game').style.display = 'none';
                document.querySelector('.end-game').style.display = 'block';
                document.querySelector('.final-moves').textContent = moveCounter;
                document.querySelector('.second').textContent = timeCounter;
                if (moveCounter < 20) {
                    document.querySelector('.remainig-stars').textContent = 3;
                } else if (moveCounter >= 20 && moveCounter < 40) {
                    document.querySelector('.remainig-stars').textContent = 2;
                } else if (moveCounter >= 40) {
                    document.querySelector('.remainig-stars').textContent = 1;
                } else {
                    document.querySelector('.remainig-stars').textContent = 0;
                }
            }, 3000);
        }
    });

    openCards = [];
}

function notMatch(openCardsList) {
    setTimeout(function () {
        openCardsList.forEach(function (c) {
            c.classList.remove('open', 'show');
            c.classList.add('animated', 'wobble');
        });
        openCards = [];
    }, 100);
}

function displayMoveCounter(moveCounter) {
    document.querySelector('.moves').textContent = moveCounter;
    if (moveCounter == 20) {
        const rate = document.querySelector('.fa-star');
        rate.classList.remove('fa-star');
        rate.classList.add('fa-star-o');
    }
}

function shuffle(array) {
    let currentIndex = array.length,
        temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

function init() {
    allCards.forEach(function (card) {
        card.classList.remove('open', 'show', 'match');
    });
    document.querySelector('.end-game').style.display = 'none';
    document.querySelector('.game').style.display = 'block';
    document.querySelector('.moves').textContent = moveCounter;
    openCards = [];
    matchedCards = [];
    moveCounter = 0;
    timeCounter = 0;
}

function timer() {
    if (matchedCards.length == 16) {
        clearInterval(interval);
    } else {
        timeCounter += 1;
        document.querySelector('#seconds').textContent = timeCounter;
    }
}