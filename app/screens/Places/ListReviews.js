import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button, Avatar, Rating } from "react-native-elements";

import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore";
import {
  moderateScale,
  verticalScale,
} from "../../../config/react-native-size";

const db = firebase.firestore(firebaseApp);

const ListReviews = ({ navigation, idPlace }) => {
  const [userLogged, setUserLogged] = useState(false);
  const [reviews, setReviews] = useState([]);

  firebase.auth().onAuthStateChanged((user) => {
    user ? setUserLogged(true) : setUserLogged(false);
  });

  useEffect(() => {
    db.collection("reviews")
      .where("idPlace", "==", idPlace)
      .get()
      .then((response) => {
        const resultReviews = [];
        response.forEach((doc) => {
          const data = doc.data();
          data.id = doc.id;
          resultReviews.push(data);
        });
        setReviews(resultReviews);
      });
  }, []);

  return (
    <View>
      {userLogged ? (
        <Button
          title="Escribe una opinión"
          buttonStyle={styles.btnAddReview}
          titleStyle={styles.titleStyle}
          icon={{
            type: "material-community",
            name: "square-edit-outline",
            color: "#00A680",
          }}
          onPress={() =>
            navigation.navigate("addreviewplace", { idPlace: idPlace })
          }
        />
      ) : (
        <View>
          <Text
            style={{
              textAlign: "center",
              color: "#00A680",
              padding: moderateScale(20),
            }}
            onPress={() => navigation.navigate("account", { screen: "login" })}
          >
            Es necesario estar registrado para escribir un comentario,
            <Text style={{ fontWeight: "bold" }}>
              {" "}
              pulsa AQUÍ para inciar sesión
            </Text>
          </Text>
        </View>
      )}
      {reviews.map((review, index) => (
        <Review key={index} review={review} />
      ))}
    </View>
  );
};

function Review(props) {
  const { title, review, rating, avatarUser, created } = props.review;
  const createdReview = new Date(created.seconds * 1000);

  return (
    <View style={styles.viewReview}>
      <View style={styles.viewAvatar}>
        <Avatar
          size="large"
          rounded
          containerStyle={styles.imgAvatar}
          source={
            avatarUser
              ? { uri: avatarUser }
              : require("../../../assets/img/avatar-default.jpg")
          }
        />
      </View>
      <View style={styles.viewInfo}>
        <Text style={styles.reviewTitle}>{title}</Text>
        <Text style={styles.reviewText}>{review}</Text>
        <Rating imageSize={15} startingValue={rating} readonly />
        <Text style={styles.reviewData}>
          {createdReview.getDate()}/{createdReview.getMonth() + 1}/
          {createdReview.getFullYear()}{" "}
        </Text>
      </View>
    </View>
  );
}

export default ListReviews;

const styles = StyleSheet.create({
  btnAddReview: {
    backgroundColor: "transparent",
  },
  titleStyle: {
    color: "#00A680",
  },
  viewReview: {
    flexDirection: "row",
    padding: moderateScale(10),
    paddingBottom: moderateScale(20),
    borderBottomColor: "#E3E3E3",
    borderBottomWidth: 1,
  },
  viewAvatar: {
    marginRight: verticalScale(15),
  },
  imgAvatar: {
    width: 50,
    height: 50,
  },
  viewInfo: {
    flex: 1,
    alignItems: "flex-start",
  },
  reviewTitle: {
    fontWeight: "bold",
  },
  reviewText: {
    paddingTop: 2,
    color: "grey",
    marginBottom: 5,
  },
  reviewData: {
    marginTop: 5,
    color: "grey",
    fontSize: 12,
    position: "absolute",
    right: 0,
    bottom: 0,
  },
});
