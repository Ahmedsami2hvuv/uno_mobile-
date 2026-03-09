import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Modal, Alert } from 'react-native';
import UnoLogic from '../logic/unoLogic';
import strings from '../strings';

const PLAYER = 0;
const BOT = 1;
const COLORS = ['🔴', '🟡', '🟢', '🔵'];

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12, backgroundColor: '#0f1419' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  status: { fontSize: 14, color: '#8899a6' },
  colorText: { fontSize: 16, color: '#e7e9ea' },
  opponentArea: { alignItems: 'center', marginBottom: 16 },
  opponentName: { fontSize: 16, color: '#e7e9ea', marginBottom: 8 },
  opponentCards: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 4 },
  cardBack: { width: 36, height: 50, backgroundColor: '#2a3f5f', borderRadius: 6, borderWidth: 1, borderColor: '#38444d' },
  centerPile: { alignItems: 'center', marginVertical: 16 },
  topCard: { minWidth: 70, minHeight: 98, backgroundColor: '#1a2332', borderRadius: 10, borderWidth: 2, borderColor: '#38444d', justifyContent: 'center', alignItems: 'center', padding: 8 },
  topCardText: { fontSize: 18, color: '#e7e9ea', textAlign: 'center' },
  pileLabel: { fontSize: 12, color: '#8899a6', marginTop: 4 },
  playerArea: { flex: 1 },
  playerName: { fontSize: 16, color: '#e7e9ea', marginBottom: 8 },
  handScroll: { maxHeight: 120, marginBottom: 12 },
  handRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 6 },
  card: { minWidth: 52, minHeight: 72, backgroundColor: '#1a2332', borderRadius: 8, borderWidth: 2, borderColor: '#38444d', justifyContent: 'center', alignItems: 'center', padding: 6 },
  cardPlayable: { borderColor: '#00ba7c', borderWidth: 2 },
  cardDisabled: { opacity: 0.5 },
  cardText: { fontSize: 13, color: '#e7e9ea', textAlign: 'center' },
  actions: { flexDirection: 'row', justifyContent: 'center', gap: 12 },
  btn: { paddingVertical: 12, paddingHorizontal: 20, borderRadius: 10, backgroundColor: '#38444d' },
  btnUno: { backgroundColor: '#f4212e' },
  btnText: { color: '#e7e9ea', fontSize: 15 },
  message: { marginTop: 12, padding: 12, backgroundColor: '#1a2332', borderRadius: 10, alignItems: 'center' },
  messageText: { color: '#e7e9ea', fontSize: 14 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', padding: 24 },
  modalBox: { backgroundColor: '#1a2332', borderRadius: 14, padding: 24, borderWidth: 1, borderColor: '#38444d' },
  modalTitle: { fontSize: 18, color: '#e7e9ea', marginBottom: 16, textAlign: 'center' },
  colorRow: { flexDirection: 'row', justifyContent: 'center', gap: 16, marginTop: 8 },
  colorBtn: { width: 56, height: 56, borderRadius: 28, borderWidth: 3, borderColor: '#38444d', justifyContent: 'center', alignItems: 'center' },
  challengeRow: { flexDirection: 'row', justifyContent: 'center', gap: 12, marginTop: 16 },
});

function initGame() {
  const deck = UnoLogic.generateDeck();
  const hands = UnoLogic.dealHands(deck, 2, 7);
  const topCard = UnoLogic.getFirstTopCard(deck);
  const topColor = UnoLogic.getCardColor(topCard) || COLORS[0];
  return {
    deck,
    hands,
    topCard,
    currentColor: topColor,
    turn: PLAYER,
    saidUno: [false, false],
    pendingDraw: 0,
    lastTopBeforePlus4: null,
    gameOver: false,
  };
}

function applyTopCardEffect(state, card) {
  if (UnoLogic.isPlus2(card)) {
    state.pendingDraw = (state.pendingDraw || 0) + 2;
  } else if (card.includes('🚫') || card.includes('🔄')) {
    state.turn = state.turn === PLAYER ? BOT : PLAYER;
    state.turn = state.turn === PLAYER ? BOT : PLAYER;
  }
}

export default function GameScreen({ navigation }) {
  const [state, setState] = useState(initGame);
  const [message, setMessage] = useState(strings.chooseCardOrDraw);
  const [colorModal, setColorModal] = useState({ show: false, isPlus4: false });
  const [challengeModal, setChallengeModal] = useState(false);

  const renderGame = useCallback(() => {
    setState(s => ({ ...s }));
  }, []);

  const botTurn = useCallback(() => {
    setState(s => {
      if (s.gameOver) return s;
      const hand = [...s.hands[BOT]];
      const deck = [...s.deck];

      if (s.pendingDraw > 0) {
        for (let i = 0; i < s.pendingDraw; i++) {
          if (deck.length) hand.push(deck.shift());
        }
        setMessage(`البوت سحب ${s.pendingDraw} ورقة.`);
        return { ...s, hands: [s.hands[PLAYER], hand], deck, pendingDraw: 0, turn: PLAYER };
      }

      const result = UnoLogic.aiChooseCard(hand, s.topCard, s.currentColor);
      if (result.action === 'draw') {
        if (deck.length) hand.push(deck.shift());
        setMessage('البوت سحب ورقة.');
        return { ...s, hands: [s.hands[PLAYER], hand], deck, turn: PLAYER };
      }

      const card = result.card;
      const idx = hand.indexOf(card);
      if (idx === -1) return s;
      hand.splice(idx, 1);
      const newTop = card;

      if (hand.length === 0) {
        const pts = UnoLogic.calculatePoints(s.hands[PLAYER]);
        setMessage(`البوت فاز! عندك ${pts} نقطة.`);
        return { ...s, hands: [s.hands[PLAYER], hand], topCard: newTop, gameOver: true };
      }

      if (UnoLogic.isPlus4(card)) {
        const newColor = UnoLogic.aiChooseColor(hand);
        setState(prev => ({ ...prev, currentColor: newColor }));
        setChallengeModal(true);
        return { ...s, hands: [s.hands[PLAYER], hand], deck, topCard: newTop, lastTopBeforePlus4: s.topCard, currentColor: newColor };
      }
      if (UnoLogic.isWildColor(card)) {
        const newColor = UnoLogic.aiChooseColor(hand);
        applyTopCardEffect(s, card);
        return { ...s, hands: [s.hands[PLAYER], hand], deck, topCard: newTop, currentColor: newColor, turn: PLAYER };
      }
      applyTopCardEffect(s, card);
      const newColor = UnoLogic.getCardColor(card) || s.currentColor;
      return { ...s, hands: [s.hands[PLAYER], hand], deck, topCard: newTop, currentColor: newColor, turn: PLAYER };
    });
    setTimeout(() => {
      setMessage('دورك.');
      renderGame();
    }, 600);
  }, [renderGame]);

  React.useEffect(() => {
    if (state.turn === BOT && !state.gameOver && !challengeModal && !colorModal.show) {
      const t = setTimeout(botTurn, 800);
      return () => clearTimeout(t);
    }
  }, [state.turn, state.gameOver, challengeModal, colorModal.show]);

  const onPlayCard = (card) => {
    if (state.turn !== PLAYER || state.gameOver) return;
    if (!UnoLogic.canPlay(card, state.topCard, state.currentColor)) return;

    const handCopy = [...state.hands[PLAYER]];
    const idx = handCopy.indexOf(card);
    if (idx === -1) return;
    handCopy.splice(idx, 1);

    if (handCopy.length === 1 && !state.saidUno[PLAYER]) {
      setState(s => ({ ...s, saidUno: [true, s.saidUno[1]] }));
      setMessage('قلت أونو! ✅');
    }
    if (handCopy.length === 0) {
      const pts = UnoLogic.calculatePoints(state.hands[BOT]);
      setMessage(`🎉 فزت! البوت يملك ${pts} نقطة.`);
      setState(s => ({ ...s, hands: [handCopy, s.hands[BOT]], topCard: card, gameOver: true }));
      return;
    }

    if (UnoLogic.isPlus4(card)) {
      setState(s => ({ ...s, hands: [handCopy, s.hands[BOT]], topCard: card, lastTopBeforePlus4: s.topCard }));
      setColorModal({ show: true, isPlus4: true });
      return;
    }
    if (UnoLogic.isWildColor(card)) {
      setState(s => ({ ...s, hands: [handCopy, s.hands[BOT]], topCard: card }));
      setColorModal({ show: true, isPlus4: false });
      return;
    }

    applyTopCardEffect(state, card);
    const newColor = UnoLogic.getCardColor(card) || state.currentColor;
    const nextTurn = (card.includes('🚫') || card.includes('🔄')) ? PLAYER : BOT;
    setState(s => ({ ...s, hands: [handCopy, s.hands[BOT]], topCard: card, currentColor: newColor, turn: nextTurn }));
    setMessage(nextTurn === BOT ? 'دور البوت...' : 'البوت تخطى — دورك مرة أخرى.');
    if (nextTurn === BOT) setTimeout(botTurn, 800);
  };

  const onChooseColor = (color, isPlus4) => {
    setColorModal({ show: false, isPlus4: false });
    setState(s => {
      const next = { ...s, currentColor: color };
      if (isPlus4) {
        const botHand = [...s.hands[BOT]];
        const deck = [...s.deck];
        for (let i = 0; i < 4 && deck.length; i++) botHand.push(deck.shift());
        next.hands = [s.hands[PLAYER], botHand];
        next.deck = deck;
        next.turn = PLAYER;
        setMessage('البوت سحب 4 ورقات. دورك.');
      } else {
        next.turn = BOT;
        setMessage('دور البوت...');
        setTimeout(botTurn, 800);
      }
      return next;
    });
  };

  const resolveChallenge = (doChallenge) => {
    setChallengeModal(false);
    setState(s => {
      const botHand = s.hands[BOT];
      const prevColor = s.lastTopBeforePlus4 ? UnoLogic.getCardColor(s.lastTopBeforePlus4) : null;
      const botHadMatching = prevColor && botHand.some(c => UnoLogic.getCardColor(c) === prevColor);

      if (doChallenge && botHadMatching) {
        const newBotHand = [...s.hands[BOT]];
        const deck = [...s.deck];
        for (let i = 0; i < 6 && deck.length; i++) newBotHand.push(deck.shift());
        setMessage('البوت غش! سحب 6 ورقات. دورك.');
        return { ...s, hands: [s.hands[PLAYER], newBotHand], deck, turn: PLAYER, lastTopBeforePlus4: null };
      }
      if (doChallenge && !botHadMatching) {
        const newPlayerHand = [...s.hands[PLAYER]];
        const deck = [...s.deck];
        for (let i = 0; i < 4 && deck.length; i++) newPlayerHand.push(deck.shift());
        setMessage('التحدي فشل. سحبت 4 ورقات. دور البوت.');
        return { ...s, hands: [newPlayerHand, s.hands[BOT]], deck, turn: BOT, lastTopBeforePlus4: null };
      }
      const newPlayerHand = [...s.hands[PLAYER]];
      const deck = [...s.deck];
      for (let i = 0; i < 4 && deck.length; i++) newPlayerHand.push(deck.shift());
      setMessage('سحبت 4 ورقات. دور البوت.');
      return { ...s, hands: [newPlayerHand, s.hands[BOT]], deck, turn: BOT, lastTopBeforePlus4: null };
    });
  };

  const onDraw = () => {
    if (state.turn !== PLAYER || state.gameOver) return;
    if (state.deck.length === 0) return;
    const newDeck = [...state.deck];
    const newHand = [...state.hands[PLAYER], newDeck.shift()];
    setState(s => ({ ...s, hands: [newHand, s.hands[BOT]], deck: newDeck, turn: BOT }));
    setMessage('سحبت ورقة. دور البوت...');
    setTimeout(botTurn, 800);
  };

  const onUno = () => {
    if (state.turn === PLAYER && state.hands[PLAYER].length === 1) {
      setState(s => ({ ...s, saidUno: [true, s.saidUno[1]] }));
      setMessage('أونو! ✅');
    }
  };

  const playable = state.turn === PLAYER && !state.gameOver
    ? UnoLogic.getPlayableCards(state.hands[PLAYER], state.topCard, state.currentColor)
    : [];

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.status}>{state.turn === PLAYER ? strings.yourTurn : strings.botTurn}</Text>
        <Text style={styles.colorText}>{strings.currentColor} {state.currentColor}</Text>
      </View>

      <View style={styles.opponentArea}>
        <Text style={styles.opponentName}>البوت 🤖</Text>
        <View style={styles.opponentCards}>
          {state.hands[BOT].map((_, i) => <View key={i} style={styles.cardBack} />)}
        </View>
        <Text style={styles.status}>{state.hands[BOT].length} ورقة</Text>
      </View>

      <View style={styles.centerPile}>
        <View style={styles.topCard}>
          <Text style={styles.topCardText}>{state.topCard}</Text>
        </View>
        <Text style={styles.pileLabel}>الورقة النازلة</Text>
      </View>

      <View style={styles.playerArea}>
        <Text style={styles.playerName}>أنت</Text>
        <ScrollView style={styles.handScroll} horizontal contentContainerStyle={styles.handRow}>
          {state.hands[PLAYER].map((card, i) => {
            const canPlay = playable.includes(card);
            const disabled = state.turn === PLAYER && !state.gameOver && !canPlay;
            return (
              <TouchableOpacity
                key={`${card}-${i}`}
                style={[styles.card, canPlay && styles.cardPlayable, disabled && styles.cardDisabled]}
                onPress={() => onPlayCard(card)}
                disabled={disabled}
              >
                <Text style={styles.cardText} numberOfLines={2}>{card}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.btn} onPress={onDraw} disabled={state.turn !== PLAYER || state.gameOver}>
            <Text style={styles.btnText}>{strings.drawCard}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, styles.btnUno]} onPress={onUno}>
            <Text style={styles.btnText}>{strings.unoButton}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.message}>
        <Text style={styles.messageText}>{message}</Text>
        {state.gameOver && (
          <TouchableOpacity
            style={[styles.btn, { marginTop: 12 }]}
            onPress={() => {
              setState(initGame());
              setMessage(strings.chooseCardOrDraw);
            }}
          >
            <Text style={styles.btnText}>{strings.playAgain}</Text>
          </TouchableOpacity>
        )}
      </View>

      <Modal visible={colorModal.show} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>اختر اللون</Text>
            <View style={styles.colorRow}>
              {COLORS.map(c => (
                <TouchableOpacity key={c} style={styles.colorBtn} onPress={() => onChooseColor(c, colorModal.isPlus4)}>
                  <Text style={{ fontSize: 28 }}>{c}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={challengeModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>البوت لعب جوكر +4. هل تتحدى؟</Text>
            <View style={styles.challengeRow}>
              <TouchableOpacity style={styles.btn} onPress={() => resolveChallenge(true)}>
                <Text style={styles.btnText}>تحدي</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btn} onPress={() => resolveChallenge(false)}>
                <Text style={styles.btnText}>قبول السحب</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
