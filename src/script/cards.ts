import { urls, cards, cardData, Card, CardId, cardHeldEvent, documentData } from '../data/gameObjects.js';
import { updateCardType, restartValues } from './handScoring.js';

const numerals: string[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const suits: string[] = ['hearts', 'clubs', 'diamonds', 'spades'];



var highContrast: boolean = true;

if (typeof document !== "undefined") {
  var sectionListButtons: HTMLCollection = document.getElementsByClassName("sectionListButtons");
  var prevClickedButton: HTMLElement | null = document.getElementById("cardsButton");
  var activeCardsSection: HTMLElement | null = document.getElementById("currentCardsSection");

  let mouseTimer: ReturnType<typeof setTimeout>;

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
    sectionListButtons[i]!.addEventListener("click", function (e) {

      const buttonId: string = sectionListButtons[i].id;
      const button: HTMLElement | null = document.getElementById(buttonId);
      const sections: HTMLCollection = document.getElementsByClassName("editGameSections");


      if (!button) return;
      if (!prevClickedButton) return;
      if (prevClickedButton === button) return;
      if (!sections) return;

      if (!sections[i].className.includes("selectedSection")) {
        for (let j = 0; j < sections.length; j++) {
          if (!sections[j].className.includes("selectedSection")) continue;

          sections[j].classList.remove("selectedSection");
        }
      }

      sections[i].classList.add("selectedSection");


      // Removes the class that gives a button a border and adds it to a newly clicked one

      prevClickedButton.classList.remove("borderedButton");
      button.classList.add("borderedButton");
      prevClickedButton = button;


      return;

    })
  }
}


// Adds cards that you can click on to add them to your active cards
function setUpCards() {

  const addCardsSuitTypes: NodeList = document.querySelectorAll(".addCardsSuitTypes");

  if (!addCardsSuitTypes) return;

  var contrast: string;

  if (highContrast) {
    contrast = "highContrast";
  } else {
    contrast = "lowContrast";
  }

  let i: number = 0;

  const enhancementIndex: number = cardData.modifiers.chosenModifiersArr[0];
  var backgroundUrl: string;

  if (enhancementIndex === -1) {
    backgroundUrl = 'url("../images/cards/background/cardBackground.png")';
  } else {
    backgroundUrl = `url("../images/modifiers/enhancements/${cardData.modifiers.all.enhancements[enhancementIndex].name}.png")`;
    if (!backgroundUrl) return;
  }

  // Goes through every suit and numeral to add the cards

  addCardsSuitTypes.forEach(element => {
    const currentSuit: number = i;

    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }



    for (let j = 0; j < numerals.length; j++) {
      if (!element) return 0;
      const currentNumeral: number = j;

      const div: HTMLElement = document.createElement("div");

      const sealIndex: number = cardData.modifiers.chosenModifiersArr[1];
      const editionIndex: number = cardData.modifiers.chosenModifiersArr[2];
      const numeralUrl: string = `url(${urls.cardNumerals}/${contrast}/${suits[currentSuit]}/${numerals[currentNumeral]}.png)`;

      if (sealIndex !== -1) {
        const seal: HTMLElement = document.createElement("div");
        const sealName: string = cardData.modifiers.all.seals[sealIndex].name;
        const sealUrl: string = `url("../images/modifiers/seals/${sealName}.png")`;

        seal.classList.add("seals");
        seal.style.backgroundImage = `${sealUrl}`;
        div.appendChild(seal);
      }

      if (editionIndex !== -1) {
        const edition: HTMLElement = document.createElement("div");
        const editionName: string = cardData.modifiers.all.editions[editionIndex].name;
        const editionUrl: string = `url("../images/modifiers/editions/${editionName}.png")`;
        edition.classList.add("editions");
        edition.style.backgroundImage = `${editionUrl}`;
        div.appendChild(edition);
      }

      div.style.backgroundImage = `${numeralUrl}, ${backgroundUrl}`;
      div.addEventListener('click', function () {
        addCard(currentSuit, currentNumeral);
      });

      div.addEventListener('contextmenu', (e) => { e.preventDefault() });

      element.appendChild(div);

    }

    i++
  });
}

