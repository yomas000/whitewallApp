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
  TouchableOpacity
} from 'react-native';

import styles from './Style';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import CategoryScreen from "./Category";

import logo from './Icons/appLoading.gif'; // Tell webpack this JS file uses this image

const Tab = createMaterialBottomTabNavigator();

// import { setWallpaper } from 'react-native-phone-wallpaper';
const base_url = "https://dev.whitewall.app";
const apiKey = "?apikey=2a41067bfde14602117d84995e53a2543ebf24db36d44c103323e2edb4b6fdb1";

const exists = false;


function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [isloading, setLoading] = useState(true);
  const type: any = {};
  const [data, setData] = useState(type);
  const [branding, setBranding] = useState(type);
  const [loadingIcon, setIcon] = useState("app");

  useEffect(() => {
    getStoredData("branding").then(value => {

      setBranding(JSON.parse(JSON.stringify(value)));
      setIcon("branding")

    }).catch(reason => {
      var serverRequest = getBranding()
      serverRequest.then(thing => {
        storeData("branding", JSON.stringify(thing)).then(test => { }).catch(reason => { });

        setBranding(JSON.parse(String(thing)))
        setIcon("branding")
      }).catch(reason2 => {

      })
    })


    var server = getData();
    server.then(thing => {
      setData(JSON.parse(String(thing)));

      storeData("data", JSON.stringify(thing)).then(value => {
        setLoading(false);
      }).catch(reason => {
        console.log("Storing Data failed: " + reason);
      })

    }).catch(reason => {

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
      {isloading ? (
        <View style={{ flex: 1, justifyContent: 'center', backgroundColor: "white" }}>
          {
            <Image source={logo} style={{ width: "100%", height: 200 }} />
          }
        </View>
      ) : (
        <NavigationContainer>
            <Tab.Navigator barStyle={styles.tabStyle} activeColor={styles.tabStyle.activeColor} inactiveColor={styles.tabStyle.inactiveColor}>
              {Object.keys(data).map((category) => (
                <Tab.Screen key={category} name={category} component={CategoryScreen} initialParams={{ collections: data[category] }} />
              ))}
            </Tab.Navigator>
        </NavigationContainer>
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

export default App;
