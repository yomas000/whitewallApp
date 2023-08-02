import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    //background
    background: {
        flex: 1,
        padding: 24,
        backgroundColor: "white",
    },
    dropdown_background: {
        padding: 5,
        backgroundColor: "white"
    },

    //categories
    tabStyle: {
        backgroundColor: "white",
        activeColor: "black",
        inactiveColor: "black",
        paddingTop: 10,
        height: 70,
        fontSize: 15
    },

    //call to action
    action: {
        fontSize: 10, 
        textAlign: 'center',
        color: "white"
    },

    //loading Image
    loading: {
        flex: 1,
        width: "100%",
        alignSelf: "center"
    },

    //header
    header: {
       flex: 1,
       //branding
       width: "100%",
       alignSelf: "center"
    },

    header_container: { 
        width: "100%", 
        height: "auto", 
        flex: 0.25,
        
        //branding
        backgroundColor: "white"
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
        backgroundColor: "white",
        shadowColor: "black"
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
        width: "100%",
        height: 50,
        margin: 5,
        alignItems: "center", 
        justifyContent: 'center',
        alignSelf: "center",

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
        width: 300,
        height: 700,
        flex: 1,
        alignSelf: "center",
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
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