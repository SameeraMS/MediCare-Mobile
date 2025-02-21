import { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Redirect } from 'expo-router';
import Animated, { 
  withSpring, 
  useAnimatedStyle, 
  useSharedValue 
} from 'react-native-reanimated';

export default function SplashScreen() {
  const scale = useSharedValue(0.3);
  
  useEffect(() => {
    scale.value = withSpring(1, { damping: 20 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.logoContainer, animatedStyle]}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=200&auto=format&fit=crop' }}
          style={styles.logo}
        />
      </Animated.View>
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
  logoContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  logo: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});