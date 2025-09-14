import { cards, cardData, Card, CardId } from '../data/gameObjects.js';
import { updateCardType, restartValues } from './handScoring.js';
import { jokers } from '../data/jokerData.js';

export {removeCardObject, selectCard, deselectCard}

function selectCard(object: HTMLElement) {
  if (!object) return 0;

  object.classList.add('pickedCards');

  cards.hand.inactive = cards.hand.inactive.filter(card => card.DOMObject !== object);

  const newActiveCard: CardId = {
    DOMObject: object as HTMLElement
  }

  cards.hand.active.push(newActiveCard);

  updateCardType();
}

function deselectCard(object: HTMLElement) {
  if (!object) return 0;

  object.classList.remove('pickedCards');

  cards.hand.active = cards.hand.active.filter(card => card.DOMObject !== object);

  const newInactiveCard: CardId = {
    DOMObject: object as HTMLElement
  };

  cards.hand.inactive.push(newInactiveCard);

  updateCardType();
}

export function createCardObject(object: any, suitNumber: number, numeralNumber: number) {
  const enhancement: number = cardData.modifiers.chosenModifiersArr[0];
  const seal: number = cardData.modifiers.chosenModifiersArr[1];
  const edition: number = cardData.modifiers.chosenModifiersArr[2];

  const newCard: Card = {
    DOMObject: object as HTMLElement,
    order: cards.hand.inactive.length as number,
    number: numeralNumber as number,
    suit: suitNumber as number,
    modifiers: [enhancement, seal, edition] as number[]
  };

  const newInactiveCard: CardId = {
    DOMObject: object as HTMLElement
  };

  cards.hand.all.push(newCard);
  cards.hand.inactive.push(newInactiveCard);

}

export function onCardChange(){
    sortAllCards();
    setMarginOfCards()
    updateCardType();
}

function removeCardObject(object: HTMLElement) {
  const currentObject = cards.hand.all.find(card => card.DOMObject === object);

  if (!currentObject) return 0;

  const objectPath: Card[] = cards.hand.all;
  var order: number = currentObject.order;

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
  var allCards: Card[] = cards.hand.all;



  const sortedCards = [...allCards].sort((a, b) => {
    const valA: number = cardData.sortNumber[a.number];
    const valB: number = cardData.sortNumber[b.number];

    if (valA !== valB) return valB - valA;

    const suitA: number = cardData.sortSuit[a.suit];
    const suitB: number = cardData.sortSuit[b.suit];

    return suitA - suitB;
  });

  const parent = allCards[0]?.DOMObject?.parentElement;
  if (!parent) return;


  sortedCards.forEach(card => {
    if (card.DOMObject) parent.appendChild(card.DOMObject);
  });

  sortedCards.forEach((card, index) => {
    card.order = index;
  });
  return sortedCards;

}

function setMarginOfCards() {
  const cardWidth = document.body.clientHeight * (cardData.cardWidthInVh / 100);
  
  const children: NodeListOf<HTMLElement> = document.querySelectorAll("#currentCardsSection > *");
  const parentObject: HTMLElement | null = document.getElementById("currentCardsSection");
  if (!children || !parentObject) return "bozo";

  const marginOfChildren = (parentObject.clientWidth - ((children.length + 1) * cardWidth)) / children.length;
  const finalMargin = marginOfChildren <= -0.1 ? marginOfChildren : -0.1;


  children.forEach(child => {
    child.style.marginLeft = `${finalMargin}px`;

  });
}





