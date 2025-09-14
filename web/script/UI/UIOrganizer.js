import { setUpCards } from "./cardsUI.js";
import { setUpButtonUI } from "./buttonUI.js";
import { setUpJokerUI, setUpJokerPageBtns } from "./jokerUI.js";
import { setUpModifiersUI } from "./modifiersUI.js";
import { initUI } from "../../data/DOMObjects.js";
export function createUI() {
    initUI();
    setUpButtonUI();
    setUpJokerUI();
    setUpJokerPageBtns();
    setUpCards();
    setUpModifiersUI();
}
