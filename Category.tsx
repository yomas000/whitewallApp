import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Button, Alert, Image, ImageBackground, Linking, BackHandler } from 'react-native';
import { Card } from 'react-native-paper';
import React, { useState, useRef, useEffect } from 'react';
import { setWallpaper } from 'react-native-phone-wallpaper';
import styles from './Style';
import SelectDropdown from 'react-native-select-dropdown'
import Spinner from 'react-native-loading-spinner-overlay';
import header from "./Icons/appHeading.jpeg";

const base_url = "https://dev.whitewall.app";
const apiKey = "?apikey=2a41067bfde14602117d84995e53a2543ebf24db36d44c103323e2edb4b6fdb1";
const options = ["Change: Never", "Change: Every Day", "Change: Every other Day", "Change: Every Week"]

const CategoryScreen = ({ navigation, route }: any) => {
    var collections = route.params.collections.collections;
    var [selectedCollection, setCollection] = useState("collections");
    var [imageScreen, setImageScreen] = useState("None");
    var [spinner, setSpinner] = useState(false);
    var [imageLoading, setImageLoading] = useState(true);
    const [scrollToIndex, setScrollToIndex] = useState(0);
    const [imagesScrollRef, setImageRef] = useState<ScrollView>(); // create ref

    React.useEffect(() => {
        const unsubscribe = navigation.addListener('tabPress', (e: any) => {
            setCollection("collections");
            setImageScreen("None");
        });

        return unsubscribe;
    }, [navigation]);

    useEffect(() => {
        const backAction = () => {

            if (imageScreen != "None"){
                setImageScreen("None");
                setImageLoading(true);
                imagesScrollRef?.scrollTo({x: 0, y: scrollToIndex, animated: true});

                return true;
            }

            if (selectedCollection != "collections"){
                setCollection("collections");
                return true;
            }
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction,
        );

        return () => backHandler.remove();
    }, [imageScreen, selectedCollection]);



    return (
        selectedCollection == "collections" ? (
            <>
                <View>
                    <Image source={header} style={styles.header} />
                    {/* <View style={styles.dropdown_background}>
                        <SelectDropdown
                            data={options}
                            defaultValueByIndex={0}
                            onSelect={(selectedItem, index) => {
                                console.log(selectedItem, index);
                            }}
                            buttonTextAfterSelection={(selectedItem, index) => {
                                return selectedItem;
                            }}
                            rowTextForSelection={(item, index) => {
                                return item;
                            }}
                            buttonStyle={styles.dropdown1BtnStyle}
                            buttonTextStyle={styles.dropdown1BtnTxtStyle}
                            dropdownStyle={styles.dropdown1DropdownStyle}
                            rowStyle={styles.dropdown1RowStyle}
                            rowTextStyle={styles.dropdown1RowTxtStyle}
                        />
                    </View> */}
                </View>
                <ScrollView style={styles.background}>
                    <View style={{ flex: 1, alignItems: "center", justifyContent: 'center', paddingBottom: 25 }}>
                        {
                            displayCollections(collections, setCollection)
                        }
                    </View>
                </ScrollView>
            </>
        ) : (

            imageScreen == "None" ? (
                    <ScrollView style={styles.background} onScroll={(object) => { setScrollToIndex(object.nativeEvent.contentOffset.y) }} ref={ref => { setImageRef(ref as any); }} onLayout={() => {imagesScrollRef?.scrollTo({x: 0, y: scrollToIndex, animated: true})}}>
                    <View style={{ flex: 1, alignItems: "center", justifyContent: 'center', paddingBottom: 25 }}>
                        <TouchableOpacity onPress={() => setCollection("collections")} style={styles.button}>
                            <Text style={styles.button_text}>Back</Text>
                        </TouchableOpacity>
                        {
                            displayImages(collections, selectedCollection, setImageScreen)
                        }
                    </View>
                </ScrollView>
            ) : (
                <ImageBackground source={{ uri: base_url + collections[selectedCollection]["images"][imageScreen]["imagePath"] + apiKey }} style={styles.wallpaper_image} onLoad={() => { setImageLoading(false) }}>
                    <Spinner
                        visible={spinner}
                        textContent={'Setting Wallpaper...'}
                        overlayColor="rgba(0, 0, 0, 0.75)"
                        animation='slide'
                    />
                    <TouchableOpacity onPress={() => { setImageScreen("None"); setImageLoading(true); }} style={styles.button}>
                        <Text style={styles.button_text}>Back</Text>
                    </TouchableOpacity>

                    <View style={{ height: "80%" }}>
                        {
                            imageLoading ? (
                                <View style={{ flex: 1, justifyContent: 'center' }}>
                                    <ActivityIndicator size={"large"} />
                                </View>
                            ) : (
                                <View></View>
                            )
                        }
                    </View>
                    <TouchableOpacity onPress={() => goToLink(collections[selectedCollection]["images"][imageScreen]["link"])}>
                        <Text style={{ fontSize: 20 }}>{collections[selectedCollection]["images"][imageScreen]["description"]}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => changeWallpaper(base_url + collections[selectedCollection]["images"][imageScreen]["imagePath"] + apiKey, setSpinner)} style={styles.button}>
                        <Text style={styles.button_text}>Set Wallpaper</Text>
                    </TouchableOpacity>
                </ImageBackground>
            )
        )
    );
};

