import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Places from "../screens/Places/Places";
import AddPlaces from "../screens/Places/AddPlaces";
import Place from "../screens/Places/Place";
import AddReviewPlace from "../screens/Places/AddReviewPlace";

const Stack = createStackNavigator();

const PlacesStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="places"
        component={Places}
        options={{
          title: "Lugares",
        }}
      />
      <Stack.Screen
        name="addplace"
        component={AddPlaces}
        options={{
          title: "Agregar Lugar",
        }}
      />
      <Stack.Screen name="place" component={Place} />
      <Stack.Screen
        name="addreviewplace"
        component={AddReviewPlace}
        options={{
          title: "Nueva reseña",
        }}
      />
    </Stack.Navigator>
  );
};

export default PlacesStack;
