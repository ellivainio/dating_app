import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Image, FlatList, Button, Modal, Pressable, TextInput, ImageBackground, Alert, ScrollView } from "react-native";
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

  const databaseuser = firebase.auth().currentUser;
  const useremail = databaseuser.email.replace(/\./g,'');
  const [profiles, setProfiles] = useState([]);
  const [email, setEmail] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [chatmessages, setChatmessages] = useState([]);
  const [namedata, setNamedata] = useState('');
  const [message, setMessage] = useState('');
  const [mailaddresses , setMailaddresses] = useState('');
  const [minAge, setMinAge] = useState('18');
  const [maxAge, setMaxAge] = useState('99');
  const B = (props) => <Text style={{fontWeight: 'bold', color: '#9c72a1'}}>{props.children}</Text>;

  //fontFamilys
  const [fontsLoaded] = useFonts({
    'Fascinate_Inline': require('./assets/fonts/FascinateInline-Regular.ttf'),
    'Fascinate': require('./assets/fonts/Fascinate-Regular.ttf'),
  });

  //launch function
  useEffect(() => {
    getAllProfiles();
  }, []);

  //run filtering by age
  const setAgeFilter = () => {
    if (minAge < maxAge) {
      setFilterModalVisible(!filterModalVisible);
      firebase.database().ref('profiilit/'+useremail).update(
        {'minimi_ikä': minAge, 'maximi_ikä': maxAge}
      );
      getAllProfiles();
    } else {
      Alert.alert('Ensimmäisen luvun on oltava pienempi, kuin toisen.')
    }
  }
  //fetch all (filtered) profiles from database
  const getAllProfiles = () => {
    firebase.database().ref('profiilit').child(useremail).child('minimi_ikä').on('value', function(snapshot) {
      const exists = (snapshot.val() !== null);
      if (exists !== '18' ) {
        setMinAge(snapshot.val());
      }
    });
    firebase.database().ref('profiilit').child(useremail).child('maximi_ikä').on('value', function(snapshot) {
      const exists = (snapshot.val() !== null);
      if (exists !== '99' ) {
        setMaxAge(snapshot.val());
      }
    });
    firebase.database().ref('profiilit').child(useremail).child('email').on('value', function(snapshot) {
      const exists = (snapshot.val() !== null);
      if (exists) {
        setEmail(snapshot.val());
      }
    });
    firebase.database().ref('profiilit/').on('value', snapshot => {
      const data = snapshot.val();
      const profile = Object.values(data);
      const filteredprofiles = profile.filter((item) => {
        return item.email.replace(/\./g,'') !== useremail && item.ikä >= minAge && item.ikä <= maxAge && item.nimi != null /*&& sex.includes(item.sukupuoli)*/;
      })
      setProfiles(filteredprofiles);
    });
  }

  //fetch messages from database
  const getMessages = (item) => {
    try {
      setNamedata(item.nimi);
      const emailaddresses = [ useremail.replace(/\./g,''), item.email.replace(/\./g,'')];
      emailaddresses.sort();
      const addresses = emailaddresses.toString();
      setMailaddresses(emailaddresses);
      try {
        firebase.database().ref('viestit/'+addresses).on('value', snapshot => {
          const exists = (snapshot.val() !== null);
          if (exists) {
            const data = snapshot.val();
            const chatmessage = Object.values(data);
            if (item.nimi === namedata) {
              setChatmessages(chatmessage);
              setModalVisible(true);
            } else {
              setChatmessages(null);
            }
          } else {
            setChatmessages(null);
            setModalVisible(true);
          }
        }) 
      } catch {
        navigation.navigate('Deittaile');
      }
    } catch {
      console.log('No messages to load.')
    }
  }

  //sending message to database and retrieving it
  const sendMessage = () => {
    firebase.database().ref('profiilit').child(useremail).child('nimi').on('value', function(snapshot) {
      const exists = (snapshot.val() !== null);
      if (exists) {
        if (message !== '') {
          mailaddresses.sort();
          const addresses = mailaddresses.toString();
          firebase.database().ref('viestit/'+addresses).push(
            {'nimi': snapshot.val() ,'viesti': message}
          );
          setMessage('');
          firebase.database().ref('viestit/'+addresses).on('value', snapshot => {
            const data = snapshot.val();
            const chatmessage = Object.values(data);
            setChatmessages(chatmessage);
        })
        } else {
          console.log('No messages');
        }
      } else {
        Alert.alert('Voit lähettää viestejä, kun olet päivittänyt tietosi asetuksissa!');
      }
    })
  }

  if (!fontsLoaded) {
    return <AppLoading />;
  } else {
    return (
      <View style={styles.container}>
        <ImageBackground source={sky} style={styles.background}>
          <Header
            leftComponent={ <Text style={styles.hamppari} onPress={() => navigation.openDrawer()}><Icon type="material" color="#b491b8" name="menu"/></Text> }
            centerComponent={ <Text style={styles.otsikko} onPress={() => navigation.navigate("Etusivu")}>DEITTIAPPI</Text> }
            rightComponent={ <Text style={styles.home} onPress={() => navigation.navigate("Oma Profiili")}><Icon type="font-awesome" color="#b491b8" name="user-circle"/></Text> }
            backgroundColor='#fff'
          />
            <ScrollView style={{width: '100%'}}>
              <View style={{alignSelf: 'center'}}>
                <Text style={styles.alaotsikko}>DEITTAILE</Text>
                <Modal
                  animationType="slide"
                  visible={filterModalVisible}
                  transparent={true}
                  onRequestClose={() => {
                    setFilterModalVisible(!filterModalVisible);
                  }}
                >
                  <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                      <Text style={{fontSize: 20, marginTop: 30}}>Määritä ikähaarukka</Text>
                      <View style={styles.filterview}>
                        <TextInput numeric style={styles.ageinput} value={minAge} onChangeText={minAge => setMinAge(minAge)} />
                        <View><Text style={{fontSize: 50}}> - </Text></View>
                        <TextInput numeric style={styles.ageinput} value={maxAge} onChangeText={maxAge => setMaxAge(maxAge)} />
                      </View>
                      <Pressable
                        style={styles.chatbutton}
                        onPress={() => setAgeFilter()}>
                        <Text style={styles.buttontext}>TAKAISIN DEITTAILEMAAN</Text>
                      </Pressable>
                    </View>
                  </View>
                </Modal>
              <View style={styles.inner}>
                <FlatList
                  style={{width: '100%'}}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({item}) =>
                    <View style={styles.profiles}>
                      <Image source={{uri: item.kuva}} style={styles.profilepictures}/>
                      <Text style={styles.name}>{item.nimi}, {item.ikä}</Text>
                      <Text style={styles.desc}>{item.kuvaus}</Text>
                      <Pressable
                        style={styles.chatbutton}
                        onPress={() => getMessages(item)}
                      >
                        <Text style={styles.buttontext}>CHATTAILE {item.nimi.toUpperCase()} KANSSA</Text>
                        <Icon type="font-awesome" color="#fff" name="comments"/>
                      </Pressable>
                    </View>}
                    data={profiles}
                />
                <Modal
                    animationType="slide"
                    visible={modalVisible}
                    transparent={true}
                    onRequestClose={() => {
                      setModalVisible(!modalVisible);
                    }}
                  >
                    <View style={styles.centeredView}>
                      <View style={styles.modalView}>
                        <View style={styles.flatlist}>
                        <FlatList
                          style={{width: '100%'}}
                          keyExtractor={(item, index) => index.toString()}
                          renderItem={({item}) =>
                            <View style={styles.messages}>
                              <Text style={styles.viesti}><B>{item.nimi}</B> {item.viesti}</Text>
                            </View>}
                            data={chatmessages}
                        />
                        </View>
                        <View style={styles.chatmessage}>
                          <TextInput style={styles.input} placeholder='Kirjoita viesti' value={message} onChangeText={message => setMessage(message)} />
                          <Button onPress={() => sendMessage()} title='Lähetä' color="#5b415e" />
                        </View>
                        <Pressable
                          style={styles.chatbutton}
                          onPress={() => setModalVisible(!modalVisible)}
                        >
                          <Text style={styles.buttontext}>TAKAISIN DEITTAILEMAAN</Text>
                        </Pressable>
                      </View>
                    </View>
                  </Modal>
                </View>
              </View>
            </ScrollView>
            <View style={styles.filterbutton}>
              <Pressable
                style={styles.chatbutton}
                onPress={() => setFilterModalVisible(true)}
              >
                <Text style={styles.buttontext}>SUODATA IÄN MUKAAN</Text>
                <Icon type="font-awesome" color="#fff" name="filter"/>
              </Pressable>
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
    backgroundColor: '#b491b8',
    alignContent: 'center',
    justifyContent: 'center'
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
    marginTop: 20,
  },
  filterbutton: {
    width: '85%',
    marginTop: 10,
    marginBottom: 10
  },
  chatbutton: {
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
  buttontext: {
    color: '#fff',
    textAlign: 'center',
    padding: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
    width: 330,
    minHeight: 280
  },
  filterview: {
    flexDirection: 'row',
    padding: 20,
  },
  ageinput: {
    backgroundColor: '#d1d1d1',
    width: 100,
    padding: 10,
    fontSize: 50,
    textAlign: 'center'
  },
  inner: {
    flex: 1,
    alignItems: 'center',
    margin: 10,
    paddingBottom: 0,
    width: '85%'
  },
  profiles: {
    backgroundColor: '#fff',
    marginBottom: 20,
    marginTop: 20,
    padding: 10,
  },
  profilepictures: {
    width: '100%',
    height: 280,
    alignSelf: 'center',
  },
  nimi: {
    color: '#333',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
  },
  kuvaus: {
    color: '#333',
    textAlign: 'center',
    fontSize: 15,
    marginBottom: 10,
  },
  name: {
    textAlign: 'center',
    fontSize: 30,
    paddingTop: 10,
    color: '#8d6491',
  },
  desc: {
    padding: 10,
    textAlign: 'center',
  },
  input: {
    fontSize: 20,
    backgroundColor: '#fff',
    color: '#000',
    paddingLeft: 5,
    width: 222,
    borderWidth: 1,
    borderColor: '#e3e3e3'
  },
  flatlist: {
    backgroundColor: '#e3e3e3',
    width: '100%',
    padding: 10,
    minHeight: 220,
    maxHeight: 260,
  },
  viesti: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 5,
    margin: 5,
  },
  chatmessage: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 10,
  },
});