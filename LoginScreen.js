import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TextInput, Button, Alert, ImageBackground } from "react-native";
import { Icon } from 'react-native-elements';
import couple from './assets/couple.jpeg';
import firebase from "firebase";
import AppLoading from 'expo-app-loading';
import { useFonts } from '@expo-google-fonts/inter';

//firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_APIKEY",
  authDomain: "YOUR_AUTHDOMAIN",
  databaseURL: "YOUR_DATABASEURL",
  projectId: "YOUR_PROJECTID",
  storageBucket: "YOUR_STORAGEBUCKET",
  messagingSenderId: "YOUR_MESSAGINGSENDERID",
  appId: "YOUR_APPID"
};

// initializing firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // if already initialized
}

export default function LoginScreen({ navigation }) {

  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const user = firebase.auth().currentUser;

  //fontFamilys
  const [fontsLoaded] = useFonts({
    'Fascinate_Inline': require('./assets/fonts/FascinateInline-Regular.ttf'),
  });

  useEffect(() => {
    //if user has already signed in
    if (user) {
      navigation.navigate("Etusivu");
    } else {
      console.log('Kirjaudu sisään!');
    }
  }, []);

  //signing in
  const userLogin = () => {
    if (email === "" || password === "") {
      Alert.alert("Syötä sähköpostiosoite ja salasana!");
    } else {
      setIsLoading({
        isLoading: true,
      });
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then((res) => {
          setIsLoading({
            isLoading: false,
          });
          navigation.navigate("Etusivu");
        });
    }
  };

  if (!fontsLoaded) {
    return <AppLoading />;
  } else {
    return (
      <View style={styles.container}>
        <ImageBackground source={couple} style={styles.background}>
          <View style={styles.icons}>
            <Text style={styles.otsikko}>DEITTIAPPI</Text>
          </View>
            <View style={styles.inputs}>
              <TextInput
                style={styles.input}
                placeholder="sähköposti"
                value={String(email)}
                onChangeText={(email) => setEmail(email)}
              />
              <TextInput
                style={styles.input}
                placeholder="salasana"
                value={String(password)}
                onChangeText={(password) => setPassword(password)}
                maxLength={15}
                secureTextEntry={true}
              />
              <Button color="#5b415e" title="KIRJAUDU SISÄÄN" onPress={() => userLogin()} />
              <View style={styles.signup}>
                <Text>Jos olet uusi käyttäjä, rekisteröidy </Text>
                <Text onPress={() => navigation.navigate("Rekisteröidy")} style={{color: '#6533a1'}}>tästä.</Text>
              </View>
            </View>
          </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#b491b8',
  },
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    width: '100%',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center'
  },
  icons: {
    flexDirection: 'row',
  },
  otsikko: {
    fontSize: 46,
    color: '#fff',
    fontFamily: 'Fascinate_Inline'
  },
  icon: {
    padding: 5,
  },
  inputs: {
    marginTop: 20,
    width: '75%'
  },
  input: {
    fontSize: 20,
    backgroundColor: '#fff',
    color: '#000',
    padding: 5,
    marginBottom: 20
  },
  signup: {
    margin: 10,
    flexDirection: 'row'
  },
});