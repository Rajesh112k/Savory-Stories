import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from '../screens/HomeScreen';
import AboutScreen from '../screens/AboutScreen';
import AuthScreen from '../screens/AuthScreen';
import { auth } from '../../firebase'; 
import { signOut, onAuthStateChanged } from 'firebase/auth';
import UserProfileScreen from '../screens/UserProfileScreen';
import UserProfile from "../screens/UserProfile";
import Detailsec from '../screens/Detailsec';
import LoginRegisterScreen from '../screens/LoginRegisterScreen';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="HomeScreen" 
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Details" 
        component={Detailsec}
        options={{ headerShown: false }}
      />
      
    </Stack.Navigator>
  );
}

export default function AppNavigation() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <NavigationContainer>
      <Drawer.Navigator>
        <Drawer.Screen name="Home" component={HomeStack} />
        <Drawer.Screen name="About" component={AboutScreen} />
        <Drawer.Screen 
          name={isLoggedIn ? "Logout" : "Login"} 
          component={isLoggedIn ? () => {
            handleLogout(); // Call logout on navigation
            return null; // Return null to prevent rendering a component
          } : LoginRegisterScreen} 
        />
         <Drawer.Screen name="Use" component={UserProfile} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
