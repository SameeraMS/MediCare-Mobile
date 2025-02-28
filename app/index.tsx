import { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { router } from 'expo-router';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
// @ts-ignore
import logo from '../assets/images/logo.png';

export default function BeginScreen() {
  const [isStarting, setIsStarting] = useState(false);
  const scale = useSharedValue(0.3);
  const opacity = useSharedValue(0);
  const buttonScale = useSharedValue(1);
  const buttonOpacity = useSharedValue(0);
  const developerOpacity = useSharedValue(0);

  useState(() => {
    // Initial animations
    scale.value = withSpring(1, { damping: 15 });
    opacity.value = withSpring(1, { damping: 20 });
    buttonOpacity.value = withDelay(800, withSpring(1));
    developerOpacity.value = withDelay(1000, withSpring(1));
  }, []);

  const handleStart = () => {
    if (isStarting) return;
    setIsStarting(true);

    // Button press animation
    buttonScale.value = withSequence(
      withTiming(0.95, { duration: 100 }),
      withTiming(1, { duration: 100 }),
      withDelay(200, withTiming(0.8, { duration: 300 }))
    );

    // Fade out everything
    opacity.value = withDelay(500, withTiming(0, { duration: 500 }));
    buttonOpacity.value = withDelay(300, withTiming(0, { duration: 300 }));
    developerOpacity.value = withTiming(0, { duration: 300 });

    // Navigate after animations
    setTimeout(() => {
      router.replace('/(tabs)');
    }, 1000);
  };

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
    opacity: buttonOpacity.value,
  }));

  const developerStyle = useAnimatedStyle(() => ({
    opacity: developerOpacity.value,
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.logoContainer, logoStyle]}>
        <Image source={logo} style={styles.logo} resizeMode="contain" />
        <Text style={styles.title}>MediCare</Text>
        <Text style={styles.subtitle}>Your Health Partner</Text>
      </Animated.View>

      <Animated.View style={[styles.buttonContainer, buttonStyle]}>
        <Pressable
          style={styles.startButton}
          onPress={handleStart}
          disabled={isStarting}
        >
          <Text style={styles.startButtonText}>Get Started</Text>
        </Pressable>
      </Animated.View>

      <Animated.Text style={[styles.developer, developerStyle]}>
        Developed by Sameera
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 24,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#0066cc',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 48,
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 40,
  },
  startButton: {
    backgroundColor: '#0066cc',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  developer: {
    position: 'absolute',
    bottom: 40,
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
});