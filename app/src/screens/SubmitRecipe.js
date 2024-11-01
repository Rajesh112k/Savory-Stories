import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Image,
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
      navigation.navigate("HomeScreen"); // Navigate back to HomeScreen after submission
    } catch (error) {
      console.error("Error submitting recipe:", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Submit Your Recipe</Text>

      <TextInput
        style={styles.input}
        placeholder="Recipe Name"
        value={recipeName}
        onChangeText={setRecipeName}
      />
      <TextInput
        style={styles.input}
        placeholder="Total Time (e.g., 30 mins)"
        value={totalTime}
        onChangeText={setTotalTime}
      />
      <TextInput
        style={styles.input}
        placeholder="Servings"
        value={servings}
        onChangeText={setServings}
      />
      <TextInput
        style={styles.input}
        placeholder="Yield"
        value={yieldAmount}
        onChangeText={setYieldAmount}
      />
      <TextInput
        style={styles.input}
        placeholder="Ingredients (comma separated)"
        value={ingredients}
        onChangeText={setIngredients}
      />
      <TextInput
        style={styles.input}
        placeholder="Instructions"
        value={instructions}
        onChangeText={setInstructions}
      />
      <TextInput
        style={styles.input}
        placeholder="Summary"
        value={summary}
        onChangeText={setSummary}
      />

      <TouchableOpacity style={styles.imagePicker} onPress={handleImagePicker}>
        <Text style={styles.imagePickerText}>
          {image ? "Change Recipe Image" : "Pick a Recipe Image"}
        </Text>
      </TouchableOpacity>

      {image && <Image source={{ uri: image }} style={styles.image} />}

      <Button title="Submit Recipe" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: '#ff6347',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'white',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
    color: 'white',
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
  },
});

export default SubmitRecipe;