const goToLink = (link: string) => {
    if (link != "" && link != null) {
        Linking.openURL(link).catch(error => {

        })
    }
}

const displayCollections = (collections: any, setCollection: any) => {
    const returnCollections = [];

    for (let i = 0; i < Object.keys(collections).length; i += 2) {
        const element = Object.keys(collections)[i];
        const element2 = Object.keys(collections)[i + 1];

        returnCollections.push(
            <View key={i} style={{ flex: 1, flexDirection: "row" }}>
                <TouchableOpacity key={element} onPress={() => setCollection(element)}>
                    <Card style={styles.card}>
                        <Image source={{ uri: base_url + collections[element]["image"] + apiKey }} style={styles.card_images} />
                        <Text style={styles.card_label}>{element}</Text>
                    </Card>
                </TouchableOpacity>
                {
                    i != Object.keys(collections).length - 1 ? (
                        <TouchableOpacity key={element2} onPress={() => setCollection(element2)}>
                            <Card style={styles.card}>
                                <Image source={{ uri: base_url + collections[element2]["image"] + apiKey }} style={styles.card_images} />
                                <Text style={styles.card_label}>{element2}</Text>
                            </Card>
                        </TouchableOpacity>
                    ) : (
                        <Card>

                        </Card>
                    )
                }
            </View>
        )
    }
    return (
        returnCollections
    )
}

const displayImages = (collections: any, selectedCollection: any, setImageScreen: Function) => {
    const views = [];

    for (let i = 0; i < Object.keys(collections[selectedCollection]["images"]).length; i += 2) {
        const element = Object.keys(collections[selectedCollection]["images"])[i];
        const element2 = Object.keys(collections[selectedCollection]["images"])[i + 1];
        //base_url + collections[selectedCollection]["images"][element2]["imagePath"] + apiKey

        views.push(
            <View key={i} style={{ flex: 1, flexDirection: "row" }}>
                <TouchableOpacity key={element} onPress={() => setImageScreen(element)}>
                    <Card style={styles.card}>
                        <Image source={{ uri: base_url + collections[selectedCollection]["images"][element]["thumbnail"] + apiKey }} style={styles.card_images} />
                        <Text style={styles.card_label}>{element}</Text>
                    </Card>
                </TouchableOpacity>
                {
                    i != Object.keys(collections[selectedCollection]["images"]).length - 1 ? (
                        <TouchableOpacity key={element2} onPress={() => setImageScreen(element2)}>
                            <Card style={styles.card}>
                                <Image source={{ uri: base_url + collections[selectedCollection]["images"][element2]["thumbnail"] + apiKey }} style={styles.card_images} />
                                <Text style={styles.card_label}>{element2}</Text>
                            </Card>
                        </TouchableOpacity>
                    ) : (
                        <Card>

                        </Card>
                    )
                }
            </View>
        )
    }

    return (
        views
    )
}

const changeWallpaper = (url: string, setSpinner: Function) => {
    Alert.alert("Set Wallpaper", "Lock Screen | Home Screen | Both", [
        {
            text: "Both", onPress: () => {
                setSpinner(true);

                setWallpaper(url, "3").then(result => {
                    setSpinner(false);
                }).catch(error => {

                })
            }
        },
        {
            text: "Home", onPress: () => {
                setSpinner(true);

                setWallpaper(url, "1").then(result => {
                    setSpinner(false);
                }).catch(error => {

                })
            }
        },
        {
            text: "Lock", onPress: () => {
                setSpinner(true);

                setWallpaper(url, "2").then(result => {
                    setSpinner(false);
                }).catch(error => {

                })
            }
        }
    ]
    )

}

export default CategoryScreen