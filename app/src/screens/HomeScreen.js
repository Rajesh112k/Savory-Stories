import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, ImageBackground, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { SearchBar } from 'react-native-elements';
import { useDrawerStatus } from '@react-navigation/drawer';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import firebase from '../../../firebase'; // Adjust the path if necessary

const API_KEY = '9354b9e260f5494f9f7bdf02165f3086'; // Replace with your Spoonacular API Key
const db = getFirestore(firebase);

const HomeScreen = ({ navigation, initialCategory }) => {
  const [search, setSearch] = useState("");
  const [latestRecipes, setLatestRecipes] = useState([]);
  const [trendingRecipes, setTrendingRecipes] = useState([]);
  const drawerOpen = useDrawerStatus() === 'open';

  // Fetch recipes from Firestore
  const fetchRecipesFromFirestore = async () => {
    console.log("Initial Category:", initialCategory); // Debug log for category
    try {
      const recipesCollection = collection(db, 'Recipes');
      const recipesQuery = initialCategory 
        ? query(recipesCollection, where("category", "==", initialCategory)) 
        : recipesCollection;

      const snapshot = await getDocs(recipesQuery);
      const recipeData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log("Fetched Recipes Data:", recipeData); // Debug log for fetched data
      setLatestRecipes(recipeData);
    } catch (error) {
      console.error("Error fetching recipes:", error.message);
    }
  };

  // Fetch trending recipes from Spoonacular API
  const fetchTrendingRecipesFromAPI = (query = "", category = "") => {
    const url = query
      ? `https://api.spoonacular.com/recipes/complexSearch?query=${query}&number=10&apiKey=${API_KEY}`
      : category
        ? `https://api.spoonacular.com/recipes/complexSearch?type=${category}&number=10&apiKey=${API_KEY}`
        : `https://api.spoonacular.com/recipes/random?number=10&apiKey=${API_KEY}`;

    axios.get(url)
      .then(response => {
        const recipeData = response.data.results || response.data.recipes;
        const recipesWithIds = recipeData.map(recipe => ({
          id: recipe.id,
          title: recipe.title,
          image: recipe.image,
        }));
        console.log(recipeData);
        setTrendingRecipes(recipesWithIds);
      })
      .catch(error => {
        console.error("Error fetching recipes:", error.response ? error.response.data : error.message);
      });
  };

  // Initial data fetch
  useEffect(() => {
    fetchRecipesFromFirestore();
    fetchTrendingRecipesFromAPI("", initialCategory);
  }, [initialCategory]);

  const updateSearch = (text) => {
    setSearch(text);
    fetchTrendingRecipesFromAPI(text, initialCategory);
  };

  const renderRecipeCard = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Details', { recipeId: item.id })}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.cardContent}>
        <Text style={styles.title}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderRecipeCardFire = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('FirePage', { recipeId: item.id })}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.cardContent}>
        <Text style={styles.title}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ImageBackground 
      source={require('../../../bg.png')}
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

        {/* Search Bar */}
        <SearchBar
          placeholder="Search for recipes..."
          onChangeText={updateSearch}
          value={search}
          darkTheme
          round
          containerStyle={[styles.searchContainer, { backgroundColor: 'grey' }]}
          inputContainerStyle={[styles.searchInputContainer, { backgroundColor: 'grey' }]}
          placeholderTextColor="white"
          inputStyle={{ color: 'white' }}
        />

        {/* Scrollable Content */}
        <ScrollView>
          {/* Latest Recipes Heading */}
          {latestRecipes.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Latest Recipes</Text>
              <FlatList
                data={latestRecipes}
                renderItem={renderRecipeCardFire}
                keyExtractor={(item) => item.id.toString()}
                numColumns={2}
                contentContainerStyle={styles.flatListContent}
                scrollEnabled={false}
              />
            </>
          )}

          {/* Trending Recipes Heading */}
          <Text style={styles.sectionTitle}>Trending Recipes</Text>
          <FlatList
            data={trendingRecipes}
            renderItem={renderRecipeCard}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            contentContainerStyle={styles.flatListContent}
            scrollEnabled={false}
          />
        </ScrollView>
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
  searchContainer: {
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    borderBottomWidth: 0,
    marginBottom: 10,
  },
  searchInputContainer: {
    backgroundColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 10,
  },
  card: {
    flex: 1,
    margin: 10,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: 'white',
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 120,
  },
  cardContent: {
    padding: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  flatListContent: {
    paddingBottom: 20,
  },
});
//styles to style it
export default HomeScreen;
