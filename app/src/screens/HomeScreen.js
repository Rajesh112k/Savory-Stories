import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, ImageBackground, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { SearchBar } from 'react-native-elements';
import { useDrawerStatus } from '@react-navigation/drawer';
import { getFirestore, collection, getDocs, addDoc, query, where, updateDoc, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import firebase from '../../../firebase'; // Adjust the path if necessary

const API_KEY = '9354b9e260f5494f9f7bdf02165f3086'; // Replace with your Spoonacular API Key
const db = getFirestore(firebase);

const HomeScreen = ({ navigation, initialCategory }) => {
  const [search, setSearch] = useState("");
  const [latestRecipes, setLatestRecipes] = useState([]);
  const [trendingRecipes, setTrendingRecipes] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [popupVisible, setPopupVisible] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [selectedCollections, setSelectedCollections] = useState({});
  const [newCollectionName, setNewCollectionName] = useState("");
  const [collections, setCollections] = useState([]);
  const [numColumns, setNumColumns] = useState(2);
  const drawerOpen = useDrawerStatus() === 'open';

  const fetchRecipesFromFirestore = async () => {
    try {
      const recipesCollection = collection(db, 'Recipes');
      const recipesQuery = initialCategory 
        ? query(recipesCollection, where("category", "==", initialCategory)) 
        : recipesCollection;

      const snapshot = await getDocs(recipesQuery);
      const recipeData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLatestRecipes(recipeData);
    } catch (error) {
      console.error("Error fetching recipes:", error.message);
    }
  };

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
        setTrendingRecipes(recipesWithIds);
      })
      .catch(error => {
        console.error("Error fetching recipes:", error.response ? error.response.data : error.message);
      });
  };

  const fetchCollectionsFromFirestore = async () => {
    try {
      const collectionsSnapshot = await getDocs(collection(db, 'Collections'));
      const collectionsData = collectionsSnapshot.docs.map(doc => doc.data());
      setCollections(collectionsData);
      const initialSelectedCollections = collectionsData.reduce((acc, collection) => {
        acc[collection.collectionName] = false;
        return acc;
      }, {});
      setSelectedCollections(initialSelectedCollections);
    } catch (error) {
      console.error("Error fetching collections:", error.message);
    }
  };

  useEffect(() => {
    fetchRecipesFromFirestore();
    fetchTrendingRecipesFromAPI("", initialCategory);
    fetchCollectionsFromFirestore();
  }, [initialCategory]);

  const updateSearch = (text) => {
    setSearch(text);
    fetchTrendingRecipesFromAPI(text, initialCategory);
  };

  const addFavorite = async (recipe) => {
    const auth = getAuth();
    const userEmail = auth.currentUser ? auth.currentUser.email : null;

    if (!userEmail) {
      console.log("User not logged in");
      return;
    }

    try {
      const docRef = await addDoc(collection(db, 'Favorites'), {
        ...recipe,
        userEmail,
        createdAt: new Date(),
      });

      setFavorites((prevFavorites) => [...prevFavorites, recipe]);
      setSelectedRecipe(recipe);
      setPopupVisible(true);
    } catch (error) {
      console.error("Error adding favorite:", error.message);
    }
  };

  const handleCollectionChange = (collectionName) => {
    setSelectedCollections(prevState => ({
      ...prevState,
      [collectionName]: !prevState[collectionName]
    }));
  };

  const handleCreateCollection = async () => {
    if (!newCollectionName) {
      console.log("Collection name is required");
      return;
    }

    try {
      const auth = getAuth();
      const userEmail = auth.currentUser ? auth.currentUser.email : null;

      if (!userEmail) {
        console.log("User not logged in");
        return;
      }

      const newCollectionRef = await addDoc(collection(db, 'Collections'), {
        collectionName: newCollectionName,
        userEmail,
        recipes: [],
      });

      setNewCollectionName("");
      setPopupVisible(false);
      fetchCollectionsFromFirestore();
    } catch (error) {
      console.error("Error creating collection:", error.message);
    }
  };

  const handleDoneButton = async () => {
    const auth = getAuth();
    const userEmail = auth.currentUser ? auth.currentUser.email : null;

    if (!userEmail) {
      console.log("User not logged in");
      return;
    }

    const collectionName = newCollectionName || Object.keys(selectedCollections).find(key => selectedCollections[key]);

    if (!collectionName) {
      console.log("No collection selected or created");
      return;
    }

    try {
      const collectionRef = collection(db, 'Collections');
      const collectionSnapshot = await getDocs(query(collectionRef, where("collectionName", "==", collectionName)));

      if (!collectionSnapshot.empty) {
        const collectionDoc = collectionSnapshot.docs[0];
        const collectionDocRef = doc(db, 'Collections', collectionDoc.id);
        
        await updateDoc(collectionDocRef, {
          recipes: [...collectionDoc.data().recipes, {
            recipeId: selectedRecipe.id,
            image: selectedRecipe.image,
            title: selectedRecipe.title,
            createdAt: new Date(),
          }],
        });

        console.log("Recipe added to collection:", collectionName);
      } else {
        console.log("Collection not found");
      }

      setPopupVisible(false);
    } catch (error) {
      console.error("Error adding recipe to collection:", error.message);
    }
  };

  const renderRecipeCard = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Details', { recipeId: item.id })}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.cardContent}>
        <Text style={styles.title}>{item.title}</Text>
        <TouchableOpacity onPress={() => addFavorite(item)}>
          <Ionicons name={favorites.find(fav => fav.id === item.id) ? "heart" : "heart-outline"} size={24} color="red" />
        </TouchableOpacity>
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
        <View style={styles.header}>
          <Text style={styles.headerText}>Savory Stories</Text>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Ionicons name="menu" size={28} color="black" />
          </TouchableOpacity>
        </View>

        <SearchBar
          placeholder="Search for recipes..."
          onChangeText={updateSearch}
          value={search}
          darkTheme
          round
          containerStyle={[styles.searchContainer, { backgroundColor: 'rgba(255, 255, 255, 0.7)' }]}
          inputContainerStyle={[styles.searchInputContainer, { backgroundColor: 'white' }]}
          placeholderTextColor="gray"
          inputStyle={{ color: 'black' }}
        />

          {latestRecipes.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Latest Recipes</Text>
              <FlatList
                data={latestRecipes}
                renderItem={renderRecipeCard}
                keyExtractor={(item) => item.id.toString()}
                numColumns={numColumns}
                style={styles.recipeList}
              />
            </>
          )}

          {trendingRecipes.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Trending Recipes</Text>
              <FlatList
                data={trendingRecipes}
                renderItem={renderRecipeCard}
                keyExtractor={(item) => item.id.toString()}
                numColumns={numColumns}
                style={styles.recipeList}
              />
            </>
          )}

          {popupVisible && (
            <Modal
              visible={popupVisible}
              animationType="slide"
              transparent
              onRequestClose={() => setPopupVisible(false)}
            >
              <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                  <Text style={styles.modalTitle}>Select Collection</Text>
                  {collections.map((collection, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.collectionButton,
                        selectedCollections[collection.collectionName] ? styles.selectedCollection : null
                      ]}
                      onPress={() => handleCollectionChange(collection.collectionName)}
                    >
                      <Text style={styles.collectionText}>{collection.collectionName}</Text>
                    </TouchableOpacity>
                  ))}
                  <TextInput
                    style={styles.collectionInput}
                    placeholder="New Collection Name"
                    value={newCollectionName}
                    onChangeText={setNewCollectionName}
                  />
                  <TouchableOpacity style={styles.doneButton} onPress={handleDoneButton}>
                    <Text style={styles.doneButtonText}>Done</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          )}
        </View>
      </ImageBackground>
  );
};

