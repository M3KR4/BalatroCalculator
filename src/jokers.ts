  const numerals : string[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
  const suits : string[] = ['hearts', 'clubs', 'diamonds', 'spades'];
  const urls : string[] = ["../images/cards/lowRes", "../images/cards/highRes"];

if (typeof document !== "undefined") {
  var cardSelectionButtons = document.getElementsByClassName("cardSelectionButtons");
  var prevClickedButton = document.getElementById("cardsButton");
  var highContrast: boolean = true;

  

  setUpButtonUI();
  setUpCards();
}




function setUpButtonUI() {
  for (let i = 0; i < cardSelectionButtons.length; i++) {
    cardSelectionButtons[i]!.addEventListener("click", function (e) {

      const buttonId = cardSelectionButtons[i].id;
      const button = document.getElementById(buttonId);

      if (!button) return;
      if (!prevClickedButton) return;
      if (prevClickedButton === button) return;

      prevClickedButton.classList.remove("borderedButton");
      button.classList.add("borderedButton");
      prevClickedButton = button;

      return;

    })
  }
}

function setUpCards() {

  const cardsUI = document.querySelectorAll(".cardsUI");
  if(!cardsUI) return;



  var url : number = 0;
  let i : number = 0;

cardsUI.forEach(element => {
  const currentI = i;
  const currentUrl = url;

  for(let j = 0; j<numerals.length; j++){
    const div = document.createElement("div");
    div.style.backgroundImage = `url(${urls[currentUrl]}/${suits[currentI]}/${numerals[j]}.png)`;
    div.addEventListener('click', function(){
      console.log(url);
      addCard(currentI, j, currentUrl);
    });
    if(!element) return 0;
    element.appendChild(div);

  }

  i++
  if(i>3){
    i=0;
    url++;
  }
});
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

function addCard(suit : number, numeral : number, url : number){
  const activeCardsSection = document.getElementById("activeCardsSection");

  if(!activeCardsSection) return 0;
  if(!document) return 0;

  const div = document.createElement("div");
  console.log(url);
  console.log(`${urls[url]}/${suits[suit]}/${numerals[numeral]}`);
  div.style.backgroundImage = `url('${urls[url]}/${suits[suit]}/${numerals[numeral]}.png')`;
  
  activeCardsSection.appendChild(div);

  return "added card";
}