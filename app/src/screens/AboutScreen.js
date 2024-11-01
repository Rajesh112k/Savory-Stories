import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Updated to use Expo's vector icons

const AboutScreen = ({ navigation }) => {
  return (
    <ImageBackground 
      source={require('../../../bg.png')} // Make sure to use the correct path for your background image
      style={styles.backgroundImage}
      imageStyle={styles.imageStyle}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerText}>Savory Stories</Text>
          <View style={styles.headerIcons}>
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
              <Ionicons name="menu" size={28} color="black" />
            </TouchableOpacity>
          </View>
        </View>

       <View style={styles.cont}>
        <Text style={styles.head}>Savory Stories</Text>
        <Text style={styles.text}>
          Savory Stories is a curated recipe book app designed to bring the world's best dishes right to your fingertips.
          Whether you're a seasoned chef or a home cook looking for inspiration, the app offers a wide array of trending
          and personalized recipes. Powered by the Spoonacular API, Savory Stories delivers a collection of popular, 
          diverse, and mouth-watering recipes daily, allowing users to explore new culinary horizons with ease.
          Each recipe card comes with vibrant imagery, detailed instructions, and nutritional information to ensure a seamless cooking experience.
        </Text>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    padding: 10,
  },
  imageStyle: {
    opacity: 0.5,
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    padding: 10,
    justifyContent: 'flex-start', // Align content to the top
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ff6347',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  head: {
    fontSize: 35,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'orange',
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    textAlign: 'center', // Center the text
  },
  cont: {
    alignItems: 'center',
    width: '80%',
    TextAlign:'center',
    margin:'auto',
  }
});

export default AboutScreen;
