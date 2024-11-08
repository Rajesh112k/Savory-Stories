import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
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
    <TouchableOpacity style={styles.card} onPress={() => console.log("Navigate to recipe details")}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.cardContent}>
        <Text style={styles.title}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
  <TouchableOpacity onPress={() => navigation.navigate('Home')}>
    <Text style={styles.headerText}>Savory Stories</Text>
  </TouchableOpacity>
  <View style={styles.headerIcons}>
    <TouchableOpacity onPress={() => navigation.openDrawer()}>
      <Ionicons name="menu" size={28} color="black" />
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  headerText1: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
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
});

export default PersonalizedCollectionScreen;