function setUpModifiers() {
  const enhancementSelect: HTMLElement | null = document.getElementById("enhancedSelect");
  const sealSelect: HTMLElement | null = document.getElementById("sealSelect");
  const editionSelect: HTMLElement | null = document.getElementById("editionSelect");

  const cardBackground: string = urls.baseCardBackground;

  const selectDOMObjects: (HTMLElement | null)[] = [enhancementSelect, sealSelect, editionSelect];

  const modifierUrl: string = urls.modifiers;

  if (!enhancementSelect || !sealSelect || !editionSelect) return 0;
  type ModifierKey = keyof typeof cardData.modifiers.all; // 'enhancements' | 'seals' | 'editions'
  const modifierKeys: ModifierKey[] = Object.keys(cardData.modifiers.all) as ModifierKey[];

  for (let i = 0; i < modifierKeys.length; i++) {
    const key = modifierKeys[i];
    const modifierList = cardData.modifiers.all[key];
    const currentSelectedDOMObject = selectDOMObjects[i];

    if (!currentSelectedDOMObject || !modifierList) continue;

    for (let j = 0; j < modifierList.length; j++) {

      //Creates the modifier DOM object
      const div: HTMLDivElement = document.createElement("div");
      const backgroundUrl: string = `${modifierUrl}/${key}/${modifierList[j].name}.png`;
      if (!backgroundUrl) continue;
      div.classList.add("modifierIcon");
      div.style.backgroundImage = `url(${backgroundUrl}), url(${cardBackground})`;

      div.addEventListener("click", (e) => {
        //One can be chosen at once from each category of modifiers
        const target: HTMLElement = e.currentTarget as HTMLElement;

        type ModifierKey = keyof typeof cardData.lastSelectedModifiersDOM;
        const modifierKeys: ModifierKey[] = Object.keys(cardData.lastSelectedModifiersDOM) as ModifierKey[];

        const key: ModifierKey = modifierKeys[i];
        const lastChosenModifierDOM: HTMLElement | null = cardData.lastSelectedModifiersDOM[key];

        if (lastChosenModifierDOM !== target) {
          if (lastChosenModifierDOM) {
            lastChosenModifierDOM.classList.remove("chosenModifier");
          }
          target.classList.add("chosenModifier");
          cardData.lastSelectedModifiersDOM[key] = target;
          cardData.modifiers.chosenModifiersArr[i] = j; // Changes the modifier to a new one (j is index of set new modifier)
        } else {
          target.classList.remove("chosenModifier");
          cardData.lastSelectedModifiersDOM[key] = null;
          cardData.modifiers.chosenModifiersArr[i] = -1;
        }

        setUpCards();
      })

      currentSelectedDOMObject.appendChild(div);
    }
  }
}


// Creates a card in the active card area

function addCard(suit: number, numeral: number) {


  if (!activeCardsSection) return 0;
  if (!document) return 0;

  var contrast: string;

  if (highContrast) {
    contrast = "highContrast";
  } else {
    contrast = "lowContrast";
  }

  var div: HTMLDivElement = document.createElement("div");

  var backgroundImageUrl: string;
  var numeralUrl: string;
  const enhancementIndex: number = cardData.modifiers.chosenModifiersArr[0];
  const sealIndex: number = cardData.modifiers.chosenModifiersArr[1];
  const editionIndex: number = cardData.modifiers.chosenModifiersArr[2];

  if (enhancementIndex !== -1) {
    const enhancementName: string | undefined = cardData.modifiers.all.enhancements[enhancementIndex].name;
    if (!enhancementName) return;
    backgroundImageUrl = `url("../images/modifiers/enhancements/${enhancementName}.png")`;
  } else {
    backgroundImageUrl = `url("../images/cards/background/cardBackground.png")`;
  }

  numeralUrl = `url("${urls.cardNumerals}/${contrast}/${suits[suit]}/${numerals[numeral]}.png")`


  if (sealIndex !== -1) {
    const seal: HTMLDivElement = document.createElement("div");
    const sealName: string | undefined = cardData.modifiers.all.seals[sealIndex].name;
    if (!sealName) return;
    const sealUrl: string = `url("../images/modifiers/seals/${sealName}.png")`;

    seal.classList.add("seals");
    seal.style.backgroundImage = sealUrl;
    div.appendChild(seal);
  }

  if (editionIndex !== -1) {
    const edition: HTMLDivElement = document.createElement("div");
    const editionName: string | undefined = cardData.modifiers.all.editions[editionIndex].name;

    if (!editionName) return;

    const editionUrl: string = `url("../images/modifiers/editions/${editionName}.png")`;

    edition.classList.add("editions");
    edition.style.backgroundImage = `${editionUrl}`;
    div.appendChild(edition);
  }

  div.style.backgroundImage = `${numeralUrl}, ${backgroundImageUrl}`;

  div = addEventsToCard(div);

  activeCardsSection.appendChild(div);

  createCardObject(div, suit, numeral);
  sortAllCards();
  setMarginOfCards()
  updateCardType();

  return "added card";
}

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

