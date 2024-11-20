import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native'; 
import { Ionicons } from '@expo/vector-icons';
// Import useNavigation for navigation

const API_KEY = '01937fb6b13b4bc696c141a148bef97f';

const Detailsec = ({ route }) => {
  const { recipeId } = route.params;
  const navigation = useNavigation(); 
  // Use useNavigation hook for navigation
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
        console.log("the recipe id is:", recipeId)
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

  const scrollToNutrition = () => {
    nutritionRef.current.measure((fx, fy, width, height, px, py) => {
      scrollViewRef.current.scrollTo({ y: py, animated: true });
    });
  };

  // Adjust ingredient quantity based on the multiplier
  const adjustedIngredients = recipeDetails.extendedIngredients.map(ingredient => ({
    ...ingredient,
    quantity: ingredient.amount * multiplier, 
    // Adjust quantity
  }));

  const stripHtmlTags = (html) => {
    return html.replace(/<[^>]+>/g, ''); 
    // Simple regex to remove HTML tags
  };

  return (
    <ImageBackground 
    source={require('../../../recipemusic.jpeg')}
    style={styles.backgroundImage}
    imageStyle={styles.imageStyle}
  >
    <View style={styles.overlay} />
    <ScrollView ref={scrollViewRef} style={styles.container}>
      {/* Header with Savory Stories title and hamburger menu */}
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

      {/* Tabular format for recipe details */}
      <View style={styles.tableContainer}>
        <View style={styles.tableRow}>
          {recipeDetails.preparationMinutes && (
            <View style={styles.tableCellContainer}>
              <Text style={styles.tableCellLabel}>Prep Time:</Text>
              <Text style={styles.tableCell}>{recipeDetails.preparationMinutes || 'N/A'} minutes</Text>
            </View>
          )}
          {recipeDetails.cookingMinutes && (
            <View style={styles.tableCellContainer}>
              <Text style={styles.tableCellLabel}>Cook Time:</Text>
              <Text style={styles.tableCell}>{recipeDetails.cookingMinutes || 'N/A'} minutes</Text>
            </View>
          )}
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

        <TouchableOpacity onPress={scrollToNutrition}>
          <Text style={styles.linkText}>Nutritional Facts</Text>
        </TouchableOpacity>
      </View>

      {/* Quantity Selector */}
      <View style={styles.quantitySelector}>
        <Text style={styles.quantityLabel}>Select Quantity:</Text>
        <View style={styles.quantityButtons}>
          {['1x', '2x', '3x'].map((label, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.quantityButton, multiplier === index + 1 && styles.selectedButton]}
              onPress={() => setMultiplier(index + 1)} // Update multiplier
            >
              <Text style={styles.quantityButtonText}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>
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
        <View style={styles.nutritioncont}>
        <Text style={styles.nutritionItem}><Text style={styles.nutritiontext}>Calories: </Text>{calories}</Text>
        <Text style={styles.nutritionItem}><Text style={styles.nutritiontext}>Fat: </Text>{fat}</Text>
        <Text style={styles.nutritionItem}><Text style={styles.nutritiontext}>Protein: </Text>{protein}</Text>
        </View>
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
    </ImageBackground>
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
  hamburgerMenuText: {
    fontSize: 30,
    color: '#ff6347',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#ff6347',
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
    textAlign:'center',

  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center', // Center-aligns items vertically
    marginBottom: 10,
  },
  tableCellContainer: {
    flex: 1,
    alignItems: 'center', // Aligns content horizontally
  },
  tableCellLabel: {
    fontWeight: 'bold',
    textAlign: 'center', // Centers text inside the label
  },
  tableCell: {
    marginTop: 5,
    textAlign: 'center', // Centers text inside the cell
  },
  linkText: {
    color: 'blue',
    textDecorationLine: 'underline',
    marginBottom: 10,
    textAlign:'center',
  },
  quantitySelector: {
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  quantityLabel: {
    fontWeight: 'bold',
    marginBottom:20,
    fontSize: 20,
  },
  quantityButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom:20,
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
    color: '#fff',
  },
  ingredientsContainer: {
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    
  },
  ingredientsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  ingredientItem: {
    fontSize: 16,
    marginBottom: 5,
  },
  instructionsContainer: {
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  instructionsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  instructionStep: {
    fontWeight: 'bold',
    fontSize:16,
    marginBottom:10,
  },
  instructionText: {
    marginBottom: 10,
  },
  nutritionContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 10,
    marginBottom: 40,
  },
  nutritionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  nutritionItem: {
    fontSize: 16,
  },
  nutritioncont: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
  },
  nutritiontext: {
    fontWeight:'bold',
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
});

export default Detailsec;
