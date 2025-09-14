import { urls, cardData } from '../../data/gameObjects.js';
import { createCardObject, onCardChange } from '../cards.js';
import { addEventsToCard } from '../events/cardEvents.js';
export { setUpCards, addCard };
// Adds cards that you can click on to add them to your active cards
function setUpCards() {
    const addCardsSuitTypes = document.querySelectorAll(".addCardsSuitTypes");
    if (!addCardsSuitTypes)
        return;
    var contrast;
    const highContrast = cardData.highContrast;
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
        for (let j = 0; j < cardData.numerals.length; j++) {
            if (!element)
                return 0;
            const currentNumeral = j;
            const div = document.createElement("div");
            const sealIndex = cardData.modifiers.chosenModifiersArr[1];
            const editionIndex = cardData.modifiers.chosenModifiersArr[2];
            const numeralUrl = `url(${urls.cardNumerals}/${contrast}/${cardData.suits[currentSuit]}/${cardData.numerals[currentNumeral]}.png)`;
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
                    const isLastCard = (i === cardCountNum - 1);
                    addCard(currentSuit, currentNumeral, isLastCard);
                }
            });
            div.addEventListener('contextmenu', (e) => { e.preventDefault(); });
            element.appendChild(div);
        }
        i++;
    });
}
function addCard(suit, numeral, calcCards) {
    const activeCardsSection = document.getElementById("currentCardsSection");
    if (!activeCardsSection) {
        console.error("Cannot find activeCardsSection");
        return 0;
    }
    var contrast = cardData.highContrast ? "highContrast" : "lowContrast";
    var div = document.createElement("div");
    var backgroundImageUrl;
    var numeralUrl;
    const modifierImages = "../images/modifiers";
    const enhancementIndex = cardData.modifiers.chosenModifiersArr[0];
    const sealIndex = cardData.modifiers.chosenModifiersArr[1];
    const editionIndex = cardData.modifiers.chosenModifiersArr[2];
    if (enhancementIndex !== -1) {
        const enhancementName = cardData.modifiers.all.enhancements[enhancementIndex].name;
        backgroundImageUrl = `url("${modifierImages}/enhancements/${enhancementName}.png")`;
    }
    else {
        backgroundImageUrl = `url("../images/cards/background/cardBackground.png")`;
    }
    numeralUrl = `url("${urls.cardNumerals}/${contrast}/${cardData.suits[suit]}/${cardData.numerals[numeral]}.png")`;
    if (sealIndex !== -1) {
        const seal = document.createElement("div");
        const sealName = cardData.modifiers.all.seals[sealIndex].name;
        const sealUrl = `url("${modifierImages}/seals/${sealName}.png")`;
        seal.classList.add("seals");
        seal.style.backgroundImage = sealUrl;
        div.appendChild(seal);
    }
    if (editionIndex !== -1) {
        const edition = document.createElement("div");
        const editionName = cardData.modifiers.all.editions[editionIndex].name;
        const editionUrl = `url("${modifierImages}/editions/${editionName}.png")`;
        edition.classList.add("editions");
        edition.style.backgroundImage = `${editionUrl}`;
        div.appendChild(edition);
    }
    div.style.backgroundImage = `${numeralUrl}, ${backgroundImageUrl}`;
    div = addEventsToCard(div);
    activeCardsSection.appendChild(div);
    createCardObject(div, suit, numeral);
    if (calcCards)
        onCardChange();
    return "added card";
}
