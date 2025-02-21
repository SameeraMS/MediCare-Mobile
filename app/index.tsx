import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Redirect } from 'expo-router';
import Animated, {
  withSpring,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withDelay
} from 'react-native-reanimated';

export default function SplashScreen() {
  const scale = useSharedValue(0.3);
  const opacity = useSharedValue(0);
  const developerOpacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(1, { damping: 20 });
    opacity.value = withSpring(1, { damping: 20 });
    developerOpacity.value = withDelay(500, withSequence(
      withSpring(1, { damping: 20 })
    ));
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const developerStyle = useAnimatedStyle(() => ({
    opacity: developerOpacity.value,
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, logoStyle]}>
        <Text style={styles.title}>MediCare</Text>
        <Text style={styles.subtitle}>Your Health, Our Priority</Text>
      </Animated.View>

      <Animated.Text style={[styles.developer, developerStyle]}>
        Developed by Sameera
      </Animated.Text>

      <Redirect href="/(tabs)" />
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
  content: {
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#0066cc',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
  developer: {
    position: 'absolute',
    bottom: 40,
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
});