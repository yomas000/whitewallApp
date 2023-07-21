import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Button, Alert, Image, ImageBackground, Linking, BackHandler, Dimensions, PixelRatio } from 'react-native';
import { Card } from 'react-native-paper';
import React, { useState, useRef, useEffect } from 'react';
import { setWallpaper } from 'react-native-phone-wallpaper';
import styles from './Style';
import Spinner from 'react-native-loading-spinner-overlay';
import ImageZoom from 'react-native-image-pan-zoom';
import header from "./Icons/appHeading.jpeg";

const base_url = "https://dev.whitewall.app";
const apiKey = "?apikey=2a41067bfde14602117d84995e53a2543ebf24db36d44c103323e2edb4b6fdb1";

const options = ["Change: Never", "Change: Every Day", "Change: Every other Day", "Change: Every Week"]
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const CategoryScreen = ({ navigation, route }: any) => {
    var collections = route.params.collections.collections;
    var [selectedCollection, setCollection] = useState("collections");
    var [imageScreen, setImageScreen] = useState("None");
    var [spinner, setSpinner] = useState(false);
    var [imageLoading, setImageLoading] = useState(true);
    const [scrollToIndex, setScrollToIndex] = useState(0);
    const [imagesScrollRef, setImageRef] = useState<ScrollView>(); // create ref
    const [imagePosition, setImagePos] = useState<Object>();

    React.useEffect(() => {
        const unsubscribe = navigation.addListener('tabPress', (e: any) => {
            setCollection("collections");
            setImageScreen("None");
        });

        return unsubscribe;
    }, [navigation]);

    useEffect(() => {
        const backAction = () => {

            if (imageScreen != "None") {
                setImageScreen("None");
                setImageLoading(true);
                imagesScrollRef?.scrollTo({ x: 0, y: scrollToIndex, animated: true });

                return true;
            }

            if (selectedCollection != "collections") {
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
                <View style={styles.header_container}>
                    <Image source={header} style={styles.header} resizeMode='contain' />
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
                <ScrollView style={styles.background} onScroll={(object) => { setScrollToIndex(object.nativeEvent.contentOffset.y) }} ref={ref => { setImageRef(ref as any); }} onLayout={() => { imagesScrollRef?.scrollTo({ x: 0, y: scrollToIndex, animated: true }) }}>
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
                <View style={styles.background}>
                    <Spinner
                        visible={spinner}
                        textContent={'Setting Wallpaper...'}
                        overlayColor="rgba(0, 0, 0, 0.75)"
                        animation='slide'
                    />
                    <TouchableOpacity onPress={() => { setImageScreen("None"); setImageLoading(true); }} style={styles.button}>
                        <Text style={styles.button_text}>Back</Text>
                    </TouchableOpacity>

                    <ImageZoom cropWidth={width/2} cropHeight={height/2} imageHeight={getImageHeight(base_url + collections[selectedCollection]["images"][imageScreen]["imagePath"] + apiKey)} imageWidth={getImageWidth(base_url + collections[selectedCollection]["images"][imageScreen]["imagePath"] + apiKey)} style={{ backgroundColor: "black", aspectRatio: 9/16, alignSelf: "center" }} pinchToZoom={true} onMove={(element) => { setImagePos(element) }}>
                        <ImageBackground style={{ width: "auto", height: "100%" }} source={{ uri: base_url + collections[selectedCollection]["images"][imageScreen]["imagePath"] + apiKey }} onLoad={() => { setImageLoading(false) }}>
                            {
                                imageLoading ? (
                                    <View style={{ flex: 1, justifyContent: 'center' }}>
                                        <ActivityIndicator size={"large"} />
                                    </View>
                                ) : (
                                    <></>
                                )
                            }
                        </ImageBackground>
                    </ImageZoom>

                    <TouchableOpacity style={{ backgroundColor: "rgba(0, 0, 0, 0.6)", borderRadius: 10, padding: 5, margin: 5, alignSelf: "center", width: "100%" }} onPress={() => { track("link", imageScreen); goToLink(JSON.parse(collections[selectedCollection]["images"][imageScreen]["action"]).link); }}>
                        <Text style={{ fontSize: 20, textAlign: "center" }}>{collections[selectedCollection]["images"][imageScreen]["description"]}</Text>

                        <Text style={styles.action}>{JSON.parse(collections[selectedCollection]["images"][imageScreen]["action"]).name}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => { changeWallpaper(base_url + collections[selectedCollection]["images"][imageScreen]["imagePath"] + apiKey, setSpinner); track("wallpaper", imageScreen) }} style={styles.button}>
                        <Text style={styles.button_text}>Set Wallpaper</Text>
                    </TouchableOpacity>
                </View>
            )
        )
    );
};

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

var getImageWidth = (url: string) => {
    var val = 500;
    Image.getSize(url, (width, height) => {
        val = width;
    })

    return val * (PixelRatio.get() / 2);
}

var getImageHeight = (url: string) => {
    var val = 500;
    Image.getSize(url, (width, height) => {
        val = height;
    })

    return val * (PixelRatio.get() / 2);
}
/**
 * 
 * @param type link if link | wallpaper if wallpaper was set
 * @param imagename 
 */
const track = (type: string, imagename: string) => {
    console.log(imagename);

    fetch(base_url + "/requests/v1/tracking", {
        method: "POST",
        headers: {
            Accept: 'application/x-www-form-urlencoded',
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: "apikey="+apiKey.replace("?apikey=", "")+"&type="+type+"&name="+imagename
    }).then(test => {

    }).catch(error => {

    })
}

const goToLink = (link: string) => {
    if (link != "" && link != null) {
        Linking.openURL(link).catch(error => {

        })
    }
}

const changeWallpaper = (url: string, setSpinner: Function) => {
    Image.getSize(url, (width, height) => { console.log("Image: " + width + "x" + height); });
    console.log(width + "x" + height);

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