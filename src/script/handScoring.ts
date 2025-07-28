import { cards, cardData, Card, CardId } from '../data/gameObjects.js';







function sortActiveCards() {
    var activeCards: CardId[] = cards.hand.active;

    var cardObjects: Card[] = [];

    activeCards.forEach(card => {
        const currCard = cards.hand.all.find(cardObject => cardObject.DOMObject === card.DOMObject);

        if (currCard) {
            cardObjects.push(currCard);
        }

    });

    if (!cardObjects) return;

    const sortedCards = [...cardObjects].sort((a, b) => {
        const currentCard = cards.hand.all.find(card => card.DOMObject === a.DOMObject);
        const nextCard = cards.hand.all.find(card => card.DOMObject === b.DOMObject);

        if (!currentCard || !nextCard) return 0;

        const valA: number = cardData.sortNumber[currentCard.number];
        const valB: number = cardData.sortNumber[nextCard.number];

        if (valA !== valB) return valB - valA;

        const suitA: number = cardData.sortSuit[currentCard.suit];
        const suitB: number = cardData.sortSuit[nextCard.suit];

        return suitA - suitB;
    });

    return sortedCards;
}


export function updateCardType() {

    restartValues();

    const scoredHand: Card[] | undefined = sortActiveCards();

    if (!scoredHand) return;
    var finalScoredHand: Card[][] = [];
    var longestHand = [0, 0]; // Length of same cards, Index
    var secondLongestHand = [0, 0];

    scoredHand.forEach(card => {
        var isNew: boolean = true;

        if (finalScoredHand.length != 0) {
            for (let i = 0; i < finalScoredHand.length; i++) {
                if (finalScoredHand[i][0].number == card.number) {
                    finalScoredHand[i].push(card);
                    isNew = false;
                }
            }
        }

        if (isNew) {
            finalScoredHand.push([card])
        }
    });

    for (let i = 0; i < finalScoredHand.length; i++) {
        if (finalScoredHand[i].length > secondLongestHand[0] && finalScoredHand[i].length <= longestHand[0]) {

            secondLongestHand[0] = finalScoredHand[i].length;
            secondLongestHand[1] = i;

        } else if (finalScoredHand[i].length > longestHand[0]) {

            if (longestHand[0] > secondLongestHand[0]) {
                secondLongestHand[0] = longestHand[0];
            }

            longestHand[0] = finalScoredHand[i].length;
            longestHand[1] = i;

        }
    }

    var longestHandIndex = longestHand[1];
    var secondLongestHandIndex = secondLongestHand[1];

    var fullHouseCards;
    var canBeFullHouse: boolean = false;
    var canBeTwoPair: boolean = false;

    var sortedHand: Card[] | null;

    const isFullHouse = (
        finalScoredHand[longestHandIndex] && finalScoredHand[secondLongestHandIndex] &&
        (longestHand[0] === 3 && secondLongestHand[0] === 2)
    );


    const isTwoPair = (finalScoredHand[longestHandIndex] && finalScoredHand[secondLongestHandIndex] &&
        longestHand[0] === 2 && secondLongestHand[0] === 2
    );

    if (isFullHouse) canBeFullHouse = true;
    if (isTwoPair) canBeTwoPair = true;


    const oneNumeralCards = finalScoredHand[longestHandIndex];

    if (isFullHouse || isTwoPair) {
        fullHouseCards = finalScoredHand[longestHandIndex].concat(finalScoredHand[secondLongestHandIndex]);
        sortedHand = sortByOrder(fullHouseCards);
    } else {
        sortedHand = sortByOrder(oneNumeralCards);
    }

    cardData.currentHand.allCards = sortedHand;

    const flush = isFlush();
    const straight = isStraight();

    const handsInfo = [
        { name: "Flush Five", condition: longestHand[0] === 5 && flush },
        { name: "Flush House", condition: canBeFullHouse && flush },
        { name: "Five Of A Kind", condition: longestHand[0] === 5 },
        { name: "Straight Flush", condition: straight && flush },
        { name: "Four Of A Kind", condition: longestHand[0] === 4 },
        { name: "Flush", condition: flush },
        { name: "Full House", condition: canBeFullHouse },
        { name: "Straight", condition: straight },
        { name: "Three Of A Kind", condition: longestHand[0] === 3 },
        { name: "Two Pair", condition: canBeTwoPair },
        { name: "Pair", condition: longestHand[0] === 2 },
        { name: "High Card", condition: true },
    ];


    for (let i = 0; i < handsInfo.length; i++) {

        if (handsInfo[i].condition) {
            cardData.currentHand.handType = handsInfo[i].name;
            break;
        }
    }
    if (!flush && !straight) {
        cardData.currentHand.allCards = sortedHand;
    }



    const handTypeText: HTMLElement | null = document.getElementById("handType");

    if (!handTypeText) return finalScoredHand;

    handTypeText.innerHTML = cardData.currentHand.handType;

    scoreHand();

    return finalScoredHand;

}

function isFlush() {

    const scoredHand: Card[] | undefined = sortActiveCards();
    if (!scoredHand) return;

    const requiredCards: number = 5;

    var suits: Card[][] = [];

    scoredHand.forEach(card => {
        var isNew: boolean = true;

        if (suits.length !== 0) {
            for (let i = 0; i < suits.length; i++) {
                if (suits[i][0].suit === card.suit) {
                    suits[i].push(card);
                    isNew = false;
                }
            }
        }

        if (isNew) {
            suits.push([card]);
        }
    });



    for (let i = 0; i < suits.length; i++) {
        if (suits[i].length >= requiredCards) {
            const sortedHand: Card[] | null = sortByOrder(suits[i]);
            cardData.currentHand.allCards = sortedHand;

            return true;
        }
    }



    return false;
}


function isStraight() {
    const scoredHand: Card[] | undefined = sortActiveCards();
    if (!scoredHand) return;

    const requiredCards: number = 5;

    var finalHand: Card[] = []

    if (scoredHand.length < 4) return false;


    for (let i = scoredHand.length - 1; i >= 0; i--) {
        if (finalHand.length >= 5) {
            break;
        }

        if (scoredHand[i].number === 0 && scoredHand[0].number === 14) {
            finalHand.push(scoredHand[i], scoredHand[0]);
            continue;
        }

        if (finalHand.length === 0) {
            finalHand.push(scoredHand[i]);
            continue;
        }

        if (scoredHand[i + 1].number + 1 === scoredHand[i].number) {
            finalHand.push(scoredHand[i]);
            continue;
        }

        finalHand = [];
    }

    if (finalHand.length === requiredCards) {

        const sortedHand: Card[] | null = sortByOrder(finalHand);
        cardData.currentHand.allCards = sortedHand;
        return true;

    }




    return false;
}


function sortByOrder(cards: Card[] | null) {

    if (!cards || cards.length === 1) return cards;

    var newCardsArray: Card[] = [];

    var lowestOrderIndex: number;
    var lowestOrder: number;

    for (let i = 0; i < cards.length; i++) {
        lowestOrder = -1;
        lowestOrderIndex = -1;

        for (let j = 0; j < cards.length; j++) {
            if ((cards[i].order < lowestOrder || lowestOrderIndex === -1) && !newCardsArray.includes(cards[i])) {
                lowestOrder = cards[i].order;
                lowestOrderIndex = i;
            }
        }
        newCardsArray.push(cards[lowestOrderIndex]);
    }

    return newCardsArray;
}