function createCardObject(object: any, suitNumber: number, numeralNumber: number) {
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
  const cardWidth = 76; // God damn magic numbers (this is perfect code don't question it);
  const children: NodeListOf<HTMLElement> = document.querySelectorAll("#currentCardsSection > *");
  const parentObject: HTMLElement | null = document.getElementById("currentCardsSection");
  if (!children || !parentObject) return "bozo";

  var marginOfChildren = (parentObject.clientWidth - ((children.length + 1) * cardWidth)) / children.length;
  if (marginOfChildren >= 0) marginOfChildren = 0;


  children.forEach(child => {
    child.style.marginLeft = `${marginOfChildren}px`

  });
}

function moveCard(card: HTMLElement, event: MouseEvent) {
  const mousePosition = { x: event.clientX, y: event.clientY }
  const documentSize = { width: document.documentElement.clientWidth, height: document.documentElement.clientHeight };
  const cardSize = { width: card.clientWidth, height: card.clientHeight };

  card.style.position = "absolute";
  card.style.zIndex = "1000";

  card.style.right = `${-mousePosition.x + documentSize.width - cardSize.width / 2}px`;
  card.style.top = `${mousePosition.y - cardSize.height / 2}px`;

  const nextSibling: HTMLElement | null = card.nextSibling as HTMLElement;
  const previousSibling: HTMLElement | null = card.previousSibling as HTMLElement;

  const currCard = cards.hand.all.find(object => object.DOMObject === card);
  var nextCard;

  if (nextSibling && nextSibling.getBoundingClientRect().x < card.getBoundingClientRect().x) {
    nextSibling.after(card);
    nextCard = cards.hand.all.find(object => object.DOMObject === nextSibling)
  }

  if (previousSibling && previousSibling.getBoundingClientRect().x > card.getBoundingClientRect().x) {
    previousSibling.before(card);
    nextCard = cards.hand.all.find(object => object.DOMObject === previousSibling)
  }

  if (nextCard && currCard) {
    const currCardOrder = currCard.order;
    const nextCardOrder = nextCard.order;

    currCard.order = nextCardOrder;
    nextCard.order = currCardOrder;

  }

}

function addEventsToCard(card: HTMLDivElement) {

  card = addCardHeldEvent(card);
  card = addCardRemovalEvent(card);
  card = addCardSelectionEvent(card);


  return card;
}

function addCardHeldEvent(div: HTMLDivElement) {

  div.addEventListener('mousedown', function () {
    if(cardHeldEvent.mouseHeldTimer !== null) clearTimeout(cardHeldEvent.mouseHeldTimer);
    cardHeldEvent.cardIsHeld = false;

    cardHeldEvent.mouseHeldTimer = setTimeout(() => {
      cardHeldEvent.cardIsHeld = true;
    }, cardHeldEvent.cardHeldTime);

    cardHeldEvent.cardHeldHandler = (e: MouseEvent) => {
      if(!cardHeldEvent.cardIsHeld) return;

      moveCard(div, e);
    };

    document.addEventListener('mousemove', cardHeldEvent.cardHeldHandler);


    document.addEventListener("mouseup", function (e) {
      if(cardHeldEvent.cardHeldHandler) document.removeEventListener('mousemove', cardHeldEvent.cardHeldHandler);
      div.style.position = "static";
      div.style.zIndex = "0";
      div.style.transform = "scale(1.00)"
    })
  });


  return div;
}

function addCardRemovalEvent(div: HTMLDivElement) {
  div.addEventListener('contextmenu', function (e) {
    e.preventDefault();
    div.remove();
    removeCardObject(div);
  });

  return div;
}

function addCardSelectionEvent(div: HTMLDivElement) {
  div.addEventListener('mouseup', function (e) {

    if (cardHeldEvent.cardIsHeld) {
      cardHeldEvent.cardIsHeld = false;
      return;
    }

    cardHeldEvent.cardIsClicked = true;

    const limitExceeded = cards.hand.active.length >= 5;

    if (!div.className.includes('pickedCards') && !limitExceeded) {
      selectCard(div);
    } else if (div.className.includes('pickedCards')) {
      deselectCard(div);
    }

    return;
  });

  return div;
}