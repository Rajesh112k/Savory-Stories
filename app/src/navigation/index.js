import React, { useEffect, useState, useCallback } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from '../screens/HomeScreen';
import AboutScreen from '../screens/AboutScreen';
import { auth } from '../../../firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import UserProfile from '../screens/UserProfile';
import Detailsec from '../screens/Detailsec';
import LoginRegisterScreen from '../screens/LoginRegisterScreen';
import RecipeIndexScreen from '../screens/RecipeIndexScreen';
import RecipeCardsScreen from '../screens/RecipeCardsScreen';
import SubmitRecipe from '../screens/SubmitRecipe';
import FirePage from "../screens/FirePage"

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const HomeStack = React.memo(({ route }) => {
  const { category } = route.params || {};
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="HomeScreen" 
        options={{ headerShown: false }}
      >
        {props => <HomeScreen {...props} initialCategory={category} />}
      </Stack.Screen>
      <Stack.Screen 
        name="RecipeCards" 
        component={RecipeCardsScreen}
        options={{ title: 'Recipe Cards', headerShown: false }}

      />
      <Stack.Screen 
        name="Details" 
        component={Detailsec}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="FirePage" 
        component={FirePage} // Add the SubmitRecipe screen
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="SubmitRecipe" 
        component={SubmitRecipe} // Add the SubmitRecipe screen
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
    //It is to navigate from one page to another
  );
});

export default function AppNavigation() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  }, []);

  return (
    <Drawer.Navigator
    screenOptions={{
          headerShown: false, // Hide the header for the drawer screens
        }}>
      <Drawer.Screen name="Home" component={HomeStack} initialParams={{ category: "" }} />
      <Drawer.Screen name="About" component={AboutScreen} />
      <Drawer.Screen 
        name="Recipe Index" 
        component={RecipeIndexScreen} 
        options={{ headerShown: true }} 
      />
      <Drawer.Screen 
        name={isLoggedIn ? "Logout" : "Login"} 
        component={isLoggedIn ? () => {
          handleLogout();
          return null; 
        } : LoginRegisterScreen} 
      />
      {isLoggedIn && (
        <Drawer.Screen name="User Profile" component={UserProfile} />
      )}
    </Drawer.Navigator>
    //It is for Hamburger menu
  );
}
