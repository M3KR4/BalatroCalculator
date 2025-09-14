import { cards, cardData } from '../data/gameObjects.js';
import { updateCardType } from './handScoring.js';
export { removeCardObject, selectCard, deselectCard };
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
export function createCardObject(object, suitNumber, numeralNumber) {
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
export function onCardChange() {
    sortAllCards();
    setMarginOfCards();
    updateCardType();
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
