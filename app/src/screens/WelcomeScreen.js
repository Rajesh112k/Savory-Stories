import React, { useEffect, useRef } from 'react';
import { View, Text, Button, Image, StyleSheet, Animated, Easing } from 'react-native';

const WelcomeScreen = ({ navigation }) => {
  // Animation references
  const fadeAnim = useRef(new Animated.Value(0)).current; // For fade-in effect
  const slideAnim = useRef(new Animated.Value(30)).current; // For sliding up
  const scaleAnim = useRef(new Animated.Value(0.8)).current; // For image zoom-in effect
  const pulseAnim = useRef(new Animated.Value(1)).current; // For pulsing the button
  const rotateAnim = useRef(new Animated.Value(0)).current; // For rotating the image

  useEffect(() => {
    // Parallel animations for fade-in, slide-up, zoom-in, and rotation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 2000, // Set to 2 seconds
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 2000, // Set to 2 seconds
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 2000, // Set to 2 seconds
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 2, // Rotate twice
        duration: 2000, // Complete two full rotations in 2 seconds
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 500, // Faster pulsing
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 500, // Faster pulsing
            useNativeDriver: true,
          }),
        ])
      ),
    ]).start();

    // Automatically navigate to MainDrawer after 10 seconds
    const timer = setTimeout(() => {
      navigation.navigate('MainDrawer');
    }, 5000); // Set to 10 seconds

    return () => clearTimeout(timer);
  }, [fadeAnim, slideAnim, scaleAnim, pulseAnim, rotateAnim, navigation]);

  // Interpolating rotateAnim to create a continuous 360-degree rotation
  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1, 2], // 0, 1, and 2 full rotations
    outputRange: ['0deg', '360deg', '720deg'], // Two full rotations
  });

  return (
    <View style={styles.container}>
      <Animated.Text
        style={[
          styles.title,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        Welcome to Savory Stories
      </Animated.Text>
      <Animated.Image
        source={require('../../../bg.png')}
        //I have taken it from "MyRecipeBook: Recipe Keeper" by Poorvi Nayak.
        style={[styles.image, { transform: [{ scale: scaleAnim }, { rotate }] }]}
      />
      <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
        <Button title="Proceed" onPress={() => navigation.navigate('MainDrawer')} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFF5E1',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4E342E',
    marginBottom: 30,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 30,
    borderRadius: 20,
  },
});

export default WelcomeScreen;
