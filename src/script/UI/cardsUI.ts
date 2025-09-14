import { urls, cardData } from '../../data/gameObjects.js';
import { createCardObject, onCardChange } from '../cards.js';
import { addEventsToCard } from '../events/cardEvents.js';

export { setUpCards, addCard }

// Adds cards that you can click on to add them to your active cards
function setUpCards() {

  const addCardsSuitTypes: NodeList = document.querySelectorAll(".addCardsSuitTypes");

  if (!addCardsSuitTypes) return;

  var contrast: string;
  const highContrast = cardData.highContrast;

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



    for (let j = 0; j < cardData.numerals.length; j++) {
      if (!element) return 0;
      const currentNumeral: number = j;

      const div: HTMLElement = document.createElement("div");

      const sealIndex: number = cardData.modifiers.chosenModifiersArr[1];
      const editionIndex: number = cardData.modifiers.chosenModifiersArr[2];
      const numeralUrl: string = `url(${urls.cardNumerals}/${contrast}/${cardData.suits[currentSuit]}/${cardData.numerals[currentNumeral]}.png)`;

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

        const cardCountInput: HTMLInputElement | null = document.getElementById("cardCount") as HTMLInputElement;
        if (!cardCountInput) {
          console.error("Cannot find 'cardCount' DOM object");
          return;
        }

        const cardCountNum: number = Number(cardCountInput.value);

        if (Number.isNaN(cardCountNum) || cardCountNum <= 0) {

          console.error(`Card count should be a positive number`);
          return;
        }

        for (let i = 0; i < cardCountNum; i++) {
          const isLastCard: boolean = (i === cardCountNum-1);

          addCard(currentSuit, currentNumeral, isLastCard);
        }

      });

      div.addEventListener('contextmenu', (e) => { e.preventDefault() });

      element.appendChild(div);

    }

    i++
  });
}



function addCard(suit: number, numeral: number, calcCards: boolean) {

  const activeCardsSection: HTMLElement | null = document.getElementById("currentCardsSection");

  if (!activeCardsSection){
    console.error("Cannot find activeCardsSection");
    return 0;
  } 

  var contrast: string = cardData.highContrast ? "highContrast" : "lowContrast";
  var div: HTMLDivElement = document.createElement("div");

  var backgroundImageUrl: string;
  var numeralUrl: string;

  const modifierImages = "../images/modifiers";

  const enhancementIndex: number = cardData.modifiers.chosenModifiersArr[0];
  const sealIndex: number = cardData.modifiers.chosenModifiersArr[1];
  const editionIndex: number = cardData.modifiers.chosenModifiersArr[2];


  if (enhancementIndex !== -1) {
    const enhancementName: string | undefined = cardData.modifiers.all.enhancements[enhancementIndex].name;
    backgroundImageUrl = `url("${modifierImages}/enhancements/${enhancementName}.png")`;
  } else {
    backgroundImageUrl = `url("../images/cards/background/cardBackground.png")`;
  }

  numeralUrl = `url("${urls.cardNumerals}/${contrast}/${cardData.suits[suit]}/${cardData.numerals[numeral]}.png")`


  if (sealIndex !== -1) {
    const seal: HTMLDivElement = document.createElement("div");
    const sealName: string | undefined = cardData.modifiers.all.seals[sealIndex].name;
    const sealUrl: string = `url("${modifierImages}/seals/${sealName}.png")`;

    seal.classList.add("seals");
    seal.style.backgroundImage = sealUrl;
    div.appendChild(seal);
  }

  if (editionIndex !== -1) {
    const edition: HTMLDivElement = document.createElement("div");
    const editionName: string | undefined = cardData.modifiers.all.editions[editionIndex].name;

    const editionUrl: string = `url("${modifierImages}/editions/${editionName}.png")`;

    edition.classList.add("editions");
    edition.style.backgroundImage = `${editionUrl}`;
    div.appendChild(edition);
  }

  div.style.backgroundImage = `${numeralUrl}, ${backgroundImageUrl}`;
  div = addEventsToCard(div);
  activeCardsSection.appendChild(div);
  createCardObject(div, suit, numeral);

  if (calcCards) onCardChange();

  return "added card";
}
