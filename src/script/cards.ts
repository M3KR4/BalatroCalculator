import { urls, cards, cardData, Card, CardId } from '../data/gameObjects.js';

const numerals: string[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const suits: string[] = ['hearts', 'clubs', 'diamonds', 'spades'];



var highContrast: boolean = true;
const cardWidth: number = 69; //I love magic numbers <3

if (typeof document !== "undefined") {
  var cardSelectionButtons: HTMLCollection = document.getElementsByClassName("cardSelectionButtons");
  var prevClickedButton: HTMLElement | null = document.getElementById("cardsButton");
  var activeCardsSection: HTMLElement | null = document.getElementById("currentCardsSection");


  setUpButtonUI();
  setUpCards();
  setUpModifiers();


}



// Makes buttons do button stuff (adding a border to the last clicked button)

function setUpButtonUI() {
  for (let i = 0; i < cardSelectionButtons.length; i++) {
    cardSelectionButtons[i]!.addEventListener("click", function (e) {

      const buttonId: string = cardSelectionButtons[i].id;
      const button: HTMLElement | null = document.getElementById(buttonId);

      if (!button) return;
      if (!prevClickedButton) return;
      if (prevClickedButton === button) return;

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

  const cardsUI: NodeList = document.querySelectorAll(".cardsUI");

  if (!cardsUI) return;

  var contrast: string;

  if (highContrast) {
    contrast = "highContrast"
  } else {
    contrast = "lowContrast"
  }

  var url: number = 0;
  let i: number = 0;

  const enhancementIndex = cardData.modifiers.chosenModifiersArr[0];
  var backgroundUrl: string;

  if (enhancementIndex === -1) {
    backgroundUrl = 'url("../images/cards/background/cardBackground.png")';
  } else {
    backgroundUrl = `url("../images/modifiers/enhancements/${cardData.modifiers.all[0][enhancementIndex]}.png")`;
    console.log("test");
  }

  // Goes through every suit and numeral to add the cards

  cardsUI.forEach(element => {
    const currentSuit: number = i;

    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }



    for (let j = 0; j < numerals.length; j++) {
      if (!element) return 0;
      const currentNumeral: number = j;

      const div: HTMLElement = document.createElement("div");

      const sealIndex = cardData.modifiers.chosenModifiersArr[1];
      const editionIndex = cardData.modifiers.chosenModifiersArr[2];
      const numeralUrl = `url(${urls.cardNumerals}/${contrast}/${suits[currentSuit]}/${numerals[currentNumeral]}.png)`;

      if (sealIndex !== -1) {
        const seal = document.createElement("div");
        const sealName = cardData.modifiers.seals[sealIndex];
        const sealUrl = `url("../images/modifiers/seals/${sealName}.png")`;

        seal.classList.add("seals");
        seal.style.backgroundImage = `${sealUrl}`;
        div.appendChild(seal);
      }

      if (editionIndex !== -1) {
        const edition = document.createElement("div");
        const editionName = cardData.modifiers.editions[editionIndex];
        const editionUrl = `url("../images/modifiers/editions/${editionName}.png")`;
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

  const cardBackground = urls.baseCardBackground;

  const selectDOMObjects: (HTMLElement | null)[] = [enhancementSelect, sealSelect, editionSelect];

  const modifierUrl: string = urls.modifiers;

  if (!enhancementSelect || !sealSelect || !editionSelect) return 0;
  type ModifierKey = keyof typeof cardData.modifiers; // 'enhancements' | 'seals' | 'editions'
  const modifierKeys: ModifierKey[] = Object.keys(cardData.modifiers) as ModifierKey[];

  for (let i = 0; i < modifierKeys.length; i++) {
    const key = modifierKeys[i];
    const modifierList = cardData.modifiers[key];
    const currentSelectedDOMObject = selectDOMObjects[i];

    if (!currentSelectedDOMObject || !modifierList) continue;

    for (let j = 0; j < modifierList.length; j++) {

      //Creates the modifier DOM object
      const div: HTMLDivElement = document.createElement("div");
      const backgroundUrl: string = `${modifierUrl}/${key}/${modifierList[j]}.png`;
      if (!backgroundUrl) continue;
      div.classList.add("modifierIcon");
      div.style.backgroundImage = `url(${backgroundUrl}), url(${cardBackground})`;

      div.addEventListener("click", (e) => {
        //One can be chosen at once from each category of modifiers
        const target = e.currentTarget as HTMLElement;

        type ModifierKey = keyof typeof cardData.lastSelectedModifiersDOM;
        const modifierKeys = Object.keys(cardData.lastSelectedModifiersDOM) as ModifierKey[];

        const key = modifierKeys[i];
        const lastChosenModifierDOM = cardData.lastSelectedModifiersDOM[key];

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

  const div: HTMLDivElement = document.createElement("div");

  var backgroundImageUrl: string;
  var numeralUrl: string;
  const enhancementIndex: number = cardData.modifiers.chosenModifiersArr[0];
  const sealIndex: number = cardData.modifiers.chosenModifiersArr[1];
  const editionIndex: number = cardData.modifiers.chosenModifiersArr[2];

  if (enhancementIndex !== -1) {
    const enhancementName: string = cardData.modifiers.enhancements[enhancementIndex];
    backgroundImageUrl = `url("../images/modifiers/enhancements/${enhancementName}.png")`;
  } else {
    backgroundImageUrl = `url("../images/cards/background/cardBackground.png")`;
  }

  numeralUrl = `url("${urls.cardNumerals}/${contrast}/${suits[suit]}/${numerals[numeral]}.png")`


  if (sealIndex !== -1) {
    const seal: HTMLDivElement = document.createElement("div");
    const sealName = cardData.modifiers.seals[sealIndex];
    const sealUrl = `url("../images/modifiers/seals/${sealName}.png")`;

    seal.classList.add("seals");
    seal.style.backgroundImage = sealUrl;
    div.appendChild(seal);
  }

  if (editionIndex !== -1) {
    const edition = document.createElement("div");
    const editionName = cardData.modifiers.editions[editionIndex];
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
    } else if (div.className.includes('pickedCards')) {
      deselectCard(div);
    } else {
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
  shuffleCards();

  if (div.clientWidth < cardWidth) {
    var children: NodeListOf<HTMLElement> = document.querySelectorAll("#currentCardsSection > *");
    if (!children) return "bozo";

    children.forEach(child => {
      child.classList.add("crampedCards");
    });


  }



  return "added card";
}

function selectCard(object: HTMLElement) {
  if (!object) return 0;



  object.classList.add('pickedCards');



  cards.hand.inactive = cards.hand.inactive.filter(card => card.DOMObject !== object);

  const newActiveCard: CardId = {
    DOMObject: object
  }

  cards.hand.active.push(newActiveCard);
}

function deselectCard(object: HTMLElement) {
  if (!object) return 0;

  object.classList.remove('pickedCards');

  cards.hand.active = cards.hand.active.filter(card => card.DOMObject !== object);

  const newInactiveCard: CardId = {
    DOMObject: object
  };

  cards.hand.inactive.push(newInactiveCard);

}

function createCardObject(object: any, suitNumber: number, numeralNumber: number) {
  const enhancement = cardData.modifiers.chosenModifiersArr[0];
  const seal = cardData.modifiers.chosenModifiersArr[1];
  const edition = cardData.modifiers.chosenModifiersArr[2];

  const newCard: Card = {
    DOMObject: object,
    order: cards.hand.inactive.length,
    number: numeralNumber,
    suit: suitNumber,
    modifiers: [enhancement, seal, edition]
  };

  const newInactiveCard: CardId = {
    DOMObject: object
  };





  cards.hand.all.push(newCard);
  cards.hand.inactive.push(newInactiveCard);



}

function removeCardObject(object: HTMLElement) {


  const currentObject = cards.hand.all.find(card => card.DOMObject === object);

  if (!currentObject) return 0;

  var order: number;

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

  return 0;
}

function shuffleCards() {
  const allCards: Card[] = cards.hand.all;

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

}

