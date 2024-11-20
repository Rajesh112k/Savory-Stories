import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, ImageBackground, TouchableOpacity } from "react-native";
import { createUserWithEmailAndPassword, fetchSignInMethodsForEmail, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../../firebase";
import { setDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify"; // Consider using a React Native equivalent for toast notifications
import { useNavigation } from '@react-navigation/native'; // Import useNavigation
import { Ionicons } from '@expo/vector-icons';

function LoginRegisterScreen() {
  const navigation = useNavigation(); // Initialize navigation
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [isRegistering, setIsRegistering] = useState(true); // State to toggle between login and register

  const handleRegister = async () => {
    try {
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);
      if (signInMethods.length > 0) {
        throw new Error("Email already in use. Please use a different email.");
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (user) {
        await setDoc(doc(db, "Users", user.uid), {
          email: user.email,
          firstName: fname,
          lastName: lname,
          photo: "",
        });
        console.log("User Registered Successfully!!");
        toast.success("User Registered Successfully!!", {
          position: "top-center",
        });

        // Clear the input fields
        setEmail("");
        setPassword("");
        setFname("");
        setLname("");

        // Navigate to Home screen after successful registration
        navigation.navigate('HomeScreen'); // Change 'HomeScreen' to your actual Home screen name
      }
    } catch (error) {
      console.log(error.message);
      toast.error(error.message, {
        position: "bottom-center",
      });
    }
  };

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (user) {
        console.log("User Logged In Successfully!!");
        toast.success("User Logged In Successfully!!", {
          position: "top-center",
        });

        // Clear the input fields
        setEmail("");
        setPassword("");

        // Navigate to Home screen after successful login
        navigation.navigate('HomeScreen'); // Change 'HomeScreen' to your actual Home screen name
      }
    } catch (error) {
      console.log(error.message);
      toast.error(error.message, {
        position: "bottom-center",
      });
    }
  };

  return (
    <ImageBackground 
      source={require('../../../recipemusic.jpeg')}
      style={styles.backgroundImage}
      imageStyle={styles.imageStyle}
    >
      <View style={styles.overlay} />
      <View style={styles.headc}>
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
      </View>
    <View style={styles.container}>
      <Text style={styles.header1}>{isRegistering ? "Sign Up" : "Login"}</Text>

      {isRegistering && (
        <>
          <TextInput
            style={styles.input}
            placeholder="First name"
            value={fname}
            onChangeText={(text) => setFname(text)}
            required
            placeholderTextColor = 'white'
          />
          <TextInput
            style={styles.input}
            placeholder="Last name"
            value={lname}
            onChangeText={(text) => setLname(text)}
            placeholderTextColor = 'white'
          />
        </>
      )}

      <TextInput
        style={styles.input}
        placeholder="Enter email"
        keyboardType="email-address"
        value={email}
        onChangeText={(text) => setEmail(text)}
        required
        placeholderTextColor = 'white'
      />

      <TextInput
        style={styles.input}
        placeholder="Enter password"
        secureTextEntry
        value={password}
        onChangeText={(text) => setPassword(text)}
        required
        placeholderTextColor = 'white'
      />

      {isRegistering ? (
        <Button title="Sign Up" onPress={handleRegister} />
      ) : (
        <Button title="Login" onPress={handleLogin} />
      )}

      <Text style={styles.loginText}>
        {isRegistering ? "Already registered?" : "Need an account?"} 
        <Text style={styles.link} onPress={() => setIsRegistering(!isRegistering)}>
          {isRegistering ? " Login" : " Sign Up"}
        </Text>
      </Text>
    </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  header1: {
    fontSize: 24,
    marginBottom: 20,
    color: 'white',
  },
  input: {
    height: 40,
    borderColor: 'white',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
    color: 'white',
  },
  loginText: {
    marginTop: 20,
    textAlign: 'center',
    color: 'white',
  },
  link: {
    color: 'red',
    fontWeight:'bold',
    fontSize: 18,
  },
  backgroundImage: {
    flex: 1,
  },
  imageStyle: {
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject, // Makes the overlay cover the entire view
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black
    opacity:0.2
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
  headc: {
    marginHorizontal:20,
    marginTop: 20,
  }
});

export default LoginRegisterScreen;
