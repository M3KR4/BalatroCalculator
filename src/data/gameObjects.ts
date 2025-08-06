
export type Card = {
  DOMObject: HTMLElement,
  order: number,
  number: number,
  suit: number,
  modifiers: number[] // Enhancement, Seal, Edition
}

export type CardId = {
  DOMObject: HTMLElement
}

export function radnom(min: number, max: number) {
  return Number((Math.random() * (max + min)).toFixed());
}

export const jokers = {
  active: {
    amounts: {
      all: 0 as number,
      common: 0 as number,
      uncommon: 0 as number,
      rare: 0 as number
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

    names: [] as string[]
  }
};

export const cardData = {
  numerals: ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'] as string[],
  cardValues: [2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 11] as number[],
  suits: ['hearts', 'clubs', 'diamonds', 'spades'] as string[],
  sortNumber: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14] as number[],
  sortSuit: [1, 2, 3, 0] as number[],
  scientificNotationThreshold: Math.pow(10, 11) as number,


  modifiers: {
    enhancements: ["bonus", "mult", "wild", "glass", "steel", "stone", "gold", "lucky"] as string[],
    seals: ["gold", "red", "blue", "purple"] as string[],
    editions: ["foil", "holographic", "polychrome", "debuffed"] as string[],
    chosenModifiersArr: [-1, -1, -1] as number[], // Enhancement, Seal, Edition


    all: {
      enhancements: [{ name: "bonus", amount: 30, type: "chips", condition: "inPlay" }, { name: "mult", amount: 4, type: "mult", condition: "inPlay" }, { name: "wild", condition: "inPlay" }, { name: "glass", amount: 2, type: "xMult", condition: "inPlay" }, { name: "steel", amount: 1.5, type: "xMult", condition: "inHand" }, { name: "stone", amount: 50, type: "chips", condition: "inPlay" }, { name: "gold", amount: 3, type: "money", condition: "inHand" }, { name: "lucky", amount: 20, type: "mult", chance: 1 / 5, amount2: 20, type2: "money", chance2: 1 / 20, condition: "inPlay" }],
      seals: [{ name: "gold", amount: 3, type: "money", condition: "inPlay" }, { name: "red", condition: "inPlay inHand" }, { name: "blue", amount: 1, type: "planet", condition: "inHand" }, { name: "purple", amount: 1, type: "tarot", condition: "inDiscard" }],
      editions: [{ name: "foil", amount: 50, type: "chips", condition: "inPlay" }, { name: "holographic", amount: 10, type: "mult", condition: "inPlay" }, { name: "polychrome", amount: 1.5, type: "xMult", condition: "inPlay" }, { name: "debuffed", amount: 0, type: "", condition: "inPlay inHand"}]
    }
  },

  currentHand: {
    handType: "High Card" as string,
    allCards: null as Card[] | null,
    items: {
      chips: 0 as number,
      mult: 0 as number,
      money: 0 as number,
      tarot: 0 as number,
      planet: 0 as number,
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
    enhancement: null as HTMLElement | null,
    seal: null as HTMLElement | null,
    edition: null as HTMLElement | null
  },

};





export const cards: {
  hand: {
    inactive: CardId[],
    active: CardId[],
    all: Card[],
  }
} = {
  hand: {
    inactive: [],
    active: [],
    all: [],
  }
};

export const urls = {
  cardNumerals: '../images/cards' as string,
  modifiers: '../images/modifiers' as string,
  baseCardBackground: "../images/cards/background/cardBackground.png" as string
};

