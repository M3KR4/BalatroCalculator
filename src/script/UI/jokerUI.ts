import { jokers } from '../../data/jokerData.js';
import { jokerUI } from '../../data/DOMObjects.js';

export {setUpJokerUI, setUpJokerPageBtns};

function setUpJokerUI() {
    const jokerSearchBar = jokerUI.jokerSearchBar;
    const jokerPages = jokerUI.pages;
    const allJokers = jokers.all;

    if(!jokerSearchBar || !jokerPages){
        console.error("Joker elements not found");
        return;
    }

    const jokerPageList = Array.from(jokerPages.children) as HTMLElement[];
    const jokerSearchText  = jokerSearchBar.value.toLowerCase();

    jokerPageList.forEach(element => {
        element.remove();
    });

    for (let i = 0; i < allJokers.length; i++) {
        if(!allJokers[i].name.toLowerCase().includes(jokerSearchText)) continue;
        const jokerCard: HTMLDivElement = document.createElement("div");
        const jokerImage = `url("../images/jokers/${jokers.all[i].filename}")`;
        jokerCard.style.backgroundImage = jokerImage;
        jokerCard.classList.add("joker");

        const addJokerListener = () => {
            addJoker(jokerCard, addJokerListener);
            setJokerMargins();
        }

        jokerCard.addEventListener("click", addJokerListener);

        if (jokerPages.children.length === 0 || jokers.displayCols * jokers.displayRows === jokerPages.lastChild?.childNodes.length) {
            const page = document.createElement("div");
            page.classList.add("singularJokerPage");
            jokerPages.appendChild(page);
            page.appendChild(jokerCard);
        } else {
            if (!jokerPages.lastChild) {
                console.error("jokerPage not found");
                return;
            }
            const lastJokerPage: HTMLElement = jokerPages.lastChild as HTMLElement;
            lastJokerPage.appendChild(jokerCard);
        }
    }
    const firstJokerPage: HTMLElement = jokerPages.firstChild as HTMLElement;

    if (firstJokerPage) {
        firstJokerPage.classList.add("currentJokerPage");
    }
}

function addJoker(joker : HTMLElement, listener : EventListener){
    const newJoker = joker.cloneNode(true);
    newJoker.removeEventListener("click", listener);
    const activeJokerArea = document.getElementById("activeJokersHeader");

    activeJokerArea?.appendChild(newJoker);
}

function setJokerMargins(){
    const activeJokerArea : HTMLElement | null = document.getElementById("activeJokersHeader");
    const firstChild : HTMLElement = activeJokerArea?.firstChild as HTMLElement;

    if(!activeJokerArea){
        console.error("Cannot find activeJokersHeader");
        return;
    }

    if(!firstChild){
        console.error("Cannot find first child of activeJokerHeader");
        return;
    }
    const jokerAmount = activeJokerArea.childElementCount;
    const jokerAreaWidth = activeJokerArea.clientWidth;
    const jokerWidth = 100;

    const marginRight = (activeJokerArea.clientWidth - ((activeJokerArea.childNodes.length +1) * jokerWidth)) / jokerAmount;
    const finalMargin = marginRight <= -0.1 ? marginRight : -0.1;


    Array.from(activeJokerArea?.children).forEach(joker => {
        const realJoker = joker as HTMLElement;
        realJoker.style.width = `100px`;
        realJoker.style.marginRight = `${finalMargin}px`;
    });

    
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

        if(!jokerPages){
            console.error("Cannot find jokerPages");
            return;
        }

        const pagesAmount = jokerPages.children.length;

        for(let i = 0; i<pagesAmount; i++){
            if(jokerPages.children[i].classList.contains("currentJokerPage") && i===pagesAmount-1){
                jokerPages.children[i].classList.remove("currentJokerPage");
                const firstChild : HTMLElement = jokerPages.firstChild as HTMLElement;
                firstChild.classList.add("currentJokerPage");
                return;
            }else if(jokerPages.children[i].classList.contains("currentJokerPage")){
                jokerPages.children[i].classList.remove("currentJokerPage");
                jokerPages.children[i+1].classList.add("currentJokerPage");
                return;
            }
        }
     });

     pageLeft.addEventListener("click", function(){
        const jokerPages = jokerUI.pages;

        if(!jokerPages){
            console.error("Cannot find jokerPages");
            return;
        }

        const pagesAmount = jokerPages.children.length;

        for(let i = 0; i<pagesAmount; i++){
            if(jokerPages.children[i].classList.contains("currentJokerPage") && i===0){
                jokerPages.children[i].classList.remove("currentJokerPage");
                const lastChild : HTMLElement = jokerPages.lastChild as HTMLElement;
                lastChild.classList.add("currentJokerPage");
                return;
            }else if(jokerPages.children[i].classList.contains("currentJokerPage")){
                jokerPages.children[i].classList.remove("currentJokerPage");
                jokerPages.children[i-1].classList.add("currentJokerPage");
                return;
            }
        }
     });
}

