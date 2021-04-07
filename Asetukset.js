import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, View, Image, Alert, ImageBackground, TouchableOpacity, TextInput, Button, Dimensions, Modal, Pressable, ScrollView, SafeAreaView } from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Icon, Header } from 'react-native-elements';
import { Camera } from 'expo-camera';
import sky from './assets/sky.jpeg';
import * as ImagePicker from 'expo-image-picker';
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

export default function Asetukset({ navigation }) {

  const [user, setUser] = useState('https://www.fluidogroup.com/wp-content/uploads/2018/09/user-icon-silhouette-ae9ddcaf4a156a47931d5719ecee17b9.png');
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const databaseuser = firebase.auth().currentUser;
  const useremail = databaseuser.email.replace(/\./g,'');
  const [data, setData] = useState('');
  const [moredata, setMoredata] = useState('');
  const [newImage, setNewImage] = useState('');
  const camera = useRef(null);
  const [hasCameraPermission, setPermission] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  //fontFamilys
  const [fontsLoaded] = useFonts({
    'Fascinate_Inline': require('./assets/fonts/FascinateInline-Regular.ttf'),
    'Fascinate': require('./assets/fonts/Fascinate-Regular.ttf'),
  });

  //CALLING FUNCTIONS BELOW

  useEffect(() => {
    askGalleryPermission();
    askCameraPermission();
    getDatabaseName();
    getDatabaseDesc();
    getDatabaseImage();
  }, []);

  //UPLOADING NEW IMAGE

  //asking camera permission

  const askCameraPermission=  async() => {
    const { status } = await Camera.requestPermissionsAsync();
    setPermission( status == 'granted');
  }

  //asking gallery permission

  const askGalleryPermission = async() => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Tarvitsemme luvan kamerarullan käyttöön, jotta voit ladata uuden kuvan!');
      }
    }
  }

  //uploading image to firebase database

  const changeImage = () => {
    Alert.alert(
      "Otetaanko kuva",
      "galleriasta vai kameralla?",
      [
        {
          text: "Peruuta",
          onPress: () => console.log('Cancelled.'),
          style: 'cancel'
        },
        {
          text: "Galleria",
          onPress: () => fromGallery()
        },
        {
          text: "Kamera",
          onPress: () => setModalVisible(true)
        }
      ]
    );
  };

  //taking picture with mobilephone camera

  const snap = async() => {
    if (camera) {
      const photo = await camera.current.takePictureAsync();
      setUser(photo.uri);
      setModalVisible(!modalVisible);
      firebase.database().ref('profiilit/'+useremail).update(
          {'kuva': photo.uri}
      );
      getDatabaseImage();
    }
  };

  //choosing picture from phone's gallery

  const fromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      result.uri;
      setUser(result.uri);

      firebase.database().ref('profiilit/'+useremail).update(
        {'kuva': result.uri}
      );
      getDatabaseImage();
    }
  }

  //retrieving image from firebase database

  const getDatabaseImage = () => {
    firebase.database().ref('profiilit').child(useremail).child('kuva').on('value', function(snapshot) {
      const exists = (snapshot.val() !== null);
      if (exists) {
        setUser(snapshot.val());
        setNewImage(snapshot.val());
      } else {
        console.log('No picture yet.');
      }
    })
  };

  //deleting image from firebase database

  const deleteImage = () => {
    const deletedImage = 'https://www.fluidogroup.com/wp-content/uploads/2018/09/user-icon-silhouette-ae9ddcaf4a156a47931d5719ecee17b9.png';
    firebase.database().ref('profiilit/'+useremail).update(
      {'kuva': deletedImage}
    );
    getDatabaseImage();
  }

  //UPDATING INPUT VALUES AND UPLOADING THEM TO FIREBASE DATABASE

  const updateInputs = () => {
    if (data) {
      firebase.database().ref('profiilit/'+useremail).update(
        {'nimi': data, 'kuvaus': moredata}
      );
      Alert.alert(
        "Tietosi on päivitetty",
        "Haluatko siirtyä omaan profiiliisi?",
        [
          {
            text: "Peruuta",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
          },
          { text: "OK", onPress: () => navigation.navigate('Oma Profiili', {data: data, moredata: moredata}) }
        ]
      );
    } else {
      if (data) {
        Alert.alert(
          "Nimesi on päivitetty",
          "Haluatko varmasti jättää kuvauksen tyhjäksi?",
          [
            {
              text: "Peruuta",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel"
            },
            { text: "OK", onPress: () => navigation.navigate('Oma Profiili', {data: data, moredata: moredata}) }
          ]
        );
      }
      if (moredata) {
        Alert.alert('Ole hyvä ja tallenna nimesi profiiliin.');
      }
    }
  }

  //RETRIEVING DATA FROM FIREBASE DATABASE

  //retrieving user's name

  const getDatabaseName = () => {
    firebase.database().ref('profiilit').child(useremail).child('nimi').on('value', function(snapshot) {
      const exists = (snapshot.val() !== null);
      if (exists) {
        setData(snapshot.val());
        if (data !== null) {
          setName(data);
        }
      }
    })
  };

  //retrieving user's description

  const getDatabaseDesc = () => {
    firebase.database().ref('profiilit').child(useremail).child('kuvaus').on('value', function(snapshot) {
      const exists = (snapshot.val() !== null);
      if (exists) {
        setMoredata(snapshot.val());
        if (moredata !== null) {
          setDesc(moredata);
        }
      }
    })
  };

  //verification to delete profile

  const areYouSure = () => {
    Alert.alert(
      "Haluatko varmasti",
      "poistaa profiilisi lopullisesti?",
      [
        {
          text: "Peruuta",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "OK", onPress: () => deleteProfile() }
      ]
    );
  }

  //delete entire profile from firebase database

  const deleteProfile = () => {
    firebase.database().ref('profiilit').child(useremail).remove().then(() => {
      databaseuser.delete();
      navigation.navigate('Kirjaudu ulos');
    })
  }
    
  if (!fontsLoaded) {
    return <AppLoading />;
  } else {
    return (
      <SafeAreaView style={styles.container}>
        <ImageBackground source={sky} style={styles.background}>
          <Header
              leftComponent={ <Text style={styles.hamppari} onPress={() => navigation.openDrawer()}><Icon type="material" color="#b491b8" name="menu"/></Text> }
              centerComponent={ <Text style={styles.otsikko} onPress={() => navigation.navigate("Etusivu", {data: data})}>DEITTIAPPI</Text> }
              rightComponent={ <Text style={styles.home} onPress={() => navigation.navigate("Oma Profiili")}><Icon type="font-awesome" color="#b491b8" name="user-circle"/></Text> }
              backgroundColor='#fff'
          />
          <ScrollView style={{width: '100%'}}>
            <Text style={styles.alaotsikko}>ASETUKSET</Text>
            <KeyboardAwareScrollView contentContainerStyle={styles.keyboard} >
              <View>
                <Text style={{color: '#433045', fontSize: 15}}>Lataa uusi profiilikuva</Text> 
                  <Modal
                    animationType="slide"
                    visible={modalVisible}
                    transparent={true}
                    onRequestClose={() => {
                      setModalVisible(!modalVisible);
                    }}
                  >
                    <View style={{backgroundColor: '#e3e3e3', height: '100%'}}>
                      <Camera ref ={camera} style={{height: '83%', width: '100%'}}/>
                      <Pressable
                        style={styles.pressablecam}
                        onPress={() => snap()}>
                        <Text style={styles.pressabletext}>OTA KUVA</Text>
                      </Pressable>
                      <Pressable
                        style={styles.pressablecam}
                        onPress={() => setModalVisible(!modalVisible)}>
                        <Text style={styles.pressabletext}>TAKAISIN</Text>
                      </Pressable>
                    </View>
                  </Modal>
                <TouchableOpacity onPress={() => changeImage()}>
                {user && <Image source={{ uri: user }} style={styles.user} />}
                </TouchableOpacity>
              </View>
              <View style={{flexDirection: 'row', marginTop: 10, alignItems: 'center'}}>
                <Text style={styles.deletetext}>Poista kuva</Text>
                <Pressable style={styles.deleteimage} onPress={() => deleteImage()}>
                  <Icon type="font-awesome" color="#fff" name="trash"/>
                </Pressable>
              </View>
              <View style={styles.inputs}>
                <TextInput placeholder='Nimesi' style={styles.input} value={data} onChangeText={data => setData(data)}></TextInput>
                <TextInput placeholder='Kerro jotain itsestäsi' style={styles.inputtwo} value={moredata} onChangeText={moredata => setMoredata(moredata)} multiline></TextInput>
                <View style={{width: '100%', alignSelf: 'center', marginBottom: 40}}>
                  <Pressable style={styles.pressable} onPress={() => updateInputs()}>
                    <Text style={{fontSize:15, color: '#fff', padding: 10, textAlign: 'center'}}>TALLENNA</Text>
                    <Icon type="font-awesome" color="#fff" name="save"/>
                  </Pressable>
                </View>
                <View style={{width: '100%', alignSelf: 'center', marginBottom: 20}}>
                  <Pressable style={styles.pressabledelete} onPress={() => areYouSure()}>
                    <Text style={{fontSize:15, color: '#fff', padding: 10, textAlign: 'center'}}>POISTA PROFIILI</Text>
                    <Icon type="font-awesome" color="#fff" name="trash"/>
                  </Pressable>
                </View>
              </View>
            </KeyboardAwareScrollView>
          </ScrollView>
        </ImageBackground>
      </SafeAreaView>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    width: '100%',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    width: '100%'
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
  keyboard: {
    display: "flex",
    flex: 1,
    justifyContent: "space-evenly",
    alignItems: "center",
    marginBottom: 0,
    margin: 20,
    marginTop: 0,
    padding: 25,
    paddingTop: 10,
  },
  pressablecam: {
    backgroundColor: '#5b415e',
    width: '95%',
    alignSelf: 'center',
    marginTop: 10,
    borderRadius: 4
  },
  pressabletext: {
    fontSize: 25,
    color: '#fff',
    textAlign: 'center',
    padding: 3,
  },
  user: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    marginTop: 20,
    borderRadius: 75,
  },
  inputs: {
    marginTop: 20,
    width: '100%',
  },
  input: {
    fontSize: 17,
    backgroundColor: '#fff',
    color: '#000',
    padding: 5,
    marginBottom: 10
  },
  inputtwo: {
    padding: 7,
    marginBottom: 10,
    backgroundColor: '#fff',
    fontSize: 17,
    minHeight: 100,
    textAlignVertical: 'top'
  },
  deleteimage: {
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
    borderRadius: 50,
    width: 45,
    padding: 10,
    alignSelf: 'center',
  },
  deletetext: {
    textAlign: 'center',
    color: '#433045',
    fontSize: 15,
    marginRight: 10
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
  pressabledelete: {
    backgroundColor: '#750000',
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
  }
});