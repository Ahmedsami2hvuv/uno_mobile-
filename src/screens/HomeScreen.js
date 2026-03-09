import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import strings from '../strings';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0e14',
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  safe: {
    flex: 1,
  },
  logoCard: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a2332',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#2d3a4d',
    paddingVertical: 24,
    paddingHorizontal: 20,
    marginBottom: 20,
    marginTop: 8,
  },
  logoEmoji: { fontSize: 48, marginBottom: 8 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#e7e9ea', textAlign: 'center', marginBottom: 4 },
  tagline: { fontSize: 13, color: '#8899a6', textAlign: 'center', lineHeight: 20, maxWidth: 280 },
  botBadge: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#15202b',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    gap: 6,
  },
  botBadgeText: { fontSize: 12, color: '#1d9bf0', fontWeight: '600' },
  menuTitle: {
    fontSize: 16,
    color: '#8899a6',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 12,
    paddingVertical: 16,
    paddingHorizontal: 18,
    backgroundColor: '#1a2332',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#38444d',
    marginBottom: 10,
    elevation: 2,
  },
  buttonPrimary: { backgroundColor: '#1d9bf0', borderColor: '#1a8cd8' },
  buttonSecondary: { backgroundColor: '#15202b', borderColor: '#2d3a4d' },
  buttonDisabled: { backgroundColor: '#0d1117', borderColor: '#21262d', opacity: 0.85 },
  buttonText: { fontSize: 17, color: '#e7e9ea', fontWeight: '600', flex: 1, textAlign: 'right' },
  buttonTextDisabled: { color: '#8899a6' },
  icon: { fontSize: 24 },
  comingSoonLabel: { fontSize: 11, color: '#536471', marginTop: 4, textAlign: 'right' },
  footer: { marginTop: 20, marginBottom: 16, alignItems: 'center' },
  footerText: { fontSize: 11, color: '#536471' },
});

function MenuButton({ icon, label, onPress, primary, disabled, comingSoon }) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        primary && styles.buttonPrimary,
        !primary && !disabled && styles.buttonSecondary,
        disabled && styles.buttonDisabled,
      ]}
      onPress={disabled ? undefined : onPress}
      activeOpacity={disabled ? 1 : 0.85}
      disabled={disabled}
    >
      <Text style={styles.icon}>{icon}</Text>
      <View style={{ flex: 1 }}>
        <Text style={[styles.buttonText, disabled && styles.buttonTextDisabled]}>{label}</Text>
        {comingSoon && <Text style={styles.comingSoonLabel}>{strings.comingSoon} — {strings.needsServer}</Text>}
      </View>
    </TouchableOpacity>
  );
}

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
          <View style={styles.logoCard}>
            <Text style={styles.logoEmoji}>🃏</Text>
            <Text style={styles.title}>أونو</Text>
            <Text style={styles.tagline}>{strings.welcomeTagline}</Text>
            <View style={styles.botBadge}>
              <Text style={styles.icon}>🤖</Text>
              <Text style={styles.botBadgeText}>{strings.botBadge}</Text>
            </View>
          </View>

          <Text style={styles.menuTitle}>{strings.mainMenuTitle}</Text>

          <MenuButton icon="🎲" label={strings.btnRandomPlay} disabled comingSoon />
          <MenuButton icon="🤖" label={strings.btnPlayVsBot} primary onPress={() => navigation.navigate('Game')} />
          <MenuButton icon="👥" label={strings.btnPlayFriends} disabled comingSoon />
          <MenuButton icon="👤" label={strings.btnMyAccount} onPress={() => navigation.navigate('Account')} />
          <MenuButton icon="🧮" label={strings.btnCalc} onPress={() => navigation.navigate('Calc')} />
          <MenuButton icon="📜" label={strings.btnRules} onPress={() => navigation.navigate('Rules')} />
          <MenuButton icon="📊" label={strings.btnLeaderboard} disabled comingSoon />
          <MenuButton icon="🏅" label={strings.badgePublish} disabled comingSoon />
          <MenuButton icon="ℹ️" label={strings.btnBotInfo} disabled comingSoon />
          <MenuButton icon="🌍" label={strings.btnChangeLang} disabled comingSoon />
          <MenuButton icon="🆘" label={strings.btnHelp} disabled comingSoon />
          <MenuButton icon="📢" label={strings.btnCommunityPublish} disabled comingSoon />

          <View style={styles.footer}>
            <Text style={styles.footerText}>{strings.footerText}</Text>
            <Text style={[styles.footerText, { marginTop: 4 }]}>المتاح: اللعب مع البوت، القوانين، حاسبة النقاط. الباقي قريباً مع السيرفر.</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
