/**
 * منطق لعبة أونو — مطابق لفكرة بوت التليجرام
 */
const COLORS = ['🔴', '🟡', '🟢', '🔵'];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateDeck() {
  const deck = [];
  for (const color of COLORS) {
    deck.push(`${color} 0`);
    for (let i = 1; i <= 9; i++) {
      deck.push(`${color} ${i}`, `${color} ${i}`);
    }
    deck.push(`${color} 🚫`, `${color} 🚫`, `${color} 🔄`, `${color} 🔄`, `${color} +2`, `${color} +2`);
  }
  deck.push('💧 +1', '🌊 +2');
  for (let i = 0; i < 4; i++) {
    deck.push('🔥 جوكر+4', '🌈 جوكر ألوان');
  }
  return shuffle(deck);
}

function dealHands(deck, numPlayers = 2, cardsPerPlayer = 7) {
  const hands = Array.from({ length: numPlayers }, () => []);
  for (let c = 0; c < cardsPerPlayer; c++) {
    for (let p = 0; p < numPlayers; p++) {
      if (deck.length) hands[p].push(deck.shift());
    }
  }
  return hands;
}

function getFirstTopCard(deck) {
  for (let i = 0; i < deck.length; i++) {
    if (!deck[i].includes('🔥')) {
      const card = deck.splice(i, 1)[0];
      return card;
    }
  }
  return deck.shift();
}

function getCardColor(card) {
  const first = card.split(' ')[0];
  if (['🔴', '🟡', '🟢', '🔵'].includes(first)) return first;
  return null;
}

function canPlay(card, topCard, currentColor) {
  if (currentColor === 'ANY') return true;
  if (card.includes('🌈') || card.includes('🔥')) return true;
  const parts = card.split(' ');
  if (parts.length < 2) return false;
  const [cColor, cValue] = parts;
  if (cColor === currentColor) return true;
  const topParts = topCard.split(' ');
  const topValue = topParts[1] || topParts[0];
  return cValue === topValue;
}

function isPlus4(card) {
  return card.includes('🔥');
}
function isWildColor(card) {
  return card.includes('🌈');
}
function isPlus2(card) {
  return card.includes('+2') && !card.includes('🔥');
}

function calculatePoints(hand) {
  let total = 0;
  for (const card of hand) {
    if (card.includes('🌈') || card.includes('🔥') || card.includes('💧') || card.includes('🌊')) total += 50;
    else if (card.includes('🚫') || card.includes('🔄') || card.includes('+2')) total += 20;
    else {
      const m = card.match(/\d+/);
      total += m ? parseInt(m[0], 10) : 10;
    }
  }
  return total;
}

function getPlayableCards(hand, topCard, currentColor) {
  return hand.filter(card => canPlay(card, topCard, currentColor));
}

function aiChooseCard(hand, topCard, currentColor) {
  const playable = getPlayableCards(hand, topCard, currentColor);
  if (playable.length === 0) return { action: 'draw' };
  const preferAction = playable.find(c => c.includes('🔥') || c.includes('🌈'));
  const preferPlus2 = playable.find(c => isPlus2(c));
  const card = preferAction || preferPlus2 || playable[Math.floor(Math.random() * playable.length)];
  return { action: 'play', card };
}

function aiChooseColor(hand) {
  const count = { '🔴': 0, '🟡': 0, '🟢': 0, '🔵': 0 };
  hand.forEach(card => {
    const c = getCardColor(card);
    if (c) count[c]++;
  });
  let max = 0, chosen = COLORS[0];
  COLORS.forEach(c => {
    if (count[c] > max) { max = count[c]; chosen = c; }
  });
  return chosen;
}

export default {
  COLORS,
  generateDeck,
  shuffle,
  dealHands,
  getFirstTopCard,
  canPlay,
  getCardColor,
  isPlus4,
  isWildColor,
  isPlus2,
  calculatePoints,
  getPlayableCards,
  aiChooseCard,
  aiChooseColor,
};
