import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios';

const RecipeCardsScreen = ({ route, navigation }) => { // Added navigation prop
  const { category } = route.params; // Get the category from route params
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get(`https://api.spoonacular.com/recipes/complexSearch?query=${category}&number=10&apiKey=01937fb6b13b4bc696c141a148bef97f`);
        setRecipes(response.data.results); // Set the fetched recipes
      } catch (error) {
        console.error(`Error fetching recipes for ${category}:`, error);
      } finally {
        setLoading(false); // Set loading to false once recipes are fetched
      }
    };

    fetchRecipes();
  }, [category]);

  const renderRecipeCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('Details', { recipeId: item.id })} // Navigate to Details screen
    >
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.title}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loadingIndicator} />
      ) : (
        <FlatList
          data={recipes}
          renderItem={renderRecipeCard}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2} 
          // Display two cards per row
        />
      )}
    </View>
  );
};

//when we click on the recipes or categories it shows 10 of these recipies and when we click on the recipe it shows the DetailSec
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  loadingIndicator: {
    marginVertical: 20,
  },
  card: {
    flex: 1,
    margin: 5,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3, // Add shadow effect on Android
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  title: {
    padding: 10,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  
});

export default RecipeCardsScreen;
