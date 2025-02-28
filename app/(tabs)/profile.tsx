import { useState } from 'react';
import { View, Text, StyleSheet, Image, Pressable, TextInput, ScrollView } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { setUser, setToken, setError, logout } from '../../store/slices/authSlice';
import * as SecureStore from 'expo-secure-store';
import { login, register } from '../../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen() {
  const dispatch = useDispatch();
  const { user, error } = useSelector((state: RootState) => state.auth);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const handleAuth = async () => {
    try {
      if (isLogin) {
        const { accessToken, user } = await login(email, password);
        await AsyncStorage.setItem('token', accessToken);
        await AsyncStorage.setItem('userId', user._id);
        await AsyncStorage.setItem('email', user.email);
        dispatch(setToken(accessToken));
        dispatch(setUser(user));
      } else {
        // @ts-ignore
        const res = await register(name, email, phone, password);
        setIsLogin(true)
      }
    } catch (err) {
      // @ts-ignore
      dispatch(setError(err.message));
    }
  };

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('token');
    dispatch(logout());
  };

  const handleHistory = async () => {
    navigator('appointments');
  };

  if (!user) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.authContainer}>
          <Text style={styles.authTitle}>{isLogin ? 'Login' : 'Sign Up'}</Text>
          
          {error && <Text style={styles.errorText}>{error}</Text>}
          
          {!isLogin && (
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={name}
              onChangeText={setName}
            />
          )}
          
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {!isLogin && (
            <TextInput
              style={styles.input}
              placeholder="Phone"
              value={phone}
              onChangeText={setPhone}
            />
          )}
          
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          
          <Pressable style={styles.authButton} onPress={handleAuth}>
            <Text style={styles.authButtonText}>
              {isLogin ? 'Login' : 'Sign Up'}
            </Text>
          </Pressable>
          
          <Pressable onPress={() => setIsLogin(!isLogin)}>
            <Text style={styles.switchText}>
              {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Login'}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://images.rawpixel.com/image_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvdjkzNy1hZXctMTY1LWtsaGN3ZWNtLmpwZw.jpg' }}
          style={styles.avatar}
        />
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Phone</Text>
            <Text style={styles.infoValue}>{user.phone}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Date of Birth</Text>
            <Text style={styles.infoValue}>Jan 1, 1990</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Blood Type</Text>
            <Text style={styles.infoValue}>A+</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Medical History</Text>
        <Pressable style={styles.historyButton} onPress={handleHistory}>
          <Text style={styles.historyButtonText}>View Medical Records</Text>
        </Pressable>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        <View style={styles.settingsContainer}>
          <Pressable style={styles.settingItem}>
            <Text style={styles.settingText}>Notifications</Text>
          </Pressable>
          <Pressable style={styles.settingItem}>
            <Text style={styles.settingText}>Privacy Settings</Text>
          </Pressable>
          <Pressable style={styles.settingItem}>
            <Text style={styles.settingText}>Help & Support</Text>
          </Pressable>
          <Pressable style={[styles.settingItem, styles.logoutButton]} onPress={handleLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  authContainer: {
    padding: 20,
    backgroundColor: '#fff',
  },
  authTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  authButton: {
    backgroundColor: '#0066cc',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  authButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  switchText: {
    color: '#0066cc',
    textAlign: 'center',
    fontSize: 14,
  },
  errorText: {
    color: '#dc3545',
    marginBottom: 16,
    textAlign: 'center',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  section: {
    padding: 20,
    backgroundColor: '#fff',
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  infoContainer: {
    gap: 12,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
  },
  infoValue: {
    fontSize: 16,
    color: '#1a1a1a',
  },
  historyButton: {
    backgroundColor: '#0066cc',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  historyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  settingsContainer: {
    gap: 12,
  },
  settingItem: {
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
  },
  settingText: {
    fontSize: 16,
    color: '#1a1a1a',
  },
  logoutButton: {
    backgroundColor: '#dc3545',
    marginBottom: 100,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});