import { jokers, jokerDOMObjects } from "../data/jokerData.js";
if (typeof document !== "undefined") {
    const jokerSearchBar = document.getElementById("jokerSearch");
    jokerSearchBar.addEventListener("input", setUpJokers);
    setUpJokers();
    setUpJokerPageBtns();
}
function setUpJokers() {
    var _a;
    const jokerSearchBar = document.getElementById("jokerSearch");
    const jokerPages = jokerDOMObjects.pages;
    if (!jokerSearchBar || !jokerPages) {
        console.error("Joker elements not found");
        return;
    }
    const jokerPageList = Array.from(jokerPages.children);
    jokerPageList.forEach(element => {
        element.remove();
    });
    const jokerSearchText = jokerSearchBar.value.toLowerCase();
    var allJokers = jokers.all;
    for (let i = 0; i < allJokers.length; i++) {
        if (!allJokers[i].name.toLowerCase().includes(jokerSearchText))
            continue;
        const jokerCard = document.createElement("div");
        jokerCard.style.backgroundImage = `url("../images/jokers/${jokers.all[i].filename}")`;
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
    const pageLeft = jokerDOMObjects.pageLeftBtn;
    const pageRight = jokerDOMObjects.pageRightBtn;
    if (!pageLeft || !pageRight) {
        console.error("Cannot find jokerPageButtons");
        return;
    }
    pageRight.addEventListener("click", function () {
        const jokerPages = jokerDOMObjects.pages;
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
        const jokerPages = jokerDOMObjects.pages;
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