const styles = StyleSheet.create({
  // Define styles for all elements
  container: { flex: 1, paddingHorizontal: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 20 },
  headerText: { fontSize: 24, fontWeight: 'bold' },
  searchContainer: { marginBottom: 10 },
  searchInputContainer: { borderRadius: 10 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginVertical: 1, color:'red' },
  recipeList: { marginBottom: 20 },
  card: { flex: 1, margin: 5, borderRadius: 10, overflow: 'hidden', backgroundColor: '#fff' },
  image: { width: '100%', height: 150 },
  cardContent: { padding: 10, flexDirection: 'row', justifyContent: 'space-between' },
  title: { fontSize: 16, fontWeight: 'bold' },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContainer: { width: '80%', padding: 20, backgroundColor: 'white', borderRadius: 10, alignItems: 'center' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  collectionButton: { padding: 10, borderRadius: 5, marginVertical: 5, backgroundColor: 'lightgray', alignItems: 'center' },
  selectedCollection: { backgroundColor: '#4CAF50' },
  collectionText: { fontSize: 16, color: 'black' },
  collectionInput: { width: '100%', padding: 10, borderColor: '#ddd', borderWidth: 1, borderRadius: 5, marginTop: 10 },
  doneButton: { marginTop: 15, backgroundColor: '#4CAF50', padding: 10, borderRadius: 5 },
  doneButtonText: { color: 'white', fontWeight: 'bold' },
  backgroundImage: { flex: 1 },
  imageStyle: { opacity: 0.5 },
});

export default HomeScreen;
