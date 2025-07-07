"use strict";
const jokers = {
    active: {
        amounts: {
            all: 0,
            common: 0,
            uncommon: 0,
            rare: 0
        },
        types: {
            mult: [],
            chip: [],
            xMult: [],
            other: []
        },
    },
    all: {
        types: {
            mult: [],
            chip: [],
            xMult: [],
            other: []
        },
        names: []
    }
};
const numerals = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const suits = ['hearts', 'clubs', 'diamonds', 'spades'];
const urls = ["../images/cards/lowRes", "../images/cards/highRes"];
if (typeof document !== "undefined") {
    var cardSelectionButtons = document.getElementsByClassName("cardSelectionButtons");
    var prevClickedButton = document.getElementById("cardsButton");
    var highContrast = true;
    var activeCardsSection = document.getElementById("currentCardsSection");
    var cardWidth = 69;
    setUpButtonUI();
    setUpCards();
}
// Makes buttons do button stuff (adding a border to the last clicked button)
function setUpButtonUI() {
    for (let i = 0; i < cardSelectionButtons.length; i++) {
        cardSelectionButtons[i].addEventListener("click", function (e) {
            const buttonId = cardSelectionButtons[i].id;
            const button = document.getElementById(buttonId);
            if (!button)
                return;
            if (!prevClickedButton)
                return;
            if (prevClickedButton === button)
                return;
            // Removes the class that gives a button a border and adds it to a newly clicked one
            prevClickedButton.classList.remove("borderedButton");
            button.classList.add("borderedButton");
            prevClickedButton = button;
            return;
        });
    }
}
// Adds cards that you can click on to add them to your active cards
function setUpCards() {
    const cardsUI = document.querySelectorAll(".cardsUI");
    if (!cardsUI)
        return;
    var url = 0;
    let i = 0;
    // Goes through every suit and numeral to add the cards
    cardsUI.forEach(element => {
        const currentSuit = i;
        const currentUrl = url;
        for (let j = 0; j < numerals.length; j++) {
            const currentNumeral = j;
            const div = document.createElement("div");
            div.style.backgroundImage = `url(${urls[currentUrl]}/${suits[currentSuit]}/${numerals[currentNumeral]}.png)`;
            div.addEventListener('click', function () {
                addCard(currentSuit, currentNumeral, currentUrl);
            });
            div.addEventListener('contextmenu', (e) => { e.preventDefault(); });
            if (!element)
                return 0;
            element.appendChild(div);
        }
        i++;
        // Does it again but now for the high resolution, that's why it repeats twice (i'm a very good programmer don't question this)
        if (i >= 4) {
            i = 0;
            url++;
        }
    });
}
// Creates a card in the active card area
function addCard(suit, numeral, url) {
    if (!activeCardsSection)
        return 0;
    if (!document)
        return 0;
    const div = document.createElement("div");
    div.style.backgroundImage = `url('${urls[url]}/${suits[suit]}/${numerals[numeral]}.png')`;
    div.addEventListener('click', function () {
        if (div.className.includes('pickedCards')) {
            deselectCard(div);
        }
        else {
            selectCard(div);
        }
    });
    div.addEventListener('contextmenu', function (e) {
        e.preventDefault();
        div.remove();
    });
    activeCardsSection.appendChild(div);
    if (div.clientWidth < cardWidth) {
        var children = document.querySelectorAll("#currentCardsSection > *");
        if (!children)
            return "bozo";
        children.forEach(child => {
            child.classList.add("crampedCards");
        });
    }
    return "added card";
}
function selectCard(card) {
    if (!card)
        return 0;
    if (!card.parentElement)
        return 0;
    card.classList.add('pickedCards');
}
function deselectCard(card) {
    if (!card)
        return 0;
    card.classList.remove('pickedCards');
}
