import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import { register, login, getBaseUrl } from '../api';
import { useAuth } from '../AuthContext';

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#0a0e14' },
  title: { fontSize: 22, color: '#e7e9ea', marginBottom: 8, textAlign: 'center' },
  hint: { fontSize: 13, color: '#8899a6', marginBottom: 20, textAlign: 'center' },
  label: { fontSize: 14, color: '#8899a6', marginBottom: 6 },
  input: {
    backgroundColor: '#1a2332',
    borderWidth: 1,
    borderColor: '#38444d',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#e7e9ea',
    marginBottom: 16,
  },
  row: { flexDirection: 'row', gap: 12, marginTop: 8 },
  btn: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  btnPrimary: { backgroundColor: '#1d9bf0' },
  btnSecondary: { backgroundColor: '#38444d' },
  btnText: { fontSize: 16, color: '#e7e9ea', fontWeight: '600' },
  link: { fontSize: 14, color: '#1d9bf0', marginTop: 16, textAlign: 'center' },
  serverHint: { fontSize: 11, color: '#536471', marginTop: 24, textAlign: 'center' },
});

export default function AuthScreen({ navigation, mode: initialMode = 'login' }) {
  const { signIn } = useAuth();
  const [mode, setMode] = useState(initialMode);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const u = (username || '').trim();
    const p = (password || '').trim();
    const n = (name || '').trim();
    if (!u || !p) {
      Alert.alert('تنبيه', 'أدخل اليوزر نيم وكلمة السر');
      return;
    }
    if (mode === 'register' && !n) {
      Alert.alert('تنبيه', 'أدخل اسم اللاعب');
      return;
    }
    if (u.length < 3) {
      Alert.alert('تنبيه', 'اليوزر نيم 3 أحرف على الأقل');
      return;
    }
    if (p.length < 4) {
      Alert.alert('تنبيه', 'كلمة السر 4 أحرف على الأقل');
      return;
    }
    setLoading(true);
    try {
      if (mode === 'register') {
        const data = await register(n, u, p);
        await signIn(data.token, { player_name: data.player_name, username_key: data.username_key, online_points: 0, language: 'ar' });
      } else {
        const data = await login(u, p);
        await signIn(data.token, { player_name: data.player_name, username_key: data.username_key, online_points: data.online_points, language: data.language });
      }
      if (navigation.canGoBack()) navigation.goBack();
      else navigation.replace('Account');
    } catch (e) {
      Alert.alert('خطأ', e.message || 'حدث خطأ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{mode === 'register' ? '📝 تسجيل حساب جديد' : '🔐 تسجيل الدخول'}</Text>
      <Text style={styles.hint}>نفس حساب البوت — يُخزَن في قاعدة البيانات نفسها</Text>

      {mode === 'register' && (
        <>
          <Text style={styles.label}>اسم اللاعب</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="الاسم الذي يظهر في اللعب" placeholderTextColor="#8899a6" autoCapitalize="words" />
        </>
      )}
      <Text style={styles.label}>اليوزر نيم (للدخول والبحث)</Text>
      <TextInput style={styles.input} value={username} onChangeText={setUsername} placeholder="3 أحرف على الأقل، إنجليزي وأرقام" placeholderTextColor="#8899a6" autoCapitalize="none" />
      <Text style={styles.label}>كلمة السر</Text>
      <TextInput style={styles.input} value={password} onChangeText={setPassword} placeholder="4 أحرف على الأقل" placeholderTextColor="#8899a6" secureTextEntry />

      {loading ? (
        <ActivityIndicator size="large" color="#1d9bf0" style={{ marginTop: 20 }} />
      ) : (
        <TouchableOpacity style={[styles.btn, styles.btnPrimary]} onPress={handleSubmit}>
          <Text style={styles.btnText}>{mode === 'register' ? 'تسجيل' : 'دخول'}</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={() => setMode(mode === 'register' ? 'login' : 'register')}>
        <Text style={styles.link}>{mode === 'register' ? 'لديك حساب؟ ادخل من هنا' : 'لا تملك حساباً؟ سجّل من هنا'}</Text>
      </TouchableOpacity>

      <Text style={styles.serverHint}>السيرفر: {getBaseUrl()}</Text>
    </SafeAreaView>
  );
}
