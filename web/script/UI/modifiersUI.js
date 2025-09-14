import { cardData, urls } from "../../data/gameObjects.js";
import { setUpCards } from "./cardsUI.js";
export { setUpModifiersUI };
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
