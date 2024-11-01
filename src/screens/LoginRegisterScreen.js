import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { createUserWithEmailAndPassword, fetchSignInMethodsForEmail, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase";
import { setDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify"; // Consider using a React Native equivalent for toast notifications
import { useNavigation } from '@react-navigation/native'; // Import useNavigation

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
    <View style={styles.container}>
      <Text style={styles.header}>{isRegistering ? "Sign Up" : "Login"}</Text>

      {isRegistering && (
        <>
          <TextInput
            style={styles.input}
            placeholder="First name"
            value={fname}
            onChangeText={(text) => setFname(text)}
            required
          />
          <TextInput
            style={styles.input}
            placeholder="Last name"
            value={lname}
            onChangeText={(text) => setLname(text)}
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
      />

      <TextInput
        style={styles.input}
        placeholder="Enter password"
        secureTextEntry
        value={password}
        onChangeText={(text) => setPassword(text)}
        required
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
  },
  loginText: {
    marginTop: 20,
    textAlign: 'center',
  },
  link: {
    color: 'blue',
  },
});

export default LoginRegisterScreen;