function scoreHand() {
    const handObject = cardData.hands.find(handType => handType.name === cardData.currentHand.handType);
    if (!cardData.currentHand.allCards || !handObject) return;

    cardData.currentHand.items.chips = handObject.chips;
    cardData.currentHand.items.mult = handObject.mult;


    cardData.currentHand.allCards.forEach(card => {
        scoreCard(card);
    });

    const chips: number = cardData.currentHand.items.chips;
    const mult: number = cardData.currentHand.items.mult;

    const chipsDOMObject = document.getElementById("chipsAmount");
    const multDOMObject = document.getElementById("multAmount");

    if (!chipsDOMObject || !multDOMObject) return;

    chipsDOMObject.innerHTML = `Chips: ${(chips).toString()}`;
    multDOMObject.innerHTML = `Mult: ${(mult).toString()}`;

}

function scoreCard(card: Card) {
    
    if (!card || !cardData.currentHand.allCards) return;

    const cardDataPath = cardData.currentHand;
    
    const itemNames = [
        "chips",
        "mult",
        "money",
        "tarot",
        "planet",
    ]

    const localScoredItems = {
        chips: { name: "", amount: 0, cardDataPath: "" },
        mult: { name: "", amount: 0, cardDataPath: "" },
        money: { name: "", amount: 0, cardDataPath: "" },
        tarot: { name: "", amount: 0, cardDataPath: "" },
        planet: { name: "", amount: 0, cardDataPath: "" },
    };

    const itemsAsArray = Object.values(localScoredItems);
    const cardDataAsArrayItems = Object.values(cardDataPath.items);

    let i = 0;

    itemNames.forEach(path => {
        itemsAsArray[i].name = path;
        itemsAsArray[i].amount = cardDataAsArrayItems[i];
        itemsAsArray[i].cardDataPath = `cardDataPath.items.${itemNames[i]}`;

        i++;
    });

    const chipsPath = localScoredItems.chips;
    const multPath = localScoredItems.mult;
    const moneyPath = localScoredItems.money;
    const tarotPath = localScoredItems.tarot;
    const planetPath = localScoredItems.planet;



    chipsPath.amount += cardData.cardValues[card.number];

    for (let i = 0; i < card.modifiers.length; i++) {
        
        if (card.modifiers[i] !== -1) {
            
            const cardDataEnhancement = cardData.modifiers.all.enhancements[card.modifiers[i]];
            if(cardDataEnhancement.name === "lucky") break; // fuck this shit specifically give me a break man
            if (!cardDataEnhancement) return;
            

            var isCondition : number = -1;

            if(cardDataEnhancement.condition === "inPlay"){
                isCondition = cardData.currentHand.allCards.findIndex(currentCard => currentCard === card);

            }else if(cardDataEnhancement.condition === "inHand"){
                isCondition = cards.hand.inactive.findIndex(currentCard => currentCard === card);

            }
                
            if(cardDataEnhancement.amount && isCondition !== -1){
                
                if(cardDataEnhancement.type!=="xMult"){
                    
                    const itemIndex =  itemNames.findIndex(item => item === cardDataEnhancement.type);
                    itemsAsArray[itemIndex].amount+=cardDataEnhancement.amount;
                }else if(cardDataEnhancement.type==="xMult"){
                    const itemIndex =  itemNames.findIndex(item => item === "mult");
                    itemsAsArray[itemIndex].amount*=cardDataEnhancement.amount;
                }
            }    

        }
    }




    cardData.currentHand.items.chips = chipsPath.amount;
    cardData.currentHand.items.mult = multPath.amount;




    return;
}

function restartValues() {
    Object.keys(cardData.currentHand.items).forEach(key => {
        cardData.currentHand.items[key as keyof typeof cardData.currentHand.items] = 0;
    });

    cardData.currentHand.allCards = null;
    cardData.currentHand.handType = "High Card";

    const highCardValues = cardData.hands.find(handType => handType.name === cardData.currentHand.handType);

    const chipsDOMObject = document.getElementById("chipsAmount");
    const multDOMObject = document.getElementById("multAmount");

    if (!chipsDOMObject || !multDOMObject || !highCardValues) return;

    chipsDOMObject.innerHTML = `Chips: ${(highCardValues.chips).toString()}`;
    multDOMObject.innerHTML = `Mult: ${(highCardValues.mult).toString()}`;
}