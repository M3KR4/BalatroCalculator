import { buttonUI, jokerUI } from '../data/DOMObjects.js';
import { urls, cardData } from '../data/gameObjects.js';
import { jokers } from '../data/jokerData.js';
import { addEventsToCard, createCardObject, onCardChange } from './cards.js';
export function setUpUI() {
    setUpButtonUI();
    setUpJokerUI();
    setUpJokerPageBtns();
    setUpCards();
    setUpModifiersUI();
}
function setUpButtonUI() {
    const sectionListButtons = document.getElementsByClassName("sectionListButtons");
    for (let i = 0; i < sectionListButtons.length; i++) {
        sectionListButtons[i].addEventListener("click", function (e) {
            const prevClickedButton = buttonUI.previousClickedButton;
            const buttonId = sectionListButtons[i].id;
            const button = document.getElementById(buttonId);
            const sections = document.getElementsByClassName("editGameSections");
            if (prevClickedButton === button)
                return;
            if (!button || !buttonUI.previousClickedButton || !prevClickedButton || !sections) {
                console.error("Cannot find necessary objects to create buttonUI");
                return;
            }
            for (let j = 0; j < sections.length; j++) {
                if (sections[j].className.includes("selectedSection")) {
                    sections[j].classList.remove("selectedSection");
                }
                ;
            }
            sections[i].classList.add("selectedSection");
            prevClickedButton.classList.remove("borderedButton");
            button.classList.add("borderedButton");
            buttonUI.previousClickedButton = button;
            return;
        });
    }
}
export function setUpJokerUI() {
    var _a;
    const jokerSearchBar = jokerUI.jokerSearchBar;
    const jokerPages = jokerUI.pages;
    const allJokers = jokers.all;
    if (!jokerSearchBar || !jokerPages) {
        console.error("Joker elements not found");
        return;
    }
    const jokerPageList = Array.from(jokerPages.children);
    const jokerSearchText = jokerSearchBar.value.toLowerCase();
    jokerPageList.forEach(element => {
        element.remove();
    });
    for (let i = 0; i < allJokers.length; i++) {
        if (!allJokers[i].name.toLowerCase().includes(jokerSearchText))
            continue;
        const jokerCard = document.createElement("div");
        const jokerImage = `url("../images/jokers/${jokers.all[i].filename}")`;
        jokerCard.style.backgroundImage = jokerImage;
        jokerCard.classList.add("joker");
        if (jokerPages.children.length === 0 || jokers.displayCols * jokers.displayRows === ((_a = jokerPages.lastChild) === null || _a === void 0 ? void 0 : _a.childNodes.length)) {
            const page = document.createElement("div");
            page.classList.add("singularJokerPage");
            jokerPages.appendChild(page);
            page.appendChild(jokerCard);
        }
        else {
            if (!jokerPages.lastChild) {
                console.error("jokerPage not found");
                return;
            }
            const lastJokerPage = jokerPages.lastChild;
            lastJokerPage.appendChild(jokerCard);
        }
    }
    const firstJokerPage = jokerPages.firstChild;
    if (firstJokerPage) {
        firstJokerPage.classList.add("currentJokerPage");
    }
}
function setUpJokerPageBtns() {
    const pageLeft = jokerUI.pageLeftBtn;
    const pageRight = jokerUI.pageRightBtn;
    if (!pageLeft || !pageRight) {
        console.error("Cannot find jokerPageButtons");
        return;
    }
    pageRight.addEventListener("click", function () {
        const jokerPages = jokerUI.pages;
        if (!jokerPages) {
            console.error("Cannot find jokerPages");
            return;
        }
        const pagesAmount = jokerPages.children.length;
        for (let i = 0; i < pagesAmount; i++) {
            if (jokerPages.children[i].classList.contains("currentJokerPage") && i === pagesAmount - 1) {
                jokerPages.children[i].classList.remove("currentJokerPage");
                const firstChild = jokerPages.firstChild;
                firstChild.classList.add("currentJokerPage");
                return;
            }
            else if (jokerPages.children[i].classList.contains("currentJokerPage")) {
                jokerPages.children[i].classList.remove("currentJokerPage");
                jokerPages.children[i + 1].classList.add("currentJokerPage");
                return;
            }
        }
    });
    pageLeft.addEventListener("click", function () {
        const jokerPages = jokerUI.pages;
        if (!jokerPages) {
            console.error("Cannot find jokerPages");
            return;
        }
        const pagesAmount = jokerPages.children.length;
        for (let i = 0; i < pagesAmount; i++) {
            if (jokerPages.children[i].classList.contains("currentJokerPage") && i === 0) {
                jokerPages.children[i].classList.remove("currentJokerPage");
                const lastChild = jokerPages.lastChild;
                lastChild.classList.add("currentJokerPage");
                return;
            }
            else if (jokerPages.children[i].classList.contains("currentJokerPage")) {
                jokerPages.children[i].classList.remove("currentJokerPage");
                jokerPages.children[i - 1].classList.add("currentJokerPage");
                return;
            }
        }
    });
}
// Adds cards that you can click on to add them to your active cards
export function setUpCards() {
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
function setUpModifiersUI() {
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
export function addCard(suit, numeral, calcCards) {
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
        if (!enhancementName)
            return;
        backgroundImageUrl = `url("${modifierImages}/enhancements/${enhancementName}.png")`;
    }
    else {
        backgroundImageUrl = `url("../images/cards/background/cardBackground.png")`;
    }
    numeralUrl = `url("${urls.cardNumerals}/${contrast}/${cardData.suits[suit]}/${cardData.numerals[numeral]}.png")`;
    if (sealIndex !== -1) {
        const seal = document.createElement("div");
        const sealName = cardData.modifiers.all.seals[sealIndex].name;
        if (!sealName)
            return;
        const sealUrl = `url("${modifierImages}/seals/${sealName}.png")`;
        seal.classList.add("seals");
        seal.style.backgroundImage = sealUrl;
        div.appendChild(seal);
    }
    if (editionIndex !== -1) {
        const edition = document.createElement("div");
        const editionName = cardData.modifiers.all.editions[editionIndex].name;
        if (!editionName)
            return;
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
