import { buttonUI } from "../../data/DOMObjects.js";

export { setUpButtonUI };

function setUpButtonUI() {
        const buttons: HTMLCollectionOf<HTMLElement> = document.getElementsByClassName("sectionListButtons") as HTMLCollectionOf<HTMLElement>;;
        for (let i = 0; i < buttons.length; i++) {

            buttons[i]!.addEventListener("click", function (e) {
                const prevClickedButton: HTMLElement | null = buttonUI.previousClickedButton;
                const buttonId: string = buttons[i].id;
                const button: HTMLElement | null = document.getElementById(buttonId);
                const sections: HTMLCollection = document.getElementsByClassName("editGameSections");

                if (prevClickedButton === button) return;

                if (!button || !buttonUI.previousClickedButton || !prevClickedButton || !sections) {
                    console.error("Cannot find necessary objects to create buttonUI");
                    return;
                }

                for (let j = 0; j < sections.length; j++) {
                    if (sections[j].className.includes("selectedSection")) {
                        sections[j].classList.remove("selectedSection")
                    };
                }

                sections[i].classList.add("selectedSection");
                prevClickedButton.classList.remove("borderedButton");
                button.classList.add("borderedButton");
                buttonUI.previousClickedButton = button;

                return;
            })
        }
    }