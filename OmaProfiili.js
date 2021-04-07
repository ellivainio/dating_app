import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Image, Alert, SafeAreaView, ScrollView, Button, ImageBackground, Pressable } from "react-native";
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

// initializing firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // if already initialized
}

export default function Etusivu({ route, navigation }) {

  const [user, setUser] = useState('https://www.fluidogroup.com/wp-content/uploads/2018/09/user-icon-silhouette-ae9ddcaf4a156a47931d5719ecee17b9.png');
  const databaseuser = firebase.auth().currentUser;
  const useremail = databaseuser.email.replace(/\./g,'');
  const [namedata, setNamedata] = useState('');
  const [descdata, setDescdata] = useState('');
  const [agedata, setAgedata] = useState('');
  const [dash, setDash] = useState('');

  //fontFamilys
  const [fontsLoaded] = useFonts({
    'Fascinate_Inline': require('./assets/fonts/FascinateInline-Regular.ttf'),
    'Fascinate': require('./assets/fonts/Fascinate-Regular.ttf'),
  });

  //launch functions
  useEffect(() => {
    fetchName();
    fetchDesc();
    fetchImage();
    fetchAge();
  }, []);

  //fetching user's name from firebase
  const fetchName = () => {
    try {
      const { data } = route.params;
      setDash(', ');
      setNamedata(JSON.stringify(data).replace(/\"/g,''));
      console.log('Fetching from settings-page');
    }
    catch (error){
      firebase.database().ref('profiilit').child(useremail).child('nimi').on('value', function(snapshot) {
        const exists = (snapshot.val() !== null);
        if (exists) {
          setNamedata(snapshot.val());
          setDash(', ');
          console.log('Fetching from database');
        } else {
          console.log('No data in database');
        }
      })
    }
  }

  //fetching user's description from firebase
  const fetchDesc = () => {
    try {
      const { moredata } = route.params;
      setDescdata(JSON.stringify(moredata).replace(/\"/g,''));
    }
    catch (error){
      firebase.database().ref('profiilit').child(useremail).child('kuvaus').on('value', function(snapshot) {
        const exists = (snapshot.val() !== null);
        if (exists) {
          setDescdata(snapshot.val());
        }
      })
    }
  }

  //fetching user's image from firebase
  const fetchImage = () => {
    try {
      const { user } = route.params;
      setDescdata(JSON.stringify(user).replace(/\"/g,''));
    }
    catch (error){
      firebase.database().ref('profiilit').child(useremail).child('kuva').on('value', function(snapshot) {
        const exists = (snapshot.val() !== null);
        if (exists) {
          setUser(snapshot.val());
        }
      })
    }
  }

  //fetching user's age from firebase
  const fetchAge = () => {
    firebase.database().ref('profiilit').child(useremail).child('ikä').on('value', function(snapshot) {
      const exists = (snapshot.val() !== null);
      if (exists) {
        setAgedata(snapshot.val());
      }
    })
  }

  if (namedata === "" && descdata === "") {
    setDash('');
    setNamedata('');
    setDescdata(<View><Text style={styles.kuvaus}>Täällä ei ole vielä mitään! {"\n"} Muokkaa profiiliasi asetuksista.</Text></View>);
  }

  if (!fontsLoaded) {
    return <AppLoading />;
  } else {
    return (
      <SafeAreaView style={styles.container}>
        <ImageBackground source={sky} style={styles.background}>
          <Header
            leftComponent={ <Text style={styles.hamppari} onPress={() => navigation.openDrawer()}><Icon type="material" color="#b491b8" name="menu"/></Text> }
            centerComponent={ <Text style={styles.otsikko} onPress={() => navigation.navigate("Etusivu")}>DEITTIAPPI</Text> }
            rightComponent={ <Text style={styles.home} onPress={() => navigation.navigate("Oma Profiili")}><Icon type="font-awesome" color="#b491b8" name="user-circle"/></Text> }
            backgroundColor='#fff'
          />
          <ScrollView style={{width: '100%'}}>
            <Text style={styles.alaotsikko}>OMA PROFIILI</Text>
            <View style={styles.inner}>
              <View style={{width: '100%'}} >
                <Image source={{ uri: user }} style={styles.user} />
              </View>
              <View style={styles.dataa}>
                <Text style={styles.nimi}>{namedata}{dash}{agedata}</Text>
                <Text style={styles.kuvaus}>{descdata}</Text>
              </View>
            </View>
            <View style={{width: '85%', alignSelf: 'center', marginBottom: 20}}>
              <Pressable style={styles.pressable} onPress={() => navigation.navigate('Asetukset')}>
                <Text style={{fontSize:15, color: '#fff', padding: 10, textAlign: 'center'}}>ASETUKSET</Text>
                <Icon type="font-awesome" color="#fff" name="cogs"/>
              </Pressable>
            </View>
          </ScrollView>
        </ImageBackground>
      </SafeAreaView>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
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
  alaotsikko: {
    fontSize: 40,
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'Fascinate',
    marginBottom: 20,
    marginTop: 20
  },
  inner: {
    flex: 1,
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#e3e3e3',
    width: '85%',
    marginBottom: 30,
    paddingBottom: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,

    elevation: 12,
  },
  user: {
    width: '100%',
    height: 280,
    alignSelf: 'center',
  },
  dataa: {
    width: '90%'
  },
  nimi: {
    textAlign: 'center',
    fontSize: 30,
    paddingTop: 10,
    color: '#8d6491',
  },
  kuvaus: {
    color: '#333',
    textAlign: 'center',
    fontSize: 15,
    marginBottom: 10,
  },
  pressable: {
    backgroundColor: '#5b415e',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,

    elevation: 7,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    alignSelf: 'center',
    borderRadius: 2,
  },
});