import { setUpJokerUI } from "../script/UI/jokerUI.js";

export const buttonUI = {
    previousClickedButton: null as HTMLElement | null
}

export const jokerUI = {
    pageLeftBtn: null as HTMLElement | null,
    pageRightBtn: null as HTMLElement | null,
    pages: null as HTMLElement | null,
    jokerSearchBar: null as HTMLInputElement | null
}

function initButtonUI() {
    buttonUI.previousClickedButton = document.getElementById("cardsButton");
}

function initJokerUI(){
    jokerUI.pageLeftBtn = document.getElementById("jokerPageLeft");
    jokerUI.pageRightBtn = document.getElementById("jokerPageRight");
    jokerUI.pages = document.getElementById("jokerPages")
    jokerUI.jokerSearchBar = <HTMLInputElement> document.getElementById("jokerSearch");
    jokerUI.jokerSearchBar.addEventListener("input", setUpJokerUI);
}

export function initUI(){
    initButtonUI();
    initJokerUI();
}