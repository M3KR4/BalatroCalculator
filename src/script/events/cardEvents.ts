import { cardHeldEvent, cards } from "../../data/gameObjects.js";
import { updateCardType } from "../handScoring.js";
import { removeCardObject, selectCard, deselectCard } from "../cards.js";

function moveCard(card: HTMLElement, event: MouseEvent) {
  const mousePosition = { x: event.clientX, y: event.clientY }
  const documentSize = { width: document.documentElement.clientWidth, height: document.documentElement.clientHeight };
  const cardSize = { width: card.clientWidth, height: card.clientHeight };

  card.style.position = "absolute";
  card.style.zIndex = "1000";

  card.style.right = `${-mousePosition.x + documentSize.width - cardSize.width / 2}px`;
  card.style.top = `${mousePosition.y - cardSize.height / 2}px`;

  const nextSibling: HTMLElement | null = card.nextSibling as HTMLElement;
  const previousSibling: HTMLElement | null = card.previousSibling as HTMLElement;

  const currCard = cards.hand.all.find(object => object.DOMObject === card);
  var nextCard;

  if (nextSibling && nextSibling.getBoundingClientRect().x < card.getBoundingClientRect().x) {
    nextSibling.after(card);
    nextCard = cards.hand.all.find(object => object.DOMObject === nextSibling);
  }

  if (previousSibling && previousSibling.getBoundingClientRect().x > card.getBoundingClientRect().x) {
    previousSibling.before(card);
    nextCard = cards.hand.all.find(object => object.DOMObject === previousSibling);
  }


  if (nextCard && currCard) {
    const currCardOrder = currCard.order;
    const nextCardOrder = nextCard.order;

    currCard.order = nextCardOrder;
    nextCard.order = currCardOrder;

    updateCardType();

  }
}



function addCardHeldEvent(div: HTMLDivElement) {

  div.addEventListener('mousedown', function () {
    if (cardHeldEvent.mouseHeldTimer !== null) clearTimeout(cardHeldEvent.mouseHeldTimer);
    cardHeldEvent.cardIsHeld = false;

    cardHeldEvent.mouseHeldTimer = setTimeout(() => {
      cardHeldEvent.cardIsHeld = true;
    }, cardHeldEvent.cardHeldTime);

    cardHeldEvent.cardHeldHandler = (e: MouseEvent) => {
      if (!cardHeldEvent.cardIsHeld) return;

      moveCard(div, e);
    };

    document.addEventListener('mousemove', cardHeldEvent.cardHeldHandler);


    document.addEventListener("mouseup", function (e) {
      if (cardHeldEvent.cardHeldHandler) document.removeEventListener('mousemove', cardHeldEvent.cardHeldHandler);
      div.style.position = "static";
      div.style.zIndex = "0";
      div.style.transform = "scale(1.00)"
    })
  });


  return div;
}

function addCardRemovalEvent(div: HTMLDivElement) {
  div.addEventListener('contextmenu', function (e) {
    e.preventDefault();
    div.remove();
    removeCardObject(div);
  });

  return div;
}

function addCardSelectionEvent(div: HTMLDivElement) {
  div.addEventListener('mouseup', function (e) {
    if (e.button !== 0) return;

    if (cardHeldEvent.cardIsHeld) {
      cardHeldEvent.cardIsHeld = false;
      return;
    }

    cardHeldEvent.cardIsClicked = true;

    const limitExceeded = cards.hand.active.length >= 5;

    if (!div.className.includes('pickedCards') && !limitExceeded) {
      selectCard(div);
    } else if (div.className.includes('pickedCards')) {
      deselectCard(div);
    }

    return;
  });

  return div;
}

export function addEventsToCard(card: HTMLDivElement) {

  card = addCardHeldEvent(card);
  card = addCardRemovalEvent(card);
  card = addCardSelectionEvent(card);


  return card;
}
