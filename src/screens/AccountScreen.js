import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Alert } from 'react-native';
import { useAuth } from '../AuthContext';
import strings from '../strings';

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#0a0e14' },
  card: {
    backgroundColor: '#1a2332',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2d3a4d',
    padding: 20,
    marginBottom: 16,
  },
  title: { fontSize: 18, color: '#e7e9ea', marginBottom: 4, fontWeight: '600' },
  value: { fontSize: 16, color: '#8899a6' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  btn: { paddingVertical: 14, paddingHorizontal: 24, borderRadius: 12, backgroundColor: '#f4212e', alignSelf: 'center', marginTop: 16 },
  btnText: { fontSize: 16, color: '#fff', fontWeight: '600' },
  hint: { fontSize: 13, color: '#536471', textAlign: 'center', marginTop: 24 },
});

export default function AccountScreen({ navigation }) {
  const { user, token, signOut, loading } = useAuth();

  const handleLogout = () => {
    Alert.alert('تسجيل الخروج', 'هل تريد الخروج من الحساب؟', [
      { text: 'إلغاء', style: 'cancel' },
      { text: 'خروج', style: 'destructive', onPress: () => signOut() },
    ]);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.value}>جاري التحميل...</Text>
      </SafeAreaView>
    );
  }

  if (!token || !user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>👤 حسابي</Text>
          <Text style={[styles.value, { marginTop: 8 }]}>غير مسجّل دخول. سجّل أو ادخل لربط حسابك مع البوت وقاعدة البيانات.</Text>
          <TouchableOpacity style={[styles.btn, { backgroundColor: '#1d9bf0', marginTop: 20 }]} onPress={() => navigation.replace('Auth')}>
            <Text style={styles.btnText}>تسجيل / دخول</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.hint}>بعد رفع api_server.py إلى سيرفر البوت وتشغيله، غيّر BASE_URL في src/api.js ثم سجّل أو ادخل.</Text>
      </SafeAreaView>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={styles.card}>
        <Text style={styles.title}>👤 حسابي</Text>
        <View style={styles.row}>
          <Text style={styles.value}>الاسم</Text>
          <Text style={styles.title}>{user.player_name || '—'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.value}>اليوزر نيم</Text>
          <Text style={styles.title}>@{user.username_key || '—'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.value}>النقاط</Text>
          <Text style={styles.title}>{user.online_points ?? 0} نقطة</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.value}>اللغة</Text>
          <Text style={styles.title}>{user.language || 'ar'}</Text>
        </View>
        <TouchableOpacity style={styles.btn} onPress={handleLogout}>
          <Text style={styles.btnText}>تسجيل الخروج</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.hint}>هذا الحساب مرتبط بنفس قاعدة بيانات البوت. التعديل من البوت يظهر هنا والعكس.</Text>
    </ScrollView>
  );
}
