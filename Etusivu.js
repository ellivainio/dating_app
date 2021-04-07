import React from "react";
import { StyleSheet, Text, View, SafeAreaView, ImageBackground, Image, ScrollView, Pressable } from "react-native";
import { Icon, Header } from 'react-native-elements';
import sky from './assets/sky.jpeg';
import * as firebase from 'firebase';
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

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // if already initialized, use that one
}

export default function Etusivu({ navigation }) {

  //fontFamilys
  const [fontsLoaded] = useFonts({
    'Fascinate_Inline': require('./assets/fonts/FascinateInline-Regular.ttf'),
    'Fascinate': require('./assets/fonts/Fascinate-Regular.ttf'),
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  } else {
    return (
      <SafeAreaView style={styles.container}>
        <ImageBackground source={sky} style={styles.background}>
          <Header
            leftComponent={ <Text style={styles.hamppari} onPress={() => navigation.openDrawer()}><Icon type="material" color="#b491b8" name="menu"/></Text> }
            centerComponent={ <Text style={styles.otsikko} onPress={() => navigation.navigate("Etusivu")}>DEITTIAPPI</Text> }
            rightComponent={ <Text style={styles.home} onPress={() => navigation.navigate("Oma Profiili")}><Icon type="font-awesome" color="#b491b8" name="user"/></Text> }
            backgroundColor='#fff'
          />
          <ScrollView style={styles.inner}>
            <View style={{height: 20}}></View>
            <Text style={styles.alaotsikko}>TERVETULOA DEITTIAPPIIN!</Text>
            <View style={styles.textview}>
              <Pressable style={{flexDirection: 'row'}} onPress={() => navigation.navigate('Asetukset')}>
                <Image style={{width: '50%', height: 160, borderRadius: 100}} source={{uri: 'https://images.pexels.com/photos/3769022/pexels-photo-3769022.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500'}} />
                <View style={{justifyContent: 'center', alignItems: 'center', width: '50%'}}>
                  <Text style={styles.text}>päivitä omaa profiiliasi</Text>
                </View>
              </Pressable>
              <Pressable style={{flexDirection: 'row'}} onPress={() => navigation.navigate('Deittaile')}>
                <View style={{justifyContent: 'center', alignItems: 'center', width: '50%'}}>
                  <Text style={styles.text}>löydä kiinnostavia ihmisiä</Text>
                </View>
                <Image style={{width: '50%', height: 160, borderRadius: 100}} source={{uri: 'https://images.pexels.com/photos/7339178/pexels-photo-7339178.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500'}} />
              </Pressable>
              <Pressable style={{flexDirection: 'row'}} onPress={() => navigation.navigate('Deittaile')}>
                <Image style={{width: '50%', height: 160, borderRadius: 100}} source={{uri: 'https://images.pexels.com/photos/3799821/pexels-photo-3799821.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940'}} />
                <View style={{justifyContent: 'center', alignItems: 'center', width: '50%'}}>
                  <Text style={styles.text}>chattaile ja tutustu</Text>
                </View>
              </Pressable>
              <Pressable style={{flexDirection: 'row'}} onPress={() => navigation.navigate('Deittaile')}>
                <View style={{justifyContent: 'center', alignItems: 'center', width: '50%'}}>
                  <Text style={styles.text}>deittaile ja löydä rakkaus</Text>
                </View>
                <Image style={{width: '50%', height: 160, borderRadius: 100}} source={{uri: 'https://images.pexels.com/photos/5637541/pexels-photo-5637541.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940'}} />
              </Pressable>
            </View>
          </ScrollView>
          </ImageBackground>
      </SafeAreaView>
    );
  }
}


const styles = StyleSheet.create({
  otsikko: {
    fontSize: 33,
    color: '#b491b8',
    fontFamily: 'Fascinate_Inline',
  },
  hamppari: {
    paddingLeft: 12,
    paddingTop: 12,
  },
  home: {
    paddingRight: 12,
    paddingTop: 12,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    backgroundColor: '#b491b8',
  },
  inner: {
    flex: 1,
    width: '100%',
  },
  alaotsikko: {
    fontSize: 40,
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'Fascinate',
  },
  username: {
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
    marginTop: 10
  },
  uusikäyttäjä: {
    marginTop: 20
  },
  ikoni: {
    alignItems: 'center',
    alignContent: 'center',
    textAlign: 'center',
    justifyContent: 'center',
  },
  uusiviesti: {
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
    marginTop: 10
  },
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    width: '100%',
  },
  textview: {
    alignSelf: 'center',
    alignItems: 'center',
    width: '90%',
    marginTop: 20,
    marginBottom: 20
  },
  text: {
    fontSize: 25,
    color: '#fff',
    width: '100%',
    fontFamily: 'sans-serif-light',
    textAlign: 'center',
    padding: 10
  },
  icon: {
    padding: 2,
  },
});