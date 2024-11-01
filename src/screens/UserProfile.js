import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator } from "react-native";
import { auth, db } from "../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

function Profile() {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state for fetching user data
  const [isEditing, setIsEditing] = useState(false); // State to toggle edit mode
  const [updatedFirstName, setUpdatedFirstName] = useState("");
  const [updatedLastName, setUpdatedLastName] = useState("");

  const fetchUserData = async () => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const docRef = doc(db, "Users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserDetails(data);
          setUpdatedFirstName(data.firstName); // Pre-fill first name
          setUpdatedLastName(data.lastName); // Pre-fill last name
        } else {
          console.log("No such user document!");
        }
      } else {
        console.log("User is not logged in");
      }
      setLoading(false); // Set loading to false after fetching data
    });

    return () => unsubscribe(); // Clean up subscription on unmount
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  async function handleLogout() {
    try {
      await auth.signOut();
      console.log("User logged out successfully!");
      // You can use navigation to go back to the login screen
      // navigation.navigate("Login");
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  }

  const handleUpdateProfile = async () => {
    try {
      const user = auth.currentUser;
      const docRef = doc(db, "Users", user.uid);
      await updateDoc(docRef, {
        firstName: updatedFirstName,
        lastName: updatedLastName,
      });
      setUserDetails((prevDetails) => ({
        ...prevDetails,
        firstName: updatedFirstName,
        lastName: updatedLastName,
      }));
      setIsEditing(false); // Exit edit mode after updating
      console.log("User profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error.message);
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : userDetails ? (
        <>
          <Text style={styles.welcomeText}>Welcome {userDetails.firstName}</Text>
          <Text>Email: {userDetails.email}</Text>
          <Text>First Name:</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={updatedFirstName}
              onChangeText={setUpdatedFirstName}
            />
          ) : (
            <Text>{userDetails.firstName}</Text>
          )}

          <Text>Last Name:</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={updatedLastName}
              onChangeText={setUpdatedLastName}
            />
          ) : (
            <Text>{userDetails.lastName}</Text>
          )}

          {isEditing ? (
            <>
              <Button title="Save Changes" onPress={handleUpdateProfile} />
              <Button title="Cancel" onPress={() => setIsEditing(false)} />
            </>
          ) : (
            <Button title="Edit Profile" onPress={() => setIsEditing(true)} />
          )}

          <Button title="Logout" onPress={handleLogout} />
        </>
      ) : (
        <Text>User not found!</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
    width: '100%', // Full width for input
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
});

export default Profile;
