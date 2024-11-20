import React, { useState } from "react";
import { Ionicons } from '@expo/vector-icons'; 
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageBackground
} from "react-native";
import { auth, db } from "../../../firebase";
import { doc, setDoc } from "firebase/firestore";
import * as ImagePicker from "expo-image-picker";

function SubmitRecipe({ navigation }) {
  const [recipeName, setRecipeName] = useState("");
  const [totalTime, setTotalTime] = useState("");
  const [servings, setServings] = useState("");
  const [yieldAmount, setYieldAmount] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [summary, setSummary] = useState("");
  const [image, setImage] = useState(null);

  const handleImagePicker = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync();
    
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    const user = auth.currentUser;
    if (!user) return;
  
    const newRecipe = {
      recipeName,
      totalTime,
      servings,
      yield: yieldAmount,
      ingredients,
      instructions,
      summary,
      image,
      userId: user.uid,
      createdAt: new Date().toISOString(),
    };
  
    try {
      await setDoc(doc(db, "Recipes", `${user.uid}_${recipeName}`), newRecipe);
      console.log("Recipe submitted successfully!");
      alert("Recipe submitted successfully!");
      navigation.navigate("HomeScreen"); // Navigate back to HomeScreen after submission
    } catch (error) {
      console.error("Error submitting recipe:", error.message);
    }
  };
  

  return (
    <ImageBackground 
      source={require('../../../recipemusic.jpeg')}
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
    <View style={styles.container}>

      <Text style={styles.title}>Submit Your Recipe</Text>

      <TextInput
        style={styles.input}
        placeholder="Recipe Name"
        value={recipeName}
        onChangeText={setRecipeName}
        placeholderTextColor="#fff"
      />
      <TextInput
        style={styles.input}
        placeholder="Total Time (e.g., 30 mins)"
        value={totalTime}
        onChangeText={setTotalTime}
        placeholderTextColor="#fff"
      />
      <TextInput
        style={styles.input}
        placeholder="Servings"
        value={servings}
        onChangeText={setServings}
        placeholderTextColor="#fff"
      />
      <TextInput
        style={styles.input}
        placeholder="Yield"
        value={yieldAmount}
        onChangeText={setYieldAmount}
        placeholderTextColor="#fff"
      />
      <TextInput
        style={styles.input}
        placeholder="Ingredients (comma separated)"
        value={ingredients}
        onChangeText={setIngredients}
        placeholderTextColor="#fff"
      />
      <TextInput
        style={styles.input}
        placeholder="Instructions"
        value={instructions}
        onChangeText={setInstructions}
        placeholderTextColor="#fff"
      />
      <TextInput
        style={styles.input}
        placeholder="Summary"
        value={summary}
        onChangeText={setSummary}
        placeholderTextColor="#fff"
      />

      <TouchableOpacity style={styles.imagePicker} onPress={handleImagePicker}>
        <Text style={styles.imagePickerText}>
          {image ? "Change Recipe Image" : "Pick a Recipe Image"}
        </Text>
      </TouchableOpacity>

      {image && <Image source={{ uri: image }} style={styles.image} />}

      <Button title="Submit Recipe" onPress={handleSubmit} />
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
    </View>
    </ImageBackground>
  );
}

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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginHorizontal: 20,
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
  container: {
    flex: 1,
    justifyContent: 'center', // Centers form vertically
    alignItems: 'center', // Centers form horizontally
    padding: 20,
  },
  formWrapper: {
    width: '100%',
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: '#ff6347',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'white',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
    color: 'white',
    width: '90%',
  },
  imagePicker: {
    backgroundColor: '#32cd32',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  imagePickerText: {
    color: '#ffffff',
  },
  image: {
    width: 200,
    height: 200,
    marginVertical: 10,
    alignSelf: 'center',
  },
  footer: {
    marginTop: 20,
    width: '100%',
    backgroundColor: '#6200ee',
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


export default SubmitRecipe;
