import { cards, cardData, Card, CardId } from '../data/gameObjects.js';

class HandEvaluator {
    private requiredCards = 5;
    private scoredHand = sortActiveCards();
    private enhancements = cardData.modifiers.all.enhancements;

    private getWildIndex() {
        return this.enhancements.findIndex(modifier => modifier.name === "wild") as number;
    }

    private getStoneIndex() {
        return this.enhancements.findIndex(modifier => modifier.name === "stone") as number;
    }

    private getDebuffedIndex() {
        return cardData.modifiers.all.editions.findIndex(modifier => modifier.name === "debuffed") as number;
    }

    isFlush() {
        if (!this.scoredHand) return false;

        var suits: Card[][] = [];

        this.scoredHand.forEach(card => {
            if (card.modifiers[0] === this.getStoneIndex()) return;

            var isNew: boolean = true;

            if (suits.length !== 0) {
                for (let i = 0; i < suits.length; i++) {
                    const checkedCard = suits[i][0];
                    if (
                        (checkedCard.suit === card.suit ||
                            (checkedCard.modifiers[0] === this.getWildIndex() && checkedCard.modifiers[2] !== this.getDebuffedIndex()) ||
                            (card.modifiers[0] === this.getWildIndex() && card.modifiers[2] !== this.getDebuffedIndex()))
                    ) {
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
            if (suits[i].length >= this.requiredCards) {
                const sortedHand: Card[] | null = sortByOrder(suits[i]);
                cardData.currentHand.allCards = sortedHand;

                return true;
            }
        }

        return false;
    }

    isStraight() {
        if (!this.scoredHand) return false;

        var finalHand: Card[] = []

        if (this.scoredHand.length < 4) return false;


        for (let i = this.scoredHand.length - 1; i >= 0; i--) {
            if (finalHand.length >= 5 || this.scoredHand[i].modifiers[0] === this.getStoneIndex()) {
                break;
            }
            
            if ((this.scoredHand[i].number === 0 && this.scoredHand[0].number === 12) && this.scoredHand[0].modifiers[0] !== this.getStoneIndex()) {

                finalHand.push(this.scoredHand[i], this.scoredHand[0]);
                continue;
            }

            if (finalHand.length === 0) {
                finalHand.push(this.scoredHand[i]);
                continue;
            }

            if (this.scoredHand[i + 1].number + 1 === this.scoredHand[i].number) {
                finalHand.push(this.scoredHand[i]);
                continue;
            }

            finalHand = [];
        }

        if (finalHand.length === this.requiredCards) {

            const sortedHand: Card[] | null = sortByOrder(finalHand);
            cardData.currentHand.allCards = sortedHand;
            return true;

        }
        return false;
    }

    isTwoPair(longestHand : number, secondLongestHand : number){
        return (longestHand === 2 && secondLongestHand === 2);
    }

    isFullHouse(longestHand : number, secondLongestHand : number){
        return (longestHand === 3 && secondLongestHand === 2);
    }
}

function sortActiveCards() {
    var activeCards: CardId[] = cards.hand.active;

    var cardObjects: Card[] = [];

    activeCards.forEach(card => {
        const currCard: Card | undefined = cards.hand.all.find(cardObject => cardObject.DOMObject === card.DOMObject);

        if (currCard) {
            cardObjects.push(currCard);
        }

    });

    if (!cardObjects) return;

    const sortedCards: Card[] = [...cardObjects].sort((a, b) => {
        const currentCard: Card | undefined = cards.hand.all.find(card => card.DOMObject === a.DOMObject);
        const nextCard: Card | undefined = cards.hand.all.find(card => card.DOMObject === b.DOMObject);

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
    const evaluator = new HandEvaluator();
    const scoredHand: Card[] | undefined = sortActiveCards();

    if (!scoredHand) return;
    var finalScoredHand: Card[][] = [];
    const longestHands = {
        longestHand: {length: 0, hand: [] as Card[]},
        secondLongestHand: {length: 0, hand: [] as Card[]}
    }
    const stoneModifierIndex: number = cardData.modifiers.all.enhancements.findIndex(modifier => modifier.name === "stone");
    var stoneCards: Card[] = [];

    scoredHand.forEach(card => {
        if (card.modifiers[0] === stoneModifierIndex) {
            stoneCards.push(card);
            return;
        }
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
        const longestHand = longestHands.longestHand;
        const secondLongestHand = longestHands.secondLongestHand;
        if (finalScoredHand[i].length > secondLongestHand.length && finalScoredHand[i].length <= longestHand.length) {

            secondLongestHand.length = finalScoredHand[i].length;
            secondLongestHand.hand = finalScoredHand[i];

        } else if (finalScoredHand[i].length > longestHands.longestHand.length) {

            if (longestHand.length > secondLongestHand.length) {
                secondLongestHand.length = longestHand.length;
            }

            longestHand.length = finalScoredHand[i].length;
            longestHand.hand = finalScoredHand[i];

        }
    }

    const longestHand = longestHands.longestHand;
    const secondLongestHand = longestHands.secondLongestHand;

    var sortedHand: Card[] | null;

    const isFullHouse = evaluator.isFullHouse(longestHand.length, secondLongestHand.length);
    const isTwoPair = evaluator.isTwoPair(longestHand.length, secondLongestHand.length);

    if (isFullHouse || isTwoPair) {
        const fullHouseCards : Card[] = longestHand.hand.concat(secondLongestHand.hand);
        sortedHand = sortByOrder(fullHouseCards);
    } else {
        sortedHand = sortByOrder(longestHand.hand);
    }

    cardData.currentHand.allCards = sortedHand;

    const isFlush: boolean | undefined = evaluator.isFlush();
    const isStraight: boolean | undefined = evaluator.isStraight();

    const handsInfo = [
        { name: "Flush Five", condition: longestHand.length === 5 && isFlush },
        { name: "Flush House", condition: isFullHouse && isFlush },
        { name: "Five Of A Kind", condition: longestHand.length === 5 },
        { name: "Straight Flush", condition: isStraight && isFlush },
        { name: "Four Of A Kind", condition: longestHand.length === 4 },
        { name: "Flush", condition: isFlush },
        { name: "Full House", condition: isFullHouse },
        { name: "Straight", condition: isStraight },
        { name: "Three Of A Kind", condition: longestHand.length === 3 },
        { name: "Two Pair", condition: isTwoPair },
        { name: "Pair", condition: longestHand.length === 2 },
        { name: "High Card", condition: true }
    ];


    for (let i = 0; i < handsInfo.length; i++) {

        if (handsInfo[i].condition) {
            cardData.currentHand.handType = handsInfo[i].name;
            break;
        }
    }
    
    if (!isFlush && !isStraight) {
        cardData.currentHand.allCards = sortedHand;
    }

    if (cardData.currentHand.allCards && stoneCards.length !== 0) {
        cardData.currentHand.allCards = cardData.currentHand.allCards.concat(stoneCards);
    } else if (stoneCards.length !== 0) {
        cardData.currentHand.allCards = stoneCards;
    }



    const handTypeText: HTMLElement | null = document.getElementById("handType");

    if (!handTypeText) return finalScoredHand;

    handTypeText.innerHTML = cardData.currentHand.handType;

    scoreHand();

    return finalScoredHand;

}



function sortByOrder(cards: Card[] | null) {
    if (!cards) return cards;

    const newCardsArray: Card[] = [];
    const usedIndices = new Set<number>();

    for (let i = 0; i < cards.length; i++) {
        let lowestOrderIndex = -1;
        let lowestOrder = Infinity;


        for (let j = 0; j < cards.length; j++) {
            if (!usedIndices.has(j) && cards[j].order < lowestOrder) {
                lowestOrder = cards[j].order;
                lowestOrderIndex = j;
            }
        }

        if (lowestOrderIndex !== -1) {
            newCardsArray.push(cards[lowestOrderIndex]);
            usedIndices.add(lowestOrderIndex);
        }
    }

    return newCardsArray;
}

function scoreHand() {
    const handObject = cardData.hands.find(handType => handType.name === cardData.currentHand.handType);
    if (!cardData.currentHand.allCards || !handObject) return;

    cardData.currentHand.items.chips = handObject.chips;
    cardData.currentHand.items.mult = handObject.mult;


    cardData.currentHand.allCards.forEach(card => {
        scoreCard(card, false);
    });

    var inactiveCardsArray: Card[] = [];

    cards.hand.inactive.forEach(card => {
        const inactiveCard: Card | undefined = cards.hand.all.find(currentCard => currentCard.DOMObject === card.DOMObject)
        if (!inactiveCard) return;
        inactiveCardsArray.push(inactiveCard);
    });

    const sortedInactiveCardsArray = sortByOrder(inactiveCardsArray);

    if (sortedInactiveCardsArray) {
        sortedInactiveCardsArray.forEach(card => {
            scoreCard(card, false);
        });
    }




    type itemsType = typeof cardData.currentHand.items;
    const items: itemsType = cardData.currentHand.items;


    var score: number = Number((items.chips * items.mult).toFixed(0))
    items.chips = Number((items.chips).toFixed(2));
    items.mult = Number((items.mult).toFixed(2));



    const chips: string = formatValue(items.chips);
    const mult: string = formatValue(items.mult);
    const finalScore: string = formatValue(score);

    const chipsDOMObject: HTMLElement | null = document.getElementById("chipsAmount");
    const multDOMObject: HTMLElement | null = document.getElementById("multAmount");
    const finalScoreDOMObject: HTMLElement | null = document.getElementById("finalScore");
    const tarotDOMObject: HTMLElement | null = document.getElementById("tarotAmount");
    const planetDOMObject: HTMLElement | null = document.getElementById("planetAmount");
    const moneyDOMObject: HTMLElement | null = document.getElementById("moneyAmount");

    const itemData = [
        ["Chips", chipsDOMObject, chips],
        ["Mult", multDOMObject, mult],
        ["Score", finalScoreDOMObject, finalScore],
        ["Tarots", tarotDOMObject, items.tarot],
        ["Planets", planetDOMObject, items.planet],
        ["Money", moneyDOMObject, items.money]
    ]

    for (let i = 0; i < itemData.length; i++) {
        var name = itemData[i][0];
        var DOMObject = itemData[i][1];
        var amount = itemData[i][2];


        if (!amount || !name || !DOMObject || typeof DOMObject !== "object") continue;


        amount = amount.toString();

        DOMObject.innerHTML = `${name}: <br>${amount}`

    }

}

function scoreCard(card: Card, isRepeated: boolean) {

    const isDebuffed = card.modifiers[2] !== -1 && cardData.modifiers.all.editions[card.modifiers[2]].name === "debuffed";

    if (!card || !cardData.currentHand.allCards || isDebuffed) return;

    if (cardData.currentHand.allCards.findIndex(currentCard => currentCard === card) !== -1) {
        cardData.currentHand.items.chips += cardData.cardValues[card.number];
    }



    for (let i = 0; i < card.modifiers.length; i++) {

        if (card.modifiers[i] !== -1) {

            const items = cardData.currentHand.items;
            const cardDataModifiersAsArray = Object.values(cardData.modifiers.all);
            const cardDataModifier = Object.values(cardDataModifiersAsArray[i])[card.modifiers[i]];
            const isLucky: boolean = (cardDataModifier.name === "lucky");

            type ItemKey = keyof typeof items;

            if (!cardDataModifier) return;

            var isCondition: number = -1;

            const includesInPlay: boolean = cardDataModifier.condition.includes("inPlay");
            const includesInHand: boolean = cardDataModifier.condition.includes("inHand");

            if (includesInPlay && includesInHand) {
                var isConditionA: number = cardData.currentHand.allCards.findIndex(currentCard => currentCard === card);
                var isConditionB: number = isCondition = cards.hand.inactive.findIndex(currentCard => currentCard.DOMObject === card.DOMObject);

                if (isConditionA !== -1) isCondition = isConditionA;
                if (isConditionB !== -1) isCondition = isConditionB;
                if (isConditionA === -1 && isConditionB === -1) isCondition = -1;

            } else if (cardDataModifier.condition.includes("inPlay")) {
                isCondition = cardData.currentHand.allCards.findIndex(currentCard => currentCard === card);
            } else if (cardDataModifier.condition.includes("inHand")) {
                isCondition = cards.hand.inactive.findIndex(currentCard => currentCard.DOMObject === card.DOMObject);
            }

            if (isCondition === -1) continue;


            if (isLucky) {
                const luckyModifier = cardData.modifiers.all.enhancements.find(modifier => modifier.name === "lucky");
                if (!luckyModifier) return;
                const value1: number | undefined = luckyModifier.amount;
                const value2: number | undefined = luckyModifier.amount2;
                const chance1: number | undefined = luckyModifier.chance;
                const chance2: number | undefined = luckyModifier.chance2;
                const type1: string | undefined = luckyModifier.type;
                const type2: string | undefined = luckyModifier.type2;

                if (!value1 || !value2 || !chance1 || !chance2 || !type1 || !type2) return;

                items[type1 as ItemKey] += randomEvent(value1, chance1, type1).avg;
                items[type2 as ItemKey] += randomEvent(value2, chance2, type2).avg;

            } else if (cardDataModifier.type !== "xMult" && cardDataModifier.type) {
                if (!cardDataModifier.amount) return;
                items[cardDataModifier.type as ItemKey] += cardDataModifier.amount;
            } else if (cardDataModifier.type === "xMult") {
                if (!cardDataModifier.amount) return;
                items["mult" as ItemKey] *= cardDataModifier.amount;
            }


            if (cardDataModifier.name === "red" && !isRepeated) {
                scoreCard(card, true);
            }


        }
    }


    return;
}

export function restartValues() {
    Object.keys(cardData.currentHand.items).forEach(key => {
        cardData.currentHand.items[key as keyof typeof cardData.currentHand.items] = 0;
    });

    cardData.currentHand.allCards = null;
    cardData.currentHand.handType = "High Card";

    const valuesDOM: NodeListOf<HTMLElement> = document.querySelectorAll(".values");
    const handTypeDOM: HTMLElement | null = document.getElementById("handType");
    if (!valuesDOM || !handTypeDOM) return;

    const itemNames: string[] = ["Chips", "Mult", "Score", "Tarots", "Money", "Planets"]

    let i: number = 0;

    valuesDOM.forEach(element => {
        element.innerHTML = `${itemNames[i]}: <br> 0`;

        i++;
    });

    handTypeDOM.innerHTML = cardData.currentHand.handType;
}

function formatValue(value: number) {
    if (value >= cardData.scientificNotationThreshold) {
        var newValue: string = value.toExponential(3);
        var indexOfPlus: number = newValue.indexOf("+");

        newValue = newValue.substring(0, indexOfPlus) + newValue.substring(indexOfPlus + 1);

        return newValue;
    }

    return value.toLocaleString();
}

function randomEvent(amount: number, chance: number, type: string) {
    const avg: number = amount * chance;
    const median: number = (chance >= 1 / 2) ? amount : 0;

    const object = { avg: avg, median: median, max: amount, type: type };

    return object;
}