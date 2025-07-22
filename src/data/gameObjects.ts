
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

  

  modifiers: {
    enhancements: ['bonus', 'mult', 'wild', 'glass', 'steel', 'stone', 'gold', 'lucky'] as string[],
    seals: ['gold', 'red', 'blue', 'purple'] as string[],
    editions: ['foil', 'holographic', 'polychrome'] as string[],
    chosenModifiersArr: [-1, -1, -1] as number[], // Enhancement, Seal, Edition

    all: [
      ['bonus', 'mult', 'wild', 'glass', 'steel', 'stone', 'gold', 'lucky'],
      ['gold', 'red', 'blue', 'purple'],
      ['foil', 'holographic', 'polychrome'] 
    ] as string[][]
  },




    


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

