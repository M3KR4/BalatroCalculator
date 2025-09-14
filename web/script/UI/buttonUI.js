import { buttonUI } from "../../data/DOMObjects.js";
export { setUpButtonUI };
function setUpButtonUI() {
    const buttons = document.getElementsByClassName("sectionListButtons");
    ;
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener("click", function (e) {
            const prevClickedButton = buttonUI.previousClickedButton;
            const buttonId = buttons[i].id;
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
