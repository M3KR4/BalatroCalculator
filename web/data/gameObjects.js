export const jokers = {
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
export const cardData = {
    numerals: ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'],
    cardValues: [2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 11],
    suits: ['hearts', 'clubs', 'diamonds', 'spades'],
    sortNumber: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
    sortSuit: [1, 2, 3, 0],
    modifiers: {
        enhancements: ['bonus', 'mult', 'wild', 'glass', 'steel', 'stone', 'gold', 'lucky'],
        seals: ['gold', 'red', 'blue', 'purple'],
        editions: ['foil', 'holographic', 'polychrome'],
        chosenModifiersArr: [-1, -1, -1], // Enhancement, Seal, Edition
        all: [
            ['bonus', 'mult', 'wild', 'glass', 'steel', 'stone', 'gold', 'lucky'],
            ['gold', 'red', 'blue', 'purple'],
            ['foil', 'holographic', 'polychrome']
        ]
    },
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
