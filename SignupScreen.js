import React, { useState } from "react";
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

export default function SignupScreen({ navigation }) {

  const [displayName, setDisplayName] = useState("");
  const [displayAge, setDisplayAge] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const useremail = email.replace(/\./g,'');

  //fontFamilys
  const [fontsLoaded] = useFonts({
    'Fascinate_Inline': require('./assets/fonts/FascinateInline-Regular.ttf'),
  });

  //signing up user
  const registerUser = () => {
    if (displayName === "" || displayAge === "" || email === "" || password === "") {
      Alert.alert("Syötä nimi, ikä, sähköpostiosoite ja salasana!");
    } else {
      if (email.includes('@') && email.includes('.')) {
        if (isNaN(displayAge)){
          Alert.alert('Ilmoita ikäsi numeroina!');
        } else {
          if (displayAge < 18) {
            Alert.alert('Sovellus on vain täysi-ikäisille!')
          } else {
            firebase
              .auth()
              .createUserWithEmailAndPassword(email, password)
              .then((res) => {
                res.user.updateProfile({
                  displayName: displayName,
                  displayAge: displayAge,
                });
                firebase.database().ref('profiilit/'+useremail).update(
                  {'rekisteröitymisnimi': displayName, 'ikä': displayAge, 'email': email, 'salasana': password, 'kuva': 'https://www.fluidogroup.com/wp-content/uploads/2018/09/user-icon-silhouette-ae9ddcaf4a156a47931d5719ecee17b9.png' }
                );
              });
            Alert.alert("Käyttäjä rekisteröity onnistuneesti!");
            navigation.navigate("Kirjaudu sisään");
          }
        }
      } else {
        Alert.alert('Virheellinen sähköpostiosoite!');
      }
    }
  }

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
              placeholder="nimi"
              value={String(displayName)}
              onChangeText={(displayName) => setDisplayName(displayName)}
            />
            <TextInput
              style={styles.input}
              placeholder="ikä"
              value={displayAge}
              onChangeText={(displayAge) => setDisplayAge(displayAge)}
              maxLength={2}
            />
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
            <Button color="#5b415e" title="REKISTERÖIDY" onPress={() => registerUser()} />
            <View style={styles.signin}>
              <Text>Takaisin sisääkirjautumiseen </Text>
              <Text onPress={() => navigation.navigate("Kirjaudu sisään")} style={{color: '#6533a1'}}>tästä.</Text>
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
  signin: {
    margin: 10,
    flexDirection: 'row'
  },
});