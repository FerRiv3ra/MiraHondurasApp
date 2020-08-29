import React, { useState, useCallback, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Image, Icon, Button } from "react-native-elements";
import { useFocusEffect } from "@react-navigation/native";
import Toast from "react-native-easy-toast";
import { firebaseApp } from "../utils/firebase";
import firebase from "firebase";
import "firebase/firestore";
import {
  scale,
  verticalScale,
  moderateScale,
} from "../../config/react-native-size";
import Loading from "./components/Loading";

const db = firebase.firestore(firebaseApp);

const Favorites = ({ navigation }) => {
  const [places, setPlaces] = useState(null);
  const [userLogged, setUserLogged] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [reloadData, setReloadData] = useState(false);
  const toastRef = useRef();

  firebase.auth().onAuthStateChanged((user) => {
    user ? setUserLogged(true) : setUserLogged(false);
  });

  useFocusEffect(
    useCallback(() => {
      if (userLogged) {
        const idUser = firebase.auth().currentUser.uid;
        db.collection("favorites")
          .where("idUser", "==", idUser)
          .get()
          .then((response) => {
            const idPlacesArray = [];
            response.forEach((doc) => {
              idPlacesArray.push(doc.data().idPlace);
            });
            getDataPlaces(idPlacesArray).then((response) => {
              const places = [];
              response.forEach((doc) => {
                const place = doc.data();
                place.id = doc.id;
                places.push(place);
              });
              setPlaces(places);
            });
          });
      }
      setReloadData(false);
    }, [userLogged, reloadData])
  );

  const getDataPlaces = (idPlacesArray) => {
    const arrayPlaces = [];
    idPlacesArray.forEach((idPlace) => {
      const result = db.collection("places").doc(idPlace).get();
      arrayPlaces.push(result);
    });

    return Promise.all(arrayPlaces);
  };

  if (!userLogged) {
    return <UserNoLogged navigation={navigation} />;
  }

  if (places?.length === 0) {
    return <NotFoundPlaces />;
  }

  return (
    <View style={styles.viewBody}>
      {places ? (
        <FlatList
          data={places}
          renderItem={(place) => (
            <Place
              place={place}
              setIsLoading={setIsLoading}
              toastRef={toastRef}
              setReloadData={setReloadData}
              navigation={navigation}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      ) : (
        <View style={styles.loaderPlace}>
          <ActivityIndicator size="large" />
          <Text style={{ textAlign: "center", fontSize: verticalScale(13) }}>
            Cargando favoritos
          </Text>
        </View>
      )}
      <Toast ref={toastRef} position="center" opacity={0.9} />
      <Loading text="Eliminando favorito" isVisible={isLoading} />
    </View>
  );
};

function NotFoundPlaces() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Icon type="material-community" name="alert-outline" size={scale(50)} />
      <Text style={{ fontSize: verticalScale(20), fontWeight: "bold" }}>
        No tienes ningún lugar agregado a favoritos
      </Text>
    </View>
  );
}

function UserNoLogged({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Icon type="material-community" name="alert-outline" size={scale(50)} />
      <Text
        style={{
          fontSize: verticalScale(18),
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        Es necesario iniciar sesión para acceder a esta sección
      </Text>
      <Button
        title="Ir a inicio de sesión"
        containerStyle={{ marginTop: verticalScale(20), width: "80%" }}
        buttonStyle={{ backgroundColor: "#00A680" }}
        onPress={() => navigation.navigate("account", { screen: "login" })}
      />
    </View>
  );
}

function Place({ place, toastRef, setIsLoading, setReloadData, navigation }) {
  const { item } = place;
  const { name, images, id } = item;

  const confirmRemover = () => {
    Alert.alert(
      "Eliminar de favoritos",
      `¿Estás seguro de eliminar ${name} de favoritos?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          onPress: removefavorite,
        },
      ],
      { cancelable: false }
    );
  };

  const removefavorite = () => {
    setIsLoading(true);
    db.collection("favorites")
      .where("idPlace", "==", id)
      .where("idUser", "==", firebase.auth().currentUser.uid)
      .get()
      .then((response) => {
        response.forEach((doc) => {
          const idFavorite = doc.id;
          db.collection("favorites")
            .doc(idFavorite)
            .delete()
            .then(() => {
              setIsLoading(false);
              toastRef.current.show(`${name} eliminado de favoritos.`, 2000);
              setReloadData(true);
            })
            .catch(() => {
              setIsLoading(false);
              toastRef.current.show(
                "Error al eliminar favorito, intenta más tarde",
                2000
              );
            });
        });
      });
  };

  return (
    <View style={styles.place}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("places", {
            screen: "place",
            params: { id, name },
          })
        }
      >
        <Image
          resizeMode="cover"
          style={styles.img}
          PlaceholderContent={<ActivityIndicator color="#FFF" />}
          source={
            images[0]
              ? { uri: images[0] }
              : require("../../assets/img/no-image.png")
          }
        />
        <View style={styles.info}>
          <Text style={styles.name}>{name}</Text>
          <Icon
            type="material-community"
            name="heart"
            size={verticalScale(26)}
            color="#F00"
            containerStyle={styles.favorite}
            onPress={confirmRemover}
            underlayColor="transparent"
          />
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  viewBody: {
    flex: 1,
    backgroundColor: "#F2F2F2",
  },
  loaderPlace: {
    marginVertical: verticalScale(10),
  },
  place: {
    margin: scale(10),
  },
  img: {
    width: "100%",
    height: verticalScale(180),
  },
  info: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(10),
    marginTop: verticalScale(-30),
    backgroundColor: "#FFF",
  },
  name: {
    fontWeight: "bold",
    fontSize: verticalScale(20),
  },
  favorite: {
    marginTop: verticalScale(-35),
    backgroundColor: "#FFF",
    padding: moderateScale(15),
    borderRadius: 100,
    borderColor: "#F2F2F2",
    borderWidth: 1,
  },
});

export default Favorites;
