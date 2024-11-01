import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import firebase from '../../../firebase'; 

const db = getFirestore(firebase);

const FirePage = ({ route, navigation }) => {
  const { recipeId } = route.params;
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [multiplier, setMultiplier] = useState(1);

  const scrollViewRef = useRef(null);
  const nutritionRef = useRef(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const docRef = doc(db, 'Recipes', recipeId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const fetchedRecipe = docSnap.data();
          
          setRecipe(fetchedRecipe);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching recipe:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [recipeId]);

  if (loading) return <Text>Loading...</Text>;
  if (!recipe) return <Text>No recipe found</Text>;

  const scrollToNutrition = () => {
    nutritionRef.current.measure((fx, fy, width, height, px, py) => {
      scrollViewRef.current.scrollTo({ y: py, animated: true });
    });
  };

  // Split ingredients and instructions strings into arrays
  const ingredientsArray = recipe.ingredients.split(',').map(ingredient => ingredient.trim());
  const instructionsArray = recipe.instructions.split(',').map(step => step.trim());

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{recipe.recipeName}</Text>
      <Image source={{ uri: recipe.image }} style={styles.image} />

      {/* Recipe Details */}
      <View style={styles.tableContainer}>
        <View style={styles.tableRow}>
          <View style={styles.tableCellContainer}>
            <Text style={styles.tableCellLabel}>Total Time:</Text>
            <Text style={styles.tableCell}>{recipe.totalTime || 'N/A'} minutes</Text>
          </View>
          <View style={styles.tableCellContainer}>
            <Text style={styles.tableCellLabel}>Servings:</Text>
            <Text style={styles.tableCell}>{recipe.servings || 'N/A'}</Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={styles.tableCellContainer}>
            <Text style={styles.tableCellLabel}>Yield:</Text>
            <Text style={styles.tableCell}>{recipe.yield || 'N/A'}</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity onPress={scrollToNutrition}>
        <Text style={styles.linkText}>Nutrients Facts</Text>
      </TouchableOpacity>

      {/* Quantity Selector */}
      <View style={styles.quantitySelector}>
        <Text style={styles.quantityLabel}>Select Quantity:</Text>
        <View style={styles.quantityButtons}>
          {['1x', '2x', '3x'].map((label, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.quantityButton, multiplier === index + 1 && styles.selectedButton]}
              onPress={() => setMultiplier(index + 1)}
            >
              <Text style={styles.quantityButtonText}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Ingredients Section */}
      <View style={styles.ingredientsContainer}>
        <Text style={styles.ingredientsTitle}>Ingredients</Text>
        {ingredientsArray.length > 0 ? (
          ingredientsArray.map((ingredient, index) => (
            <Text key={index} style={styles.ingredientItem}>
              {ingredient} (multiplier: {multiplier})
            </Text>
          ))
        ) : (
          <Text style={styles.ingredientItem}>No ingredients available.</Text>
        )}
      </View>

      {/* Instructions Section */}
      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionsTitle}>Instructions</Text>
        {instructionsArray.length > 0 ? (
          instructionsArray.map((step, index) => (
            <Text key={index} style={styles.instructionsText}>
              Step {index + 1}: {step}
            </Text>
          ))
        ) : (
          <Text style={styles.instructionsText}>No instructions available.</Text>
        )}
      </View>


      {/* Go Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Go Back</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 10,
    marginBottom: 10,
  },
  tableContainer: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  tableCellContainer: {
    flex: 1,
    alignItems: 'center',
  },
  tableCellLabel: {
    fontWeight: 'bold',
  },
  tableCell: {
    textAlign: 'center',
  },
  linkText: {
    color: '#007AFF',
    marginVertical: 10,
    textDecorationLine: 'underline',
    textAlign: 'center',
  },
  quantitySelector: {
    marginTop: 20,
    flexDirection: 'column',
    alignItems: 'center',
  },
  quantityLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  quantityButtons: {
    flexDirection: 'row',
  },
  quantityButton: {
    padding: 10,
    backgroundColor: '#007AFF',
    borderRadius: 5,
    marginHorizontal: 5,
  },
  selectedButton: {
    backgroundColor: '#005BB5',
  },
  quantityButtonText: {
    color: '#fff',
  },
  ingredientsContainer: {
    marginTop: 20,
  },
  ingredientsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  ingredientItem: {
    fontSize: 16,
  },
  instructionsContainer: {
    marginTop: 20,
  },
  instructionsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  instructionsText: {
    fontSize: 16,
    marginBottom: 5,
  },
  nutritionContainer: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingTop: 10,
  },
  nutritionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  backButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#FF3B30',
    borderRadius: 5,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default FirePage;
