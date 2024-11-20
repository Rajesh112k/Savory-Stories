import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator, TouchableOpacity, ImageBackground } from "react-native";
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
  const [updatedEmail, setUpdatedEmail] = useState(""); // Added state for email

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
          setUpdatedEmail(data.email); // Set email to state
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
    <ImageBackground 
      source={require('../../../recipemusic.jpeg')}
      //I have taken it from Unsplash.com.
      style={styles.backgroundImage}
      imageStyle={styles.imageStyle}
    >
      <View style={styles.overlay} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Text style={styles.headerText}>Savory Stories</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu" size={28} color="#ff6347" />
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color="#ffffff" />
        ) : userDetails ? (
          <>
            <Text style={styles.welcomeText}>Welcome {userDetails.firstName}!</Text>
            <Text style={styles.infoText}>Email: {userDetails.email}</Text>
            {isEditing ? (
              <>
                <Text style={styles.label}>Email:</Text>
                <TextInput
                  style={styles.input}
                  value={updatedEmail}
                  onChangeText={setUpdatedEmail}
                  editable={false} // Email is not editable
                />
              </>
            ) : (
              <Text style={styles.valueText}>{userDetails.email}</Text>
            )}

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

            {/* <TouchableOpacity style={styles.addRecipeButton} onPress={() => navigation.navigate('Personalised Collection')}>
              <Text style={styles.buttonText}>Personalized Collections</Text>
            </TouchableOpacity> */}

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={24} color="white" />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text style={styles.errorText}>User not found!</Text>
        )}
      </View>

      {/* Footer comes after the recipe content */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2024 Savory Stories. All rights reserved.</Text>
        <View style={styles.socialLinks}>
          <TouchableOpacity onPress={() => console.log("Navigate to Facebook")}>
            <Ionicons name="logo-facebook" size={30} color="white" style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => console.log("Navigate to Twitter")}>
            <Ionicons name="logo-twitter" size={30} color="white" style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => console.log("Navigate to Instagram")}>
            <Ionicons name="logo-instagram" size={30} color="white" style={styles.icon} />
          </TouchableOpacity>
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
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 20 },
  headerText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ff6347',
  },
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
    marginTop: 20,
  },
  button: {
    backgroundColor: '#ff6347',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: '45%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  addRecipeButton: {
    backgroundColor: '#ff6347',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 5,
  },
  logoutText: {
    color: 'white',
    fontSize: 18,
    marginLeft: 10,
  },
  footer: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    color: 'white',
    fontSize: 14,
  },
  socialLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  icon: {
    marginHorizontal: 15,
  },
  errorText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  }
});

export default UserProfile;
