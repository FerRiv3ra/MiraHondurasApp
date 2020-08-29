import React, { useState, useCallback, useRef, useEffect } from "react";
import { StyleSheet, Dimensions, View, Text } from "react-native";
import { Rating, ListItem, Icon } from "react-native-elements";
import Loading from "../components/Loading";
import Map from "../components/Map";
import { useFocusEffect } from "@react-navigation/native";
import Toast from "react-native-easy-toast";
import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore";
import CarouselImage from "../components/Carousel";
import { ScrollView } from "react-native-gesture-handler";
import {
  verticalScale,
  moderateScale,
  scale,
} from "../../../config/react-native-size";
import ListReviews from "./ListReviews";

const db = firebase.firestore(firebaseApp);
const screenWidth = Dimensions.get("window").width;

const Place = ({ navigation, route }) => {
  const { id, name } = route.params;

  const [place, setPlace] = useState(null);
  const [rating, setRating] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [userLogged, setUserLogged] = useState(false);

  const toastRef = useRef();

  firebase.auth().onAuthStateChanged((user) => {
    user ? setUserLogged(true) : setUserLogged(false);
  });

  navigation.setOptions({ title: name });
  navigation.dangerouslyGetParent().setOptions({
    tabBarVisible: false,
  });

  useFocusEffect(
    useCallback(() => {
      db.collection("places")
        .doc(id)
        .get()
        .then((response) => {
          const data = response.data();
          data.id = response.id;
          setPlace(data);
          setRating(data.rating);
        });
    }, [])
  );

  useEffect(() => {
    if (userLogged && place) {
      db.collection("favorites")
        .where("idPlace", "==", place.id)
        .where("idUser", "==", firebase.auth().currentUser.uid)
        .get()
        .then((response) => {
          if (response.docs.length === 1) {
            setIsFavorite(true);
          }
        });
    }
  }, [userLogged, place]);

  const addFavorite = () => {
    if (!userLogged) {
      toastRef.current.show(
        "Tienes que iniciar sesión para poder agregar un lugar a favoritos",
        2000
      );
      return;
    }

    const payload = {
      idUser: firebase.auth().currentUser.uid,
      idPlace: place.id,
    };

    db.collection("favorites")
      .add(payload)
      .then(() => {
        setIsFavorite(true);
        toastRef.current.show(`${name} agregado a favoritos`, 2000);
      })
      .catch(() => {
        toastRef.current.show(
          "Error al agregar a favoritos, intenta más tarde",
          2000
        );
      });
  };

  const removeFavorite = () => {
    db.collection("favorites")
      .where("idPlace", "==", place.id)
      .where("idUser", "==", firebase.auth().currentUser.uid)
      .get()
      .then((response) => {
        response.forEach((doc) => {
          const idFavorite = doc.id;
          db.collection("favorites")
            .doc(idFavorite)
            .delete()
            .then(() => {
              setIsFavorite(false);
              toastRef.current.show(`${name} eliminado de favoritos`, 2000);
            })
            .catch(() => {
              toastRef.current.show(
                "Error al eliminar de favoritos, intenta más tarde",
                2000
              );
            });
        });
      });
  };

  if (!place) return <Loading isVisible={true} text="Cargando..." />;

  return (
    <ScrollView vertical style={styles.viewBody}>
      <View style={styles.viewFavorite}>
        <Icon
          type="material-community"
          name={isFavorite ? "heart" : "heart-outline"}
          onPress={isFavorite ? removeFavorite : addFavorite}
          color={isFavorite ? "#F00" : "#000"}
          size={scale(35)}
          underlayColor="transparent"
        />
      </View>
      <CarouselImage
        arrayImages={place.images}
        height={verticalScale(250)}
        width={screenWidth}
      />
      <TitlePlace
        name={place.name}
        description={place.description}
        rating={rating}
      />
      <PlaceInfo
        location={place.location}
        name={place.name}
        direccion={place.direccion}
        categoria={place.categoria}
      />
      <ListReviews
        navigation={navigation}
        idPlace={place.id}
        setRating={setRating}
      />
      <Toast ref={toastRef} position="center" opacity={0.9} />
    </ScrollView>
  );
};

function TitlePlace({ name, description, rating }) {
  return (
    <View style={styles.viewPlaceTitle}>
      <View style={{ flexDirection: "row" }}>
        <Text style={styles.namePlace}>{name}</Text>
        <Rating
          style={styles.rating}
          imageSize={scale(20)}
          readonly
          startingValue={parseFloat(rating)}
        />
      </View>
      <Text style={styles.descriptionPlace}>{description}</Text>
    </View>
  );
}

function PlaceInfo({ location, name, direccion, categoria }) {
  const obtenerCategoria = (categoria) => {
    let cat;
    if (categoria === "turist") {
      cat = "Lugar turístico";
    } else if (categoria === "rest") {
      cat = "Restaurante";
    } else {
      cat = "Hotel";
    }
    return cat;
  };

  const obtenerIcon = (categoria) => {
    let icon;
    if (categoria === "turist") {
      icon = "camera";
    } else if (categoria === "rest") {
      icon = "silverware-fork-knife";
    } else {
      icon = "bed";
    }
    return icon;
  };

  const listInfo = [
    {
      text: direccion,
      iconName: "map-marker",
      iconType: "material-community",
      action: null,
    },
    {
      text: obtenerCategoria(categoria),
      iconName: obtenerIcon(categoria),
      iconType: "material-community",
      action: null,
    },
  ];

  return (
    <View style={styles.viewPlaceInfo}>
      <Text style={styles.placeTitleInfo}>Información sobre el lugar</Text>
      <Map location={location} name={name} height={verticalScale(100)} />
      {listInfo.map((item, index) => (
        <ListItem
          key={index}
          title={item.text}
          leftIcon={{
            name: item.iconName,
            type: item.iconType,
            color: "#00A680",
          }}
          containerStyle={styles.containerListItem}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  viewBody: {
    flex: 1,
    backgroundColor: "white",
  },
  viewPlaceTitle: {
    padding: moderateScale(15),
  },
  namePlace: {
    fontSize: verticalScale(20),
    fontWeight: "bold",
  },
  descriptionPlace: {
    marginTop: verticalScale(5),
    color: "grey",
    fontSize: verticalScale(13),
  },
  rating: {
    position: "absolute",
    right: 0,
  },
  viewPlaceInfo: {
    margin: scale(15),
  },
  placeTitleInfo: {
    fontSize: verticalScale(20),
    fontWeight: "bold",
    marginBottom: verticalScale(10),
  },
  containerListItem: {
    borderBottomColor: "#D8D8D8",
    borderBottomWidth: 1,
  },
  viewFavorite: {
    position: "absolute",
    top: 0,
    right: 0,
    zIndex: 2,
    backgroundColor: "#FFF",
    borderBottomLeftRadius: 100,
    padding: moderateScale(5),
    paddingLeft: moderateScale(15),
  },
});

export default Place;
