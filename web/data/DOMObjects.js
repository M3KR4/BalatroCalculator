import { setUpJokerUI } from "../script/UI/jokerUI.js";
export const buttonUI = {
    previousClickedButton: null
};
export const jokerUI = {
    pageLeftBtn: null,
    pageRightBtn: null,
    pages: null,
    jokerSearchBar: null
};
function initButtonUI() {
    buttonUI.previousClickedButton = document.getElementById("cardsButton");
}
function initJokerUI() {
    jokerUI.pageLeftBtn = document.getElementById("jokerPageLeft");
    jokerUI.pageRightBtn = document.getElementById("jokerPageRight");
    jokerUI.pages = document.getElementById("jokerPages");
    jokerUI.jokerSearchBar = document.getElementById("jokerSearch");
    jokerUI.jokerSearchBar.addEventListener("input", setUpJokerUI);
}
export function initUI() {
    initButtonUI();
    initJokerUI();
}
