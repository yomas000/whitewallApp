import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Button, Alert, Image, ImageBackground, Linking, BackHandler, Dimensions, PixelRatio } from 'react-native';
import { Card } from 'react-native-paper';
import React, { useState, useRef, useEffect } from 'react';
import { setWallpaper } from 'react-native-phone-wallpaper';
import styles from './Style';
import Spinner from 'react-native-loading-spinner-overlay';
import ImageZoom from 'react-native-image-pan-zoom';
import header from "./Icons/appHeading.jpeg";

const base_url = "https://my.whitewall.app";
const apiKey = "?apikey=44ac52f9e0ad7e45e632d719b8b0e16cb89caa4e225b9828189c2c4abb297e98";

const options = ["Change: Never", "Change: Every Day", "Change: Every other Day", "Change: Every Week"]
const phonewidth = Dimensions.get('window').width;
const phoneheight = Dimensions.get('window').height;
const framescale = 2/3;

const CategoryScreen = ({ navigation, route }: any) => {
    var collections = route.params.collections.collections;
    var [selectedCollection, setCollection] = useState("collections");
    var [imageScreen, setImageScreen] = useState("None");
    var [spinner, setSpinner] = useState(false);
    var [imageLoading, setImageLoading] = useState(true);
    const [scrollToIndex, setScrollToIndex] = useState(0);
    const [imagesScrollRef, setImageRef] = useState<ScrollView>(); // create ref
    const [imagePosition, setImagePos] = useState<Object>();
    const [imageWidth, setImageWidth] = useState(500);
    const [imageHeight, setImageHeight] = useState(500);

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
                            displayImages(collections, selectedCollection, setImageScreen, setImageWidth, setImageHeight)
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

                    <ImageZoom cropWidth={phonewidth * 2 / 3} cropHeight={phoneheight * 2 / 3} imageHeight={phoneheight * 2 / 3} imageWidth={imageWidth * ((2 / 3 * phoneheight) / imageHeight)} style={{ backgroundColor: "black", alignSelf: "center" }} enableCenterFocus={false} pinchToZoom={false} onMove={(element) => { setImagePos(element) }} centerOn={{ x: 0, y: 0, scale: 1, duration: 10}}>
                        <ImageBackground style={{ width: "auto", height: "100%" }} source={{ uri: base_url + collections[selectedCollection]["images"][imageScreen]["imagePath"] + apiKey }} onLoad={() => { setImageLoading(false) }}>
                            {
                                imageLoading ? (
                                    <View style={{ flex: 1, justifyContent: "center"}}>
                                        <ActivityIndicator size={"large"} />
                                    </View>
                                ) : (
                                    <></>
                                )
                            }
                        </ImageBackground>
                    </ImageZoom>

                    <TouchableOpacity style={{ backgroundColor: "rgba(0, 0, 0, 0.6)", borderRadius: 10, padding: 5, margin: 5, alignSelf: "center", width: "100%" }} onPress={() => { track("link", imageScreen); goToLink(JSON.parse(collections[selectedCollection]["images"][imageScreen]["action"]).link); }}>
                        <Text style={{ fontSize: 15, textAlign: "center" }}>{collections[selectedCollection]["images"][imageScreen]["description"]}</Text>

                        <Text style={styles.action}>{JSON.parse(collections[selectedCollection]["images"][imageScreen]["action"]).name}</Text>
                    </TouchableOpacity>

                            <TouchableOpacity onPress={() => { console.log(collections[selectedCollection]["images"][imageScreen]); changeWallpaper(base_url + collections[selectedCollection]["images"][imageScreen]["imagePath"] + apiKey, setSpinner, imagePosition, collections[selectedCollection]["images"][imageScreen]["width"], collections[selectedCollection]["images"][imageScreen]["height"]); track("wallpaper", imageScreen) }} style={Object.assign({position: "absolute", bottom: 0}, styles.button)}>
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

const displayImages = (collections: any, selectedCollection: any, setImageScreen: Function, setImageWidth: Function, setImageHeight: Function) => {
    const views = [];

    for (let i = 0; i < Object.keys(collections[selectedCollection]["images"]).length; i += 2) {
        const element = Object.keys(collections[selectedCollection]["images"])[i];
        const element2 = Object.keys(collections[selectedCollection]["images"])[i + 1];
        //base_url + collections[selectedCollection]["images"][element2]["imagePath"] + apiKey

        views.push(
            <View key={i} style={{ flex: 1, flexDirection: "row" }}>
                <TouchableOpacity key={element} onPress={() => { setImageScreen(element); setImageDimentions(base_url + collections[selectedCollection]["images"][element]["imagePath"] + apiKey, setImageWidth, setImageHeight)}}>
                    <Card style={styles.card}>
                        <Image source={{ uri: base_url + collections[selectedCollection]["images"][element]["thumbnail"] + apiKey }} style={styles.card_images} />
                        <Text style={styles.card_label}>{element}</Text>
                    </Card>
                </TouchableOpacity>
                {
                    i != Object.keys(collections[selectedCollection]["images"]).length - 1 ? (
                        <TouchableOpacity key={element2} onPress={() => { setImageScreen(element2); setImageDimentions(base_url + collections[selectedCollection]["images"][element2]["imagePath"] + apiKey, setImageWidth, setImageHeight) }}>
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

var setImageDimentions = (url: string, setImageWidth: Function, setImageHeight: Function) => {
    Image.getSize(url, (width, height) => {
        setImageWidth(width);
        setImageHeight(height);
    })
}
/**
 * 
 * @param type link if link | wallpaper if wallpaper was set
 * @param imagename 
 */
const track = (type: string, imagename: string) => {
    console.log(imagename);

    fetch(base_url + "/requests/v1/tracking", 
        {
            method: "POST",
            headers: {
                Accept: 'application/x-www-form-urlencoded',
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "apikey=" + apiKey.slice(8, apiKey.length) +"&type="+type+"&name="+imagename
        }
    ).then(test => {

    }).catch(error => {

    })
}

const goToLink = (link: string) => {
    if (link != "" && link != null) {
        Linking.openURL(link).catch(error => {

        })
    }
}

const changeWallpaper = (url: string, setSpinner: Function, imagePosition: any, imageWidth: number, imageHeight: number) => {

    console.log(imagePosition);
    
        imageWidth = imageWidth;
        imageHeight = imageHeight;

        const left = Math.floor((((((phoneheight * framescale) / imageHeight) * imageWidth) / 2) - Math.floor(imagePosition.positionX) - ((phonewidth * framescale) / 2)) / ((((phoneheight * framescale) / imageHeight) * imageWidth) / imageWidth));
        const top = 0;
        const right = Math.floor((((((phoneheight * framescale) / imageHeight) * imageWidth) / 2) - Math.floor(imagePosition.positionX) + ((phonewidth * framescale) / 2)) / (((phoneheight * framescale / imageHeight) * imageWidth) / imageWidth));
        const bottom = imageHeight;

        console.log("size: " + imageWidth + "x" + imageHeight);
        console.log("Top: " + left + "x" + top);
        console.log("Bottom: " + right + "x" + bottom);

        Alert.alert("Set Wallpaper", "Lock Screen | Home Screen | Both", [
            {
                text: "Both", onPress: () => {
                    setSpinner(true);

                    setWallpaper(url, "3", left.toString(), top.toString(), right.toString(), bottom.toString()).then(result => {
                        setSpinner(false);
                    }).catch(error => {

                    })
                }
            },
            {
                text: "Home", onPress: () => {
                    setSpinner(true);

                    setWallpaper(url, "1", left.toString(), top.toString(), right.toString(), bottom.toString()).then(result => {
                        setSpinner(false);
                    }).catch(error => {

                    })
                }
            },
            {
                text: "Lock", onPress: () => {
                    setSpinner(true);

                    setWallpaper(url, "2", left.toString(), top.toString(), right.toString(), bottom.toString()).then(result => {
                        setSpinner(false);
                    }).catch(error => {

                    })
                }
            }
        ], {cancelable: true}
        )

}

export default CategoryScreen