// AppNavigation.js
import React, { useEffect, useState, useCallback } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from '../screens/HomeScreen';
import AboutScreen from '../screens/AboutScreen';
import { auth, db } from '../../../firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import UserProfile from '../screens/UserProfile';
import Detailsec from '../screens/Detailsec';
import LoginRegisterScreen from '../screens/LoginRegisterScreen';
import RecipeIndexScreen from '../screens/RecipeIndexScreen';
import RecipeCardsScreen from '../screens/RecipeCardsScreen';
import SubmitRecipe from '../screens/SubmitRecipe';
import PersonalizedRecipesScreen from '../screens/PersonalizedRecipesScreen';
import PersonalizedCollectionScreen from '../screens/personalizedcollections';
import WelcomeScreen from '../screens/WelcomeScreen';
import FirePage from '../screens/FirePage';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

// HomeStack Navigator
const HomeStack = React.memo(({ route }) => {
  const { category } = route.params || {};
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="HomeScreen" 
        component={HomeScreen} 
        options={{ headerShown: false }} 
        initialParams={{ category }} 
      />
      <Stack.Screen name="RecipeCards" component={RecipeCardsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Details" component={Detailsec} options={{ headerShown: false }} />
      <Stack.Screen name="SubmitRecipe" component={SubmitRecipe} options={{ headerShown: false }} />
      <Stack.Screen name="CollectionDetails" component={PersonalizedCollectionScreen} options={{ headerShown: false }} />
      <Stack.Screen name="firepage" component={FirePage} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
});

// Main Drawer Navigator
function MainDrawerNavigator() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasFavorites, setHasFavorites] = useState(false);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
      if (user) {
        const userEmail = user.email;
        const favoritesQuery = query(collection(db, 'Favorites'), where("userEmail", "==", userEmail));
        
        // Listen to real-time updates
        const unsubscribeFavorites = onSnapshot(favoritesQuery, (snapshot) => {
          setHasFavorites(!snapshot.empty);
        });

        // Clean up the listener when the component unmounts or user logs out
        return () => unsubscribeFavorites();
      } else {
        setHasFavorites(false);
      }
    });

    return unsubscribeAuth;
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  }, []);

  return (
    <Drawer.Navigator screenOptions={{ headerShown: false }}>
      <Drawer.Screen name="Home" component={HomeStack} initialParams={{ category: "" }} />
      <Drawer.Screen name="About" component={AboutScreen} />
      {isLoggedIn && hasFavorites && (
        <Drawer.Screen name="Personalised Collection" component={PersonalizedRecipesScreen} />
      )}
      <Drawer.Screen name="Recipe Index" component={RecipeIndexScreen} options={{ headerShown: false }} />
      <Drawer.Screen 
        name={isLoggedIn ? "Logout" : "Login"} 
        component={isLoggedIn ? () => {
          handleLogout();
          return null; 
        } : LoginRegisterScreen} 
      />
      {isLoggedIn && <Drawer.Screen name="User Profile" component={UserProfile} />}
    </Drawer.Navigator>
  );
}

// Root Navigator with Welcome Screen
export default function AppNavigation() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="MainDrawer" component={MainDrawerNavigator} />
    </Stack.Navigator>
  );
}