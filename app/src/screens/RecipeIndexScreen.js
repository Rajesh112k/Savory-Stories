import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, FlatList, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons'; // For hamburger icon

const RECIPE_CATEGORIES = [
  'Breakfast',
  'Snacks',
  'Rice',
  'Curry',
  'Paneer',
  'Vegetables',
  'Lentils',
  'Indian Sweets',
  'Indian Street Foods',
  'Eggless Cakes',
  'World Cuisines',
  'Desserts',
  'Savory Foods', 
  // Added Savory Foods category
];

const RecipeIndexScreen = ({ navigation }) => {
  const [images, setImages] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      const fetchedImages = { ...images }; // Preserve the existing state while fetching
      for (const category of RECIPE_CATEGORIES) {
        try {
          const response = await axios.get(`https://api.spoonacular.com/recipes/complexSearch?query=${category}&number=1&apiKey=01937fb6b13b4bc696c141a148bef97f`);

          if (response.data.results && response.data.results.length > 0) {
            fetchedImages[category] = response.data.results[0].image;
          } else {
            fetchedImages[category] = null;
          }
        } catch (error) {
          console.error(`Error fetching image for ${category}:`, error);
          fetchedImages[category] = null;
        }

        // Update the state incrementally so the UI can render immediately as each image is fetched
        setImages(fetchedImages);
      }
      setLoading(false);
    };

    fetchImages();
  }, []);

  const navigateToCategory = (category) => {
    navigation.navigate('RecipeCards', { category: category.toLowerCase() });
  };

  const renderCategoryCard = ({ item: category }) => (
    <TouchableOpacity onPress={() => navigateToCategory(category)} accessible style={styles.categoryWrapper}>
      {images[category] ? (
        <ImageBackground source={{ uri: images[category] }} style={styles.categoryContainer} imageStyle={styles.imageStyle}>
          <Text style={styles.categoryText}>{category}</Text>
        </ImageBackground>
      ) : (
        <View style={styles.categoryContainer}>
          <Text style={styles.categoryText}>{category}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <ImageBackground source={require('../../../recipemusic.jpeg')}
    style={styles.backgroundImage}
    imageStyle={styles.imageStyle}
    >
      <View style={styles.overlay} />
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
        <Text style={styles.headerText}>Recipe Index</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loadingIndicator} />
      ) : (
        <FlatList
          data={RECIPE_CATEGORIES}
          renderItem={renderCategoryCard}
          keyExtractor={(item) => item}
          numColumns={2} 
          // Display 2 cards side by side
          contentContainerStyle={styles.flatListContent}
        />
      )}
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
    resizeMode: 'cover'
  },
  overlay: {
    ...StyleSheet.absoluteFillObject, // Makes the overlay cover the entire view
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black
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
  menuButton: {
    padding: 10,
  },
  loadingIndicator: {
    marginVertical: 20,
  },
  categoryWrapper: {
    flex: 1,
    margin: 5,
  },
  categoryContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  imageStyle: {
    borderRadius: 10,
  },
  categoryText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
  },
  flatListContent: {
    paddingBottom: 20, // Optional: add padding at the bottom
  },
});

export default RecipeIndexScreen;
