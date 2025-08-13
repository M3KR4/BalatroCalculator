import { urls, cards, cardData, cardHeldEvent, documentData } from '../data/gameObjects.js';
import { updateCardType, restartValues } from './handScoring.js';
const numerals = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const suits = ['hearts', 'clubs', 'diamonds', 'spades'];
var highContrast = true;
if (typeof document !== "undefined") {
    var sectionListButtons = document.getElementsByClassName("sectionListButtons");
    var prevClickedButton = document.getElementById("cardsButton");
    var activeCardsSection = document.getElementById("currentCardsSection");
    let mouseTimer;
    document.addEventListener('mousemove', function (e) {
        documentData.mouseIsMoving = true;
        documentData.mousePosition.x = e.pageX;
        documentData.mousePosition.y = e.pageY;
        clearTimeout(mouseTimer);
        mouseTimer = setTimeout(() => {
            documentData.mouseIsMoving = false;
        }, documentData.mouseStopTime);
    });
    setUpButtonUI();
    setUpCards();
    setUpModifiers();
    restartValues();
}
// Makes buttons do button stuff (adding a border to the last clicked button)
function setUpButtonUI() {
    for (let i = 0; i < sectionListButtons.length; i++) {
        sectionListButtons[i].addEventListener("click", function (e) {
            const buttonId = sectionListButtons[i].id;
            const button = document.getElementById(buttonId);
            const sections = document.getElementsByClassName("editGameSections");
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
    const addCardsSuitTypes = document.querySelectorAll(".addCardsSuitTypes");
    if (!addCardsSuitTypes)
        return;
    var contrast;
    if (highContrast) {
        contrast = "highContrast";
    }
    else {
        contrast = "lowContrast";
    }
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
    addCardsSuitTypes.forEach(element => {
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
                const cardCountInput = document.getElementById("cardCount");
                if (!cardCountInput) {
                    console.error("Cannot find 'cardCount' DOM object");
                    return;
                }
                const cardCountNum = Number(cardCountInput.value);
                if (Number.isNaN(cardCountNum) || cardCountNum <= 0) {
                    console.error(`Card count should be a positive number`);
                    return;
                }
                for (let i = 0; i < cardCountNum; i++) {
                    if (i !== cardCountNum - 1) {
                        addCard(currentSuit, currentNumeral, false);
                    }
                    else {
                        addCard(currentSuit, currentNumeral, true);
                    }
                }
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
function addCard(suit, numeral, countCards) {
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
    var div = document.createElement("div");
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
    div = addEventsToCard(div);
    activeCardsSection.appendChild(div);
    createCardObject(div, suit, numeral);
    if (!countCards)
        return;
    sortAllCards();
    setMarginOfCards();
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
    const objectPath = cards.hand.all;
    var order = currentObject.order;
    cards.hand.inactive = cards.hand.inactive.filter(card => card.DOMObject !== object);
    cards.hand.active = cards.hand.active.filter(card => card.DOMObject !== object);
    for (let i = 0; i < cards.hand.inactive.length; i++) {
        if (cards.hand.all[i].order > order) {
            cards.hand.all[i].order--;
        }
    }
    cards.hand.all = objectPath.filter(card => card.DOMObject !== object);
    setMarginOfCards();
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
function setMarginOfCards() {
    const cardWidth = document.body.clientHeight * (cardData.cardWidthInVh / 100);
    const children = document.querySelectorAll("#currentCardsSection > *");
    const parentObject = document.getElementById("currentCardsSection");
    if (!children || !parentObject)
        return "bozo";
    const marginOfChildren = (parentObject.clientWidth - ((children.length + 1) * cardWidth)) / children.length;
    const finalMargin = marginOfChildren <= -0.1 ? marginOfChildren : -0.1;
    children.forEach(child => {
        child.style.marginLeft = `${finalMargin}px`;
    });
}
function moveCard(card, event) {
    const mousePosition = { x: event.clientX, y: event.clientY };
    const documentSize = { width: document.documentElement.clientWidth, height: document.documentElement.clientHeight };
    const cardSize = { width: card.clientWidth, height: card.clientHeight };
    card.style.position = "absolute";
    card.style.zIndex = "1000";
    card.style.right = `${-mousePosition.x + documentSize.width - cardSize.width / 2}px`;
    card.style.top = `${mousePosition.y - cardSize.height / 2}px`;
    const nextSibling = card.nextSibling;
    const previousSibling = card.previousSibling;
    const currCard = cards.hand.all.find(object => object.DOMObject === card);
    var nextCard;
    if (nextSibling && nextSibling.getBoundingClientRect().x < card.getBoundingClientRect().x) {
        nextSibling.after(card);
        nextCard = cards.hand.all.find(object => object.DOMObject === nextSibling);
    }
    if (previousSibling && previousSibling.getBoundingClientRect().x > card.getBoundingClientRect().x) {
        previousSibling.before(card);
        nextCard = cards.hand.all.find(object => object.DOMObject === previousSibling);
    }
    if (nextCard && currCard) {
        const currCardOrder = currCard.order;
        const nextCardOrder = nextCard.order;
        currCard.order = nextCardOrder;
        nextCard.order = currCardOrder;
        updateCardType();
    }
}
function addEventsToCard(card) {
    card = addCardHeldEvent(card);
    card = addCardRemovalEvent(card);
    card = addCardSelectionEvent(card);
    return card;
}
function addCardHeldEvent(div) {
    div.addEventListener('mousedown', function () {
        if (cardHeldEvent.mouseHeldTimer !== null)
            clearTimeout(cardHeldEvent.mouseHeldTimer);
        cardHeldEvent.cardIsHeld = false;
        cardHeldEvent.mouseHeldTimer = setTimeout(() => {
            cardHeldEvent.cardIsHeld = true;
        }, cardHeldEvent.cardHeldTime);
        cardHeldEvent.cardHeldHandler = (e) => {
            if (!cardHeldEvent.cardIsHeld)
                return;
            moveCard(div, e);
        };
        document.addEventListener('mousemove', cardHeldEvent.cardHeldHandler);
        document.addEventListener("mouseup", function (e) {
            if (cardHeldEvent.cardHeldHandler)
                document.removeEventListener('mousemove', cardHeldEvent.cardHeldHandler);
            div.style.position = "static";
            div.style.zIndex = "0";
            div.style.transform = "scale(1.00)";
        });
    });
    return div;
}
function addCardRemovalEvent(div) {
    div.addEventListener('contextmenu', function (e) {
        e.preventDefault();
        div.remove();
        removeCardObject(div);
    });
    return div;
}
function addCardSelectionEvent(div) {
    div.addEventListener('mouseup', function (e) {
        if (e.button !== 0)
            return;
        if (cardHeldEvent.cardIsHeld) {
            cardHeldEvent.cardIsHeld = false;
            return;
        }
        cardHeldEvent.cardIsClicked = true;
        const limitExceeded = cards.hand.active.length >= 5;
        if (!div.className.includes('pickedCards') && !limitExceeded) {
            selectCard(div);
        }
        else if (div.className.includes('pickedCards')) {
            deselectCard(div);
        }
        return;
    });
    return div;
}
