import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from './LoginScreen';
import SignupScreen from './SignupScreen';
import Etusivu from './Etusivu';
import DrawerNavigator from './DrawerNavigator';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
      <Stack.Screen name="Kirjaudu sisään" component={LoginScreen} hidden={true} options={{ headerShown: false }}/>
      <Stack.Screen name="Rekisteröidy" component={SignupScreen} hidden={true} options={{ headerShown: false }} />
      <Stack.Screen name="Etusivu" component={DrawerNavigator} hidden={true} options={{ headerShown: false }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
