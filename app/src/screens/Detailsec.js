import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native'; 
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons for social media icons

const API_KEY = '01937fb6b13b4bc696c141a148bef97f';

const Detailsec = ({ route }) => {
  const { recipeId } = route.params;
  const navigation = useNavigation(); 
  const [recipeDetails, setRecipeDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [multiplier, setMultiplier] = useState(1);

  const scrollViewRef = useRef(null);
  const nutritionRef = useRef(null);

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      try {
        const response = await axios.get(`https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${API_KEY}`);
        setRecipeDetails(response.data);
      } catch (err) {
        setError('Failed to fetch recipe details');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipeDetails();
  }, [recipeId]);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  const occasions = recipeDetails.occasions && recipeDetails.occasions.length > 0
    ? recipeDetails.occasions.join(', ')
    : null;

  const summary = recipeDetails.summary;
  const calories = summary.match(/(\d+)\s+calories/i)?.[1] || 'N/A';
  const fat = summary.match(/(\d+)g\s+of\s+fat/i)?.[1] || 'N/A';
  const protein = summary.match(/(\d+)g\s+of\s+protein/i)?.[1] || 'N/A';

  const adjustedIngredients = recipeDetails.extendedIngredients.map(ingredient => ({
    ...ingredient,
    quantity: ingredient.amount * multiplier, 
  }));

  const stripHtmlTags = (html) => html.replace(/<[^>]+>/g, ''); 

  return (
    <ScrollView ref={scrollViewRef} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('HomeScreen')}>
          <Text style={styles.headerText}>Savory Stories</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
          <Text style={styles.hamburgerMenuText}>☰</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>{recipeDetails.title}</Text>
      <Image source={{ uri: recipeDetails.image }} style={styles.image} />

      {/* Recipe details */}
      <View style={styles.tableContainer}>
        <View style={styles.tableRow}>
          <View style={styles.tableCellContainer}>
            <Text style={styles.tableCellLabel}>Prep Time:</Text>
            <Text style={styles.tableCell}>{recipeDetails.preparationMinutes || 'N/A'} minutes</Text>
          </View>
          <View style={styles.tableCellContainer}>
            <Text style={styles.tableCellLabel}>Cook Time:</Text>
            <Text style={styles.tableCell}>{recipeDetails.cookingMinutes || 'N/A'} minutes</Text>
          </View>
        </View>

        <View style={styles.tableRow}>
          <View style={styles.tableCellContainer}>
            <Text style={styles.tableCellLabel}>Total Time:</Text>
            <Text style={styles.tableCell}>{recipeDetails.readyInMinutes || 'N/A'} minutes</Text>
          </View>
          <View style={styles.tableCellContainer}>
            <Text style={styles.tableCellLabel}>Servings:</Text>
            <Text style={styles.tableCell}>{recipeDetails.servings || 'N/A'}</Text>
          </View>
        </View>

        <View style={styles.tableRow}>
          <View style={styles.tableCellContainer}>
            <Text style={styles.tableCellLabel}>Yield:</Text>
            <Text style={styles.tableCell}>{recipeDetails.servings || 'N/A'} servings</Text>
          </View>
          {occasions && (
            <View style={styles.tableCellContainer}>
              <Text style={styles.tableCellLabel}>Occasions:</Text>
              <Text style={styles.tableCell}>{occasions}</Text>
            </View>
          )}
        </View>

        <TouchableOpacity onPress={() => nutritionRef.current.measure((fx, fy, width, height, px, py) => scrollViewRef.current.scrollTo({ y: py, animated: true }))}>
          <Text style={styles.linkText}>Nutritional Facts</Text>
        </TouchableOpacity>
      </View>

      {/* Ingredients Section */}
      <View style={styles.ingredientsContainer}>
        <Text style={styles.ingredientsTitle}>Ingredients</Text>
        {adjustedIngredients.map((ingredient) => (
          <Text key={`${ingredient.name}-${multiplier}`} style={styles.ingredientItem}>
            {ingredient.quantity.toFixed(2)} {ingredient.unit} {ingredient.name}
          </Text>
        ))}
      </View>

      {/* Instructions Section */}
      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionsTitle}>Instructions</Text>
        {recipeDetails.instructions
          ? stripHtmlTags(recipeDetails.instructions).split('. ').map((step, index) => (
              <View key={index}>
                <Text style={styles.instructionStep}>Step {index + 1}:</Text>
                <Text style={styles.instructionText}>{step.trim()}</Text>
              </View>
            ))
          : <Text>No instructions available.</Text>
        }
      </View>

      {/* Nutritional Facts Section */}
      <View ref={nutritionRef} style={styles.nutritionContainer}>
        <Text style={styles.nutritionTitle}>Nutritional Facts</Text>
        <Text style={styles.nutritionItem}>Calories: {calories}</Text>
        <Text style={styles.nutritionItem}>Fat: {fat}</Text>
        <Text style={styles.nutritionItem}>Protein: {protein}</Text>
      </View>

      {/* Footer Section */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2024 Savory Stories</Text>
        <View style={styles.socialIcons}>
          <TouchableOpacity>
            <Ionicons name="logo-facebook" size={30} color="#fff" style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="logo-twitter" size={30} color="#fff" style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="logo-instagram" size={30} color="#fff" style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  hamburgerMenuText: {
    fontSize: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  tableContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  tableCellContainer: {
    flex: 1,
  },
  tableCellLabel: {
    fontWeight: 'bold',
  },
  tableCell: {
    marginTop: 5,
  },
  linkText: {
    color: 'blue',
    textDecorationLine: 'underline',
    marginBottom: 10,
  },
  quantitySelector: {
    marginBottom: 20,
  },
  quantityLabel: {
    fontWeight: 'bold',
  },
  quantityButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  quantityButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#e0e0e0',
  },
  selectedButton: {
    backgroundColor: '#6200ee',
  },
  quantityButtonText: {
    color: '#000',
  },
  ingredientsContainer: {
    marginBottom: 20,
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
    marginBottom: 20,
  },
  instructionsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  instructionStep: {
    fontWeight: 'bold',
  },
  instructionText: {
    fontSize: 16,
  },
  nutritionContainer: {
    marginBottom: 20,
  },
  nutritionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  nutritionItem: {
    fontSize: 16,
  },
  footer: {
    backgroundColor: '#6200ee',
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
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
    margin: 5,
  },
});

export default Detailsec;
