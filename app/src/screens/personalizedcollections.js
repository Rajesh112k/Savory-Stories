import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import firebase from '../../../firebase';
import { Ionicons } from '@expo/vector-icons'; 

const db = getFirestore(firebase);

const PersonalizedCollectionScreen = ({ navigation, route }) => {
  const { collectionName } = route.params; // Get collectionName passed from previous screen
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCollectionRecipes = async () => {
    try {
      // Query recipes based on the collectionName
      const collectionQuery = query(collection(db, 'Collections'), where("collectionName", "==", collectionName));
      const snapshot = await getDocs(collectionQuery);
      
      // Assuming there is only one collection document for the collectionName
      if (!snapshot.empty) {
        const collectionDoc = snapshot.docs[0].data();
        const recipesData = collectionDoc.recipes.map(recipe => ({
          id: recipe.recipeId.toString(),
          title: recipe.title,
          image: recipe.image,
        }));
        setRecipes(recipesData);
      } else {
        setRecipes([]); // If no collection is found
      }
    } catch (error) {
      console.error("Error fetching collection recipes:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollectionRecipes();
  }, [collectionName]); // Fetch recipes when collectionName changes

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
      source={require('../../../recipemusic.jpeg')}
      style={styles.backgroundImage}
      imageStyle={styles.imageStyle}
    >
      <View style={styles.overlay} />
    <View style={styles.container}>
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
      
      <Text style={styles.headerText1}>{collectionName} Recipes</Text>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={recipes}
          renderItem={renderRecipeCard}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.flatListContent}
        />
      )}

      {/* Footer Section */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2024 Savory Stories</Text>
        <View style={styles.socialIcons}>
          <Ionicons name="logo-facebook" size={24} color="white" style={styles.icon} />
          <Ionicons name="logo-twitter" size={24} color="white" style={styles.icon} />
          <Ionicons name="logo-instagram" size={24} color="white" style={styles.icon} />
        </View>
      </View>
    </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  imageStyle: {
    resizeMode: 'cover'
  },
  overlay: {
    ...StyleSheet.absoluteFillObject, // Makes the overlay cover the entire view
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black
  },
  container: {
    flex: 1,
    padding: 16,
  },
  headerText1: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#ff6347'
  },
  card: {
    margin: 8,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    width: '45%',
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 120,
    borderRadius: 8,
  },
  cardContent: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  flatListContent: {
    paddingBottom: 20,
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
  footer: {
    backgroundColor: '#6200ee',
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop: 'auto',
  },
  footerText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 10,
  },
  socialIcons: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  icon: {
    margin: 10,
  },
});

export default PersonalizedCollectionScreen;
