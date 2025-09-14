import { cardData, urls } from "../../data/gameObjects.js";
import { setUpCards } from "./cardsUI.js";

export { setUpModifiersUI };

function setUpModifiersUI() {
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
