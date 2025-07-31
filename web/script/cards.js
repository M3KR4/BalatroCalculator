import { urls, cards, cardData } from '../data/gameObjects.js';
import { updateCardType } from './handScoring.js';
const numerals = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const suits = ['hearts', 'clubs', 'diamonds', 'spades'];
var highContrast = true;
const cardWidth = 69; //I love magic numbers <3
if (typeof document !== "undefined") {
    var cardSelectionButtons = document.getElementsByClassName("cardSelectionButtons");
    var prevClickedButton = document.getElementById("cardsButton");
    var activeCardsSection = document.getElementById("currentCardsSection");
    setUpButtonUI();
    setUpCards();
    setUpModifiers();
}
// Makes buttons do button stuff (adding a border to the last clicked button)
function setUpButtonUI() {
    for (let i = 0; i < cardSelectionButtons.length; i++) {
        cardSelectionButtons[i].addEventListener("click", function (e) {
            const buttonId = cardSelectionButtons[i].id;
            const button = document.getElementById(buttonId);
            const sections = document.getElementsByClassName("editCardsSections");
            if (!button)
                return;
            if (!prevClickedButton)
                return;
            if (prevClickedButton === button)
                return;
            if (!sections)
                return;
            if (!sections[i].className.includes("selectedSection")) {
                for (let j = 0; j < sections.length; j++) {
                    if (!sections[j].className.includes("selectedSection"))
                        continue;
                    sections[j].classList.remove("selectedSection");
                }
            }
            sections[i].classList.add("selectedSection");
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
    var contrast;
    if (highContrast) {
        contrast = "highContrast";
    }
    else {
        contrast = "lowContrast";
    }
    var url = 0;
    let i = 0;
    const enhancementIndex = cardData.modifiers.chosenModifiersArr[0];
    var backgroundUrl;
    if (enhancementIndex === -1) {
        backgroundUrl = 'url("../images/cards/background/cardBackground.png")';
    }
    else {
        backgroundUrl = `url("../images/modifiers/enhancements/${cardData.modifiers.all.enhancements[enhancementIndex].name}.png")`;
        if (!backgroundUrl)
            return;
    }
    // Goes through every suit and numeral to add the cards
    cardsUI.forEach(element => {
        const currentSuit = i;
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
        for (let j = 0; j < numerals.length; j++) {
            if (!element)
                return 0;
            const currentNumeral = j;
            const div = document.createElement("div");
            const sealIndex = cardData.modifiers.chosenModifiersArr[1];
            const editionIndex = cardData.modifiers.chosenModifiersArr[2];
            const numeralUrl = `url(${urls.cardNumerals}/${contrast}/${suits[currentSuit]}/${numerals[currentNumeral]}.png)`;
            if (sealIndex !== -1) {
                const seal = document.createElement("div");
                const sealName = cardData.modifiers.all.seals[sealIndex].name;
                const sealUrl = `url("../images/modifiers/seals/${sealName}.png")`;
                seal.classList.add("seals");
                seal.style.backgroundImage = `${sealUrl}`;
                div.appendChild(seal);
            }
            if (editionIndex !== -1) {
                const edition = document.createElement("div");
                const editionName = cardData.modifiers.all.editions[editionIndex].name;
                const editionUrl = `url("../images/modifiers/editions/${editionName}.png")`;
                edition.classList.add("editions");
                edition.style.backgroundImage = `${editionUrl}`;
                div.appendChild(edition);
            }
            div.style.backgroundImage = `${numeralUrl}, ${backgroundUrl}`;
            div.addEventListener('click', function () {
                addCard(currentSuit, currentNumeral);
            });
            div.addEventListener('contextmenu', (e) => { e.preventDefault(); });
            element.appendChild(div);
        }
        i++;
    });
}
function setUpModifiers() {
    const enhancementSelect = document.getElementById("enhancedSelect");
    const sealSelect = document.getElementById("sealSelect");
    const editionSelect = document.getElementById("editionSelect");
    const cardBackground = urls.baseCardBackground;
    const selectDOMObjects = [enhancementSelect, sealSelect, editionSelect];
    const modifierUrl = urls.modifiers;
    if (!enhancementSelect || !sealSelect || !editionSelect)
        return 0;
    const modifierKeys = Object.keys(cardData.modifiers.all);
    for (let i = 0; i < modifierKeys.length; i++) {
        const key = modifierKeys[i];
        const modifierList = cardData.modifiers.all[key];
        const currentSelectedDOMObject = selectDOMObjects[i];
        if (!currentSelectedDOMObject || !modifierList)
            continue;
        for (let j = 0; j < modifierList.length; j++) {
            //Creates the modifier DOM object
            const div = document.createElement("div");
            const backgroundUrl = `${modifierUrl}/${key}/${modifierList[j].name}.png`;
            if (!backgroundUrl)
                continue;
            div.classList.add("modifierIcon");
            div.style.backgroundImage = `url(${backgroundUrl}), url(${cardBackground})`;
            div.addEventListener("click", (e) => {
                //One can be chosen at once from each category of modifiers
                const target = e.currentTarget;
                const modifierKeys = Object.keys(cardData.lastSelectedModifiersDOM);
                const key = modifierKeys[i];
                const lastChosenModifierDOM = cardData.lastSelectedModifiersDOM[key];
                if (lastChosenModifierDOM !== target) {
                    if (lastChosenModifierDOM) {
                        lastChosenModifierDOM.classList.remove("chosenModifier");
                    }
                    target.classList.add("chosenModifier");
                    cardData.lastSelectedModifiersDOM[key] = target;
                    cardData.modifiers.chosenModifiersArr[i] = j; // Changes the modifier to a new one (j is index of set new modifier)
                }
                else {
                    target.classList.remove("chosenModifier");
                    cardData.lastSelectedModifiersDOM[key] = null;
                    cardData.modifiers.chosenModifiersArr[i] = -1;
                }
                setUpCards();
            });
            currentSelectedDOMObject.appendChild(div);
        }
    }
}
// Creates a card in the active card area
function addCard(suit, numeral) {
    if (!activeCardsSection)
        return 0;
    if (!document)
        return 0;
    var contrast;
    if (highContrast) {
        contrast = "highContrast";
    }
    else {
        contrast = "lowContrast";
    }
    const div = document.createElement("div");
    var backgroundImageUrl;
    var numeralUrl;
    const enhancementIndex = cardData.modifiers.chosenModifiersArr[0];
    const sealIndex = cardData.modifiers.chosenModifiersArr[1];
    const editionIndex = cardData.modifiers.chosenModifiersArr[2];
    if (enhancementIndex !== -1) {
        const enhancementName = cardData.modifiers.all.enhancements[enhancementIndex].name;
        if (!enhancementName)
            return;
        backgroundImageUrl = `url("../images/modifiers/enhancements/${enhancementName}.png")`;
    }
    else {
        backgroundImageUrl = `url("../images/cards/background/cardBackground.png")`;
    }
    numeralUrl = `url("${urls.cardNumerals}/${contrast}/${suits[suit]}/${numerals[numeral]}.png")`;
    if (sealIndex !== -1) {
        const seal = document.createElement("div");
        const sealName = cardData.modifiers.all.seals[sealIndex].name;
        if (!sealName)
            return;
        const sealUrl = `url("../images/modifiers/seals/${sealName}.png")`;
        seal.classList.add("seals");
        seal.style.backgroundImage = sealUrl;
        div.appendChild(seal);
    }
    if (editionIndex !== -1) {
        const edition = document.createElement("div");
        const editionName = cardData.modifiers.all.editions[editionIndex].name;
        if (!editionName)
            return;
        const editionUrl = `url("../images/modifiers/editions/${editionName}.png")`;
        edition.classList.add("editions");
        edition.style.backgroundImage = `${editionUrl}`;
        div.appendChild(edition);
    }
    div.style.backgroundImage = `${numeralUrl}, ${backgroundImageUrl}`;
    div.addEventListener('click', function (e) {
        const limitExceeded = cards.hand.active.length >= 5;
        if (!div.className.includes('pickedCards') && !limitExceeded) {
            selectCard(div);
        }
        else if (div.className.includes('pickedCards')) {
            deselectCard(div);
        }
        else {
            return;
        }
        return;
    });
    div.addEventListener('contextmenu', function (e) {
        e.preventDefault();
        div.remove();
        removeCardObject(div);
    });
    activeCardsSection.appendChild(div);
    createCardObject(div, suit, numeral);
    sortAllCards();
    if (div.clientWidth < cardWidth) {
        var children = document.querySelectorAll("#currentCardsSection > *");
        if (!children)
            return "bozo";
        children.forEach(child => {
            child.classList.add("crampedCards");
        });
    }
    updateCardType();
    return "added card";
}
function selectCard(object) {
    if (!object)
        return 0;
    object.classList.add('pickedCards');
    cards.hand.inactive = cards.hand.inactive.filter(card => card.DOMObject !== object);
    const newActiveCard = {
        DOMObject: object
    };
    cards.hand.active.push(newActiveCard);
    updateCardType();
}
function deselectCard(object) {
    if (!object)
        return 0;
    object.classList.remove('pickedCards');
    cards.hand.active = cards.hand.active.filter(card => card.DOMObject !== object);
    const newInactiveCard = {
        DOMObject: object
    };
    cards.hand.inactive.push(newInactiveCard);
    updateCardType();
}
function createCardObject(object, suitNumber, numeralNumber) {
    const enhancement = cardData.modifiers.chosenModifiersArr[0];
    const seal = cardData.modifiers.chosenModifiersArr[1];
    const edition = cardData.modifiers.chosenModifiersArr[2];
    const newCard = {
        DOMObject: object,
        order: cards.hand.inactive.length,
        number: numeralNumber,
        suit: suitNumber,
        modifiers: [enhancement, seal, edition]
    };
    const newInactiveCard = {
        DOMObject: object
    };
    cards.hand.all.push(newCard);
    cards.hand.inactive.push(newInactiveCard);
}
function removeCardObject(object) {
    const currentObject = cards.hand.all.find(card => card.DOMObject === object);
    if (!currentObject)
        return 0;
    var order;
    const objectPath = cards.hand.all;
    order = currentObject.order;
    cards.hand.inactive = cards.hand.inactive.filter(card => card.DOMObject !== object);
    cards.hand.active = cards.hand.active.filter(card => card.DOMObject !== object);
    for (let i = 0; i < cards.hand.inactive.length; i++) {
        if (cards.hand.all[i].order > order) {
            cards.hand.all[i].order--;
        }
    }
    cards.hand.all = objectPath.filter(card => card.DOMObject !== object);
    updateCardType();
    return 0;
}
export function sortAllCards() {
    var _a, _b;
    var allCards = cards.hand.all;
    const sortedCards = [...allCards].sort((a, b) => {
        const valA = cardData.sortNumber[a.number];
        const valB = cardData.sortNumber[b.number];
        if (valA !== valB)
            return valB - valA;
        const suitA = cardData.sortSuit[a.suit];
        const suitB = cardData.sortSuit[b.suit];
        return suitA - suitB;
    });
    const parent = (_b = (_a = allCards[0]) === null || _a === void 0 ? void 0 : _a.DOMObject) === null || _b === void 0 ? void 0 : _b.parentElement;
    if (!parent)
        return;
    sortedCards.forEach(card => {
        if (card.DOMObject)
            parent.appendChild(card.DOMObject);
    });
    sortedCards.forEach((card, index) => {
        card.order = index;
    });
    return sortedCards;
}
