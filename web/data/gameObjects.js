export function radnom(min, max) {
    return Number((Math.random() * (max + min)).toFixed());
}
export const cardData = {
    numerals: ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'],
    cardValues: [2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 11],
    suits: ['hearts', 'clubs', 'diamonds', 'spades'],
    sortNumber: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
    sortSuit: [1, 2, 3, 0],
    scientificNotationThreshold: Math.pow(10, 11),
    cardWidthInVh: 9.49,
    modifiers: {
        enhancements: ["bonus", "mult", "wild", "glass", "steel", "stone", "gold", "lucky"],
        seals: ["gold", "red", "blue", "purple"],
        editions: ["foil", "holographic", "polychrome", "debuffed"],
        chosenModifiersArr: [-1, -1, -1], // Enhancement, Seal, Edition
        all: {
            enhancements: [{ name: "bonus", amount: 30, type: "chips", condition: "inPlay" }, { name: "mult", amount: 4, type: "mult", condition: "inPlay" }, { name: "wild", condition: "inPlay" }, { name: "glass", amount: 2, type: "xMult", condition: "inPlay" }, { name: "steel", amount: 1.5, type: "xMult", condition: "inHand" }, { name: "stone", amount: 50, type: "chips", condition: "inPlay" }, { name: "gold", amount: 3, type: "money", condition: "inHand" }, { name: "lucky", amount: 20, type: "mult", chance: 1 / 5, amount2: 20, type2: "money", chance2: 1 / 20, condition: "inPlay" }],
            seals: [{ name: "gold", amount: 3, type: "money", condition: "inPlay" }, { name: "red", condition: "inPlay inHand" }, { name: "blue", amount: 1, type: "planet", condition: "inHand" }, { name: "purple", amount: 1, type: "tarot", condition: "inDiscard" }],
            editions: [{ name: "foil", amount: 50, type: "chips", condition: "inPlay" }, { name: "holographic", amount: 10, type: "mult", condition: "inPlay" }, { name: "polychrome", amount: 1.5, type: "xMult", condition: "inPlay" }, { name: "debuffed", amount: 0, type: "", condition: "inPlay inHand" }]
        }
    },
    currentHand: {
        handType: "High Card",
        allCards: null,
        items: {
            chips: 0,
            mult: 0,
            money: 0,
            tarot: 0,
            planet: 0,
        }
    },
    hands: [
        { name: "High Card", chips: 5, mult: 1, cardAmount: 1 },
        { name: "Pair", chips: 10, mult: 2, cardAmount: 2 },
        { name: "Two Pair", chips: 20, mult: 2, cardAmount: 4 },
        { name: "Three Of A Kind", chips: 30, mult: 3, cardAmount: 3 },
        { name: "Straight", chips: 30, mult: 4, cardAmount: 5 },
        { name: "Flush", chips: 35, mult: 4, cardAmount: 5 },
        { name: "Full House", chips: 40, mult: 4, cardAmount: 5 },
        { name: "Four Of A Kind", chips: 60, mult: 7, cardAmount: 5 },
        { name: "Straight Flush", chips: 100, mult: 8, cardAmount: 5 },
        { name: "Royal Flush", chips: 100, mult: 8, cardAmount: 5 },
        { name: "Five Of A Kind", chips: 120, mult: 12, cardAmount: 5 },
        { name: "Flush House", chips: 140, mult: 14, cardAmount: 5 },
        { name: "Flush Five", chips: 160, mult: 16, cardAmount: 5 },
    ],
    lastSelectedModifiersDOM: {
        enhancement: null,
        seal: null,
        edition: null
    },
};
export const cards = {
    hand: {
        inactive: [],
        active: [],
        all: [],
    }
};
export const urls = {
    cardNumerals: '../images/cards',
    modifiers: '../images/modifiers',
    baseCardBackground: "../images/cards/background/cardBackground.png"
};
export const cardHeldEvent = {
    cardIsHeld: false,
    cardIsClicked: false,
    isMoved: false,
    eventExists: false,
    cardHeldTime: 100,
    mouseHeldTimer: null,
    cardHeldHandler: null,
};
export const documentData = {
    mouseIsMoving: false,
    mouseStopTime: 100,
    mousePosition: { x: 0, y: 0 }
};
