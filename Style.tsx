import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    //background
    background: {
        padding: 24,
        backgroundColor: "white",
    },
    dropdown_background: {
        padding: 5,
        backgroundColor: "white"
    },

    //categories
    tabStyle: {
        backgroundColor: "gray",
        activeColor: "white",
        inactiveColor: "lightgray",
    },

    //loading Image
    loading: {
        width: "100%",
        height: "auto"
    },

    //header
    header: {
        width: "100%",
        height: "auto"
    },
    
    //
    card: {
        margin: 10,
        padding: 10,
        flex: 1,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",

        //branding border
        borderWidth: 0,
        borderColor: "white",
        borderRadius: 10,
        backgroundColor: "white"
    },

    card_label: {
        width: 150,
        flex: 1,
        flexWrap: "wrap",
        textAlign: "center",

        //branding
        fontSize: 15,
        fontFamily: "normal",
        fontWeight: "normal",
        fontStyle: "normal",
        color: "black"
    },

    card_images: {
        width: 150,
        height: 190,

        //branding
        borderWidth: 0,
        borderColor: "black",
        borderRadius: 10,
    },

    button: {
        width: "95%",
        height: 40,
        flex: 1,
        margin: 5,
        alignItems: "center", 
        justifyContent: 'center',

        //branding
        backgroundColor: "#03a5fc",
        borderRadius: 10,
    },

    button_text: {
        //branding
        color: "white",
        fontSize: 30,
        fontFamily: "normal",
        fontStyle: "normal",
        fontWeight: "normal"
    },

    wallpaper_image: {
        width: "100%",
        height: "100%",
        flex: 1,
        alignItems: "center",
        justifyContent: 'center',
    },

    dropdown1BtnStyle: {
        width: '80%',
        height: 50,
        backgroundColor: '#FFF',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#444',
    },
    dropdown1BtnTxtStyle: { color: '#444', textAlign: 'left' },
    dropdown1DropdownStyle: { backgroundColor: '#EFEFEF', borderRadius: 8 },
    dropdown1RowStyle: { backgroundColor: '#EFEFEF', borderBottomColor: '#C5C5C5' },
    dropdown1RowTxtStyle: { color: '#444', textAlign: 'left' },
});

export default styles;