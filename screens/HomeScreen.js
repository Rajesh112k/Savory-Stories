import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { Ionicons } from 'react-native-vector-icons'; // Ensure you have the right import for icons
import axios from 'axios';

const API_KEY = '5505f39719a8493ca4c0413123c3084b';

const HomeScreen = ({ navigation }) => {
  const [recipes, setRecipes] = useState([]);

  // Fetch trending recipes from Spoonacular
  useEffect(() => {
    axios
      .get(`https://api.spoonacular.com/recipes/random?number=10&apiKey=${API_KEY}`)
      .then(response => {
        setRecipes(response.data.recipes);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const renderRecipeCard = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Details', { recipeId: item.id })}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.cardContent}>
        <Text style={styles.title}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ImageBackground 
      source={require('../../bg.png')} // Adjust the path to your bg.png
      style={styles.backgroundImage}
      imageStyle={styles.imageStyle} // This style applies to the background image itself
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerText}>Savory Stories</Text>
          <View style={styles.headerIcons}>
            <TouchableOpacity onPress={() => console.log('Search clicked')}>
              <Ionicons name="search" size={24} color="black" />
            </TouchableOpacity>
            {/* Remove the hamburger menu icon */}
          </View>
        </View>

        {/* Recipe List */}
        <FlatList
          data={recipes}
          renderItem={renderRecipeCard}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    justifyContent: 'center', // Center the content vertically
    padding: 10,
  },
  imageStyle: {
    opacity: 0.5, // Adjust opacity for a lighter background
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent', // Set to transparent to see background
    padding: 10,
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
    color: '#ff6347', // Tomato red color for aesthetics
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  card: {
    flex: 1,
    margin: 10,
    backgroundColor: '#fdf5e6', // Light beige background for card
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 4,
  },
  cardContent: {
    padding: 10,
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
});

export default HomeScreen;
