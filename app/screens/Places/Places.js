import React, { useState, useEffect, useCallback } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Icon } from "react-native-elements";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore";
import ListPlaces from "../components/Places/ListPlaces";

const db = firebase.firestore(firebaseApp);

const Places = ({ navigation }) => {
  const Navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [places, setPlaces] = useState([]);
  const [totalPlaces, setTotalPlaces] = useState(0);
  const [initialPlace, setInitialPlace] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const limite = 8;

  useEffect(() => {
    firebase.auth().onAuthStateChanged((userInfo) => {
      setUser(userInfo);
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      db.collection("places")
        .get()
        .then((snap) => {
          setTotalPlaces(snap.size);
        });

      const resulPlaces = [];

      navigation.dangerouslyGetParent().setOptions({
        tabBarVisible: true,
      });

      db.collection("places")
        .orderBy("create", "desc")
        .limit(limite)
        .get()
        .then((response) => {
          setInitialPlace(response.docs[response.docs.length - 1]);

          response.forEach((doc) => {
            const place = doc.data();
            place.id = doc.id;
            resulPlaces.push(place);
          });
          setPlaces(resulPlaces);
        });
    }, [])
  );

  const handledLoadMore = () => {
    const resulPlaces = [];
    places.length < totalPlaces && setIsLoading(true);

    db.collection("places")
      .orderBy("create", "desc")
      .startAfter(initialPlace.data().create)
      .limit(limite)
      .get()
      .then((response) => {
        if (response.docs.length > 0) {
          setInitialPlace(response.docs[response.docs.length - 1]);
        } else {
          setIsLoading(false);
        }

        response.forEach((doc) => {
          const place = doc.data();
          place.id = doc.id;
          resulPlaces.push(place);
        });

        setPlaces([...places, ...resulPlaces]);
      });
  };

  let mostrar;
  if (user) {
    if (
      user.email === "fer_r25@me.com" ||
      user.email === "franklinescoto07@gmail.com"
    ) {
      mostrar = true;
    } else {
      mostrar = false;
    }
  } else {
    mostrar = false;
  }

  return (
    <View style={styles.viewBody}>
      <ListPlaces
        places={places}
        handledLoadMore={handledLoadMore}
        isLoading={isLoading}
      />
      {mostrar && (
        <Icon
          reverse
          type="material-community"
          name="plus"
          color="#00A680"
          containerStyle={styles.btnContainer}
          onPress={() => Navigation.navigate("addplace")}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  viewBody: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  btnContainer: {
    position: "absolute",
    bottom: 10,
    right: 10,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
  },
});

export default Places;
