import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import axios from 'axios';

const API_KEY = '5505f39719a8493ca4c0413123c3084b';

const Detailsec = ({ route, navigation }) => {
  const { recipeId } = route.params;
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
        console.log(response.data)
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
    quantity: ingredient.amount * multiplier, // Adjust quantity
  }));

  return (
    
    <ScrollView ref={scrollViewRef} style={styles.container}>
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
          <Text style={styles.linkText}>Nutrients Facts</Text>
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
          <Text key={ingredient.id} style={styles.ingredientItem}>
            {ingredient.quantity.toFixed(2)} {ingredient.unit} {ingredient.name}
          </Text>
        ))}
      </View>
      
      
<View style={styles.instructionsContainer}>
  <Text style={styles.instructionsTitle}>Instructions</Text>
  {recipeDetails.instructions
    ? recipeDetails.instructions.split('. ').reduce((acc, step, index) => {
        
        const groupIndex = Math.floor(index / 2); 
        acc[groupIndex] = (acc[groupIndex] || []).concat(step.trim());
        return acc;
      }, []).map((group, index) => (
        <View key={index}>
          <Text style={styles.instructionstep}>Step {index + 1}:</Text>
          <Text style={styles.instructionsText}>
            {group.join('. ')}.
          </Text>
        </View>
      ))
    : <Text style={styles.instructionsText}>No instructions available.</Text>}
</View>

{/* Nutrition Facts Section */}
<View style={styles.nutritionContainer} ref={nutritionRef}>
        <Text style={styles.nutritionTitle}>Nutrition Facts (per serving)</Text>
        <View style={styles.nutritionRow}>
          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionLabel}>Calories:</Text>
            <Text style={styles.nutritionValue}>{calories}</Text>
          </View>
          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionLabel}>Fat:</Text>
            <Text style={styles.nutritionValue}>{fat}g</Text>
          </View>
          
          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionLabel}>Protein:</Text>
            <Text style={styles.nutritionValue}>{protein}g</Text>
          </View>
        </View>
        
      </View>


      {/* Go Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('HomeScreen')}>
        <Text style={styles.backButtonText}>Go Back to Homepage</Text>
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
    marginHorizontal: 5,
    backgroundColor: '#007AFF',
    borderRadius: 5,
  },
  selectedButton: {
    backgroundColor: '#0056b3', // Darker blue for selected button
  },
  quantityButtonText: {
    color: '#fff',
  },
  ingredientsContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  ingredientsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  ingredientItem: {
    fontSize: 16,
    color: '#333',
    marginVertical:5,
  },
  nutritionContainer: {
    marginTop: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginHorizontal:10,
    paddingHorizontal:10,
    marginTop:20,
  },
  nutritionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  nutritionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical:10,
  },
  nutritionItem: {
    flex: 1,
  },
  nutritionLabel: {
    fontWeight: 'bold',
    color: '#333',
  },
  nutritionValue: {
    color: '#333',
  },
  backButton: {
    marginTop: 20,
    marginBottom: 40,
    padding: 15,
    backgroundColor: '#007AFF',
    borderRadius: 5,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  instructionsTitle: {
    marginVertical: 10,
    fontWeight:'bold',
    fontSize: 24,
  },
  instructionsText: {
    marginVertical: 10,
    fontSize:17,
  },
  instructionsContainer: {
    marginTop:20,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    
  },
  instructionstep: {
    fontSize:18,
    fontWeight:'bold',
  }
});

export default Detailsec;
