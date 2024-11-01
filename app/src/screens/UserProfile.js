import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
import { auth, db } from "../../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

function UserProfile() {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedFirstName, setUpdatedFirstName] = useState("");
  const [updatedLastName, setUpdatedLastName] = useState("");

  const navigation = useNavigation(); // Get the navigation object

  const fetchUserData = async () => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const docRef = doc(db, "Users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserDetails(data);
          setUpdatedFirstName(data.firstName);
          setUpdatedLastName(data.lastName);
        } else {
          console.log("No such user document!");
        }
      } else {
        console.log("User is not logged in");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  async function handleLogout() {
    try {
      await auth.signOut();
      console.log("User logged out successfully!");
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
      setIsEditing(false);
      console.log("User profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error.message);
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#ffffff" />
      ) : userDetails ? (
        <>
          <Text style={styles.welcomeText}>Welcome {userDetails.firstName}!</Text>
          <Text style={styles.infoText}>Email: {userDetails.email}</Text>
          <Text style={styles.label}>First Name:</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={updatedFirstName}
              onChangeText={setUpdatedFirstName}
            />
          ) : (
            <Text style={styles.valueText}>{userDetails.firstName}</Text>
          )}

          <Text style={styles.label}>Last Name:</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={updatedLastName}
              onChangeText={setUpdatedLastName}
            />
          ) : (
            <Text style={styles.valueText}>{userDetails.lastName}</Text>
          )}

          <View style={styles.buttonContainer}>
            {isEditing ? (
              <>
                <TouchableOpacity style={styles.button} onPress={handleUpdateProfile}>
                  <Text style={styles.buttonText}>Save Changes</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => setIsEditing(false)}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity style={styles.button} onPress={() => setIsEditing(true)}>
                <Text style={styles.buttonText}>Edit Profile</Text>
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity style={styles.addRecipeButton} onPress={() => navigation.navigate('SubmitRecipe')}>
            <Text style={styles.buttonText}>Add a New Recipe</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color="white" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text style={styles.errorText}>User not found!</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 10,
    padding: 20,
    width: '90%',
  },
  input: {
    height: 40,
    borderColor: 'white',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
    color: 'white',
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "bold",
    color: '#ff6347',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    color: 'white',
    marginBottom: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 5,
  },
  valueText: {
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#ff6347',
    borderRadius: 5,
    padding: 10,
    width: '48%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  addRecipeButton: {
    backgroundColor: '#32cd32', // Green color for the add recipe button
    borderRadius: 5,
    padding: 10,
    marginTop: 15,
    alignItems: 'center',
    width: '100%',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: '#dc143c',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    justifyContent: 'center',
  },
  logoutText: {
    color: '#ffffff',
    marginLeft: 10,
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 16,
    color: 'white',
  },
});

export default UserProfile;
