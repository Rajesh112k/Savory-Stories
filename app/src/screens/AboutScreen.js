import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Linking } from 'react-native';
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
          <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <Text style={styles.headerText}>Savory Stories</Text>
          </TouchableOpacity>
          <View style={styles.headerIcons}>
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
              <Ionicons name="menu" size={28} color="#ff6347" />
            </TouchableOpacity>
          </View>
        </View>

        {/* About Section */}
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

        {/* Footer Section */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2024 Savory Stories. All Rights Reserved.</Text>
          <View style={styles.footerLinks}>
            <TouchableOpacity onPress={() => navigation.navigate('About')}>
              <Text style={styles.footerLink}>About Us</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('PrivacyPolicy')}>
              <Text style={styles.footerLink}>Privacy Policy</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('TermsOfService')}>
              <Text style={styles.footerLink}>Terms of Service</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.footerSocial}>
            <TouchableOpacity onPress={() => Linking.openURL('https://facebook.com')}>
              <Ionicons name="logo-facebook" size={24} color="black" style={styles.socialIcon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => Linking.openURL('https://twitter.com')}>
              <Ionicons name="logo-twitter" size={24} color="black" style={styles.socialIcon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => Linking.openURL('https://instagram.com')}>
              <Ionicons name="logo-instagram" size={24} color="black" style={styles.socialIcon} />
            </TouchableOpacity>
          </View>
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
    opacity: 0.5, // Image opacity to blend with the overlay
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black background
    padding: 10,
    justifyContent: 'space-between', // Ensures footer is at the bottom
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
    color: '#ff6347', // Original header color (can stay as is)
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  head: {
    fontSize: 36, // Slightly larger for a more prominent heading
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#ff7f50', // Updated coral color for a softer, but vibrant look
    textAlign: 'center',
  },
  text: {
    fontSize: 18, // Slightly larger font for better readability
    textAlign: 'center', // Center the text
    lineHeight: 26, // Increased line height for better readability
    color: 'white', // Soft dark gray for the text to be easy on the eyes
    marginHorizontal: 20, // Added horizontal padding for a better layout
  },
  cont: {
    alignItems: 'center',
    width: '90%', // Adjust width for better alignment
    marginTop: 20,
  },
  footer: {
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f8f8',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  footerText: {
    fontSize: 12,
    color: '#555',
    marginBottom: 5,
  },
  footerLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 5,
  },
  footerLink: {
    fontSize: 14,
    color: '#007BFF',
    marginHorizontal: 10,
  },
  footerSocial: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  socialIcon: {
    marginHorizontal: 15,
  },
});

export default AboutScreen;
