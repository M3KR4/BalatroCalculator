if (typeof document !== "undefined") {
  var cardSelectionButtons = document.getElementsByClassName("cardSelectionButtons");
  var prevClickedButton = document.getElementById("cardsButton");
  setUpUI();
}




function setUpUI() {
  for (let i = 0; i < cardSelectionButtons.length; i++) {
    cardSelectionButtons[i]!.addEventListener("click", function (e) {

      const buttonId = cardSelectionButtons[i].id;
      const button = document.getElementById(buttonId);

      if(!button) return;
      if(!prevClickedButton) return;
      if (prevClickedButton === button) return;

      button.style.boxShadow = "inset 0 0 0 0.2vh white";
      prevClickedButton.style.boxShadow = "none";
      prevClickedButton = button;

      return;

    })
  }
}

const jokers = {

  active: {
    amounts: {
      all: 0,
      common: 0,
      uncommon: 0,
      rare: 0
    },

    types: {
      mult: [],
      chip: [],
      xMult: [],
      other: []
    },

  },

  all: {
    types: {
      mult: [],
      chip: [],
      xMult: [],
      other: []
    },

    names: []
  }


};
