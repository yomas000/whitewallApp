/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  Image,
  Text,
  useColorScheme,
  View,
  ScrollView,
  Button,
  TouchableOpacity,
  StatusBar,
  Linking
} from 'react-native';

import styles from './Style';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CategoryScreen from "./Category";

import logo from './Icons/appLoading.gif'; // Tell webpack this JS file uses this image

const Tab = createBottomTabNavigator();

// import { setWallpaper } from 'react-native-phone-wallpaper';
const base_url = "https://my.whitewall.app";
const apiKey = "?apikey=44ac52f9e0ad7e45e632d719b8b0e16cb89caa4e225b9828189c2c4abb297e98";

const exists = false;


function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [isloading, setLoading] = useState(true);
  const type: any = {};
  const [data, setData] = useState(type);
  const [branding, setBranding] = useState(type);
  const [loadingIcon, setIcon] = useState("app");
  const [appBanner, setBanner] = useState("");
  const [status, setStatus] = useState("active");
  const [bannerLink, setBannerLink] = useState("");
  const [headerLink, setHeaderLink] = useState("");

  useEffect(() => {

    var server = getData();
    server.then(thing => {
      
      setData(JSON.parse(String(thing)));

      getBranding().then(value => {
        setBanner(JSON.parse(value).appBanner);
        setStatus(JSON.parse(value).status);
        setBannerLink(JSON.parse(JSON.parse(value).branding).bannerLink);
        setHeaderLink(JSON.parse(JSON.parse(value).branding).headerLink);

        if (JSON.parse(value).status != "active") {
          setLoading(true);
        }else{
          storeData("data", JSON.stringify(thing)).then(value => {
            setLoading(false);
          }).catch(reason => {
            console.log("Storing Data failed: " + reason);
          })
        }
      }).catch(error => {

      })

    }).catch(reason => {
      console.log(reason);
      
      getStoredData("data").then(value => {
        setData(JSON.parse(String(value)));
        setLoading(false);
      }).catch(reason => {
        console.log("getting Data failed: " + reason);
      })
    })

  }, [])

  return (
    <View style={{ flex: 1 }}>
      <StatusBar backgroundColor={styles.background.backgroundColor}/>
      {isloading ? (
        <View style={{ flex: 1, justifyContent: 'center', backgroundColor: styles.background.backgroundColor }}>
          {
            <Image source={logo} style={styles.loading} resizeMode='contain'/>
          }
          {
            status == "active" ? (
              <></>
            ) : (
              <Text style={{color: "black", alignSelf: "center", fontSize: 15, paddingBottom: 50}}>We're sorry this service is not avalible right now</Text>
            )
          }
        </View>
      ) : (
        <>
          <NavigationContainer>
              <Tab.Navigator screenOptions={{ tabBarStyle: styles.tabStyle, tabBarLabelStyle: { fontSize: styles.tabStyle.fontSize, padding: 6 }, headerStyle: {height: 0}}}>
                {Object.keys(data).map((category) => (
                  <Tab.Screen key={category} name={category} component={CategoryScreen} initialParams={{ collections: data[category], headerLink: headerLink }} options={{tabBarIcon: () => {return (<Image source={{ uri: base_url + data[category]["image"] + apiKey }} style={{width: 50, height: 35}}/>)}}}/>))}
              </Tab.Navigator>
              <View>
                {appBanner == "" ? (
                  <></>
                ) : (
                  <TouchableOpacity onPress={() => {goToLink(bannerLink)}}>
                    <Image source={{ uri: base_url + appBanner + apiKey }}  style={{width: "100%", height: 70, resizeMode: "cover"}} onError={() => {setBanner("")}}/>
                  </TouchableOpacity>
                )
                }
              </View>
          </NavigationContainer>
        </>
      )}
    </View>
  );
}

const getData = () => {
  return fetch(base_url + '/requests/v1/data' + apiKey)
    .then(response => {
      return response.text()
    })
    .catch(error => {
      console.error("Fetch Data Error: " + error);
    });
};

const getBranding = () => {
  return fetch(base_url + '/requests/v1/branding' + apiKey)
    .then(response => {
      return response.text()
    })
    .catch(error => {
      console.error("Fetch Data Error: " + error);
    });
};

const storeData = async (index: string, value: string) => {
  try {
    await AsyncStorage.setItem(index, value);
  } catch (e) {
    // saving error
  }
};

const getStoredData = async (key: string) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.log("reading error: " + e);
  }
};

const goToLink = (link: string) => {
  if (link != "" && link != null) {
    Linking.openURL(link).catch(error => {

    })
  }
}

export default App;
