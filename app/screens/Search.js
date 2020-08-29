import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Picker,
  Platform,
} from "react-native";
import { SearchBar, ListItem, Icon, Button } from "react-native-elements";
import { FireSQL } from "firesql";
import firebase from "firebase/app";
import { scale, verticalScale } from "../../config/react-native-size";
import Toast from "react-native-easy-toast";
import { selectedDep, selectedCat } from "../utils/obtenerDatos";

const fireSql = new FireSQL(firebase.firestore(), { includeId: "id" });

const Search = ({ navigation }) => {
  const [search, setSearch] = useState("");
  const [departamento, setDepartamento] = useState("");
  const [categoria, setCategoria] = useState("rest");
  const [buscando, setBuscando] = useState("");
  const [places, setPlaces] = useState([]);
  const [selected, setSelected] = useState(false);
  const [allData, setAllData] = useState([]);
  const toastRef = useRef();

  useEffect(() => {
    fireSql
      .query("SELECT * FROM places")
      .then((response) => {
        console.log(response);
        setPlaces(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    const filter = places
      .filter((place) => place.departamento === departamento)
      .filter((place) => place.categoria === categoria)
      .filter((text) => text.name.includes(search));
    setAllData(filter);
  }, [search]);

  const reset = () => {
    setSelected(!selected);
    setAllData([]);
    setBuscando("");
  };

  const validarFiltros = () => {
    if (departamento !== "") {
      reset();
      setBuscando(
        `Buscando ${selectedCat(categoria)} en ${selectedDep(departamento)}`
      );
      setSearch("");
    } else {
      toastRef.current.show("Debes seleccionar un departamento", 2000);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {!selected ? (
        <>
          <Picker
            onValueChange={(departamento) => setDepartamento(departamento)}
            selectedValue={departamento}
            itemStyle={{ height: 120 }}
          >
            <Picker.Item label="-Selecciona departamento-" value="" />
            <Picker.Item label="Atlántida" value="atl" />
            <Picker.Item label="Choluteca" value="cho" />
            <Picker.Item label="Colón" value="col" />
            <Picker.Item label="Comayagua" value="com" />
            <Picker.Item label="Copán" value="cop" />
            <Picker.Item label="Cortés" value="cor" />
            <Picker.Item label="El Paraíso" value="epa" />
            <Picker.Item label="Francisco Morazán" value="fco" />
            <Picker.Item label="Gracias a Dios" value="gdi" />
            <Picker.Item label="Intibucá" value="int" />
            <Picker.Item label="Islas de la Bahía" value="iba" />
            <Picker.Item label="La Paz" value="lpa" />
            <Picker.Item label="Lempira" value="lem" />
            <Picker.Item label="Ocotepeque" value="oco" />
            <Picker.Item label="Olancho" value="ola" />
            <Picker.Item label="Santa Bárbara" value="sba" />
            <Picker.Item label="Valle" value="val" />
            <Picker.Item label="Yoro" value="yor" />
          </Picker>
          <Picker
            onValueChange={(categoria) => setCategoria(categoria)}
            selectedValue={categoria}
            itemStyle={{ height: 110 }}
          >
            <Picker.Item label="Restaurante" value="rest" />
            <Picker.Item label="Turístico" value="turist" />
            <Picker.Item label="Hotel" value="hotel" />
          </Picker>
        </>
      ) : (
        <SearchBar
          placeholder={buscando}
          onChangeText={(e) => setSearch(e)}
          value={search}
          containerStyle={StyleSheet.searchBar}
        />
      )}
      {allData.length === 0 ? (
        <NoFoundPlace />
      ) : (
        <FlatList
          data={allData}
          renderItem={(place) => (
            <Place place={place} navigation={navigation} />
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
      <View style={[styles.viewBtn, !selected && { position: "absolute" }]}>
        <Button
          title={selected ? "Realizar otra búsqueda" : "Validar filtros"}
          type="clear"
          containerStyle={[
            { backgroundColor: "transparent" },
            selected
              ? { bottom: 0 }
              : { top: Platform.OS === "android" ? 140 : 240 },
          ]}
          buttonStyle={{ backgroundColor: "#00A680" }}
          titleStyle={{ color: "#FFF" }}
          onPress={validarFiltros}
        />
      </View>
      <Toast ref={toastRef} position="center" opacity={0.9} />
    </View>
  );
};

function NoFoundPlace() {
  return (
    <View style={styles.img}>
      <Image
        source={require("../../assets/img/no-results.png")}
        resizeMode="cover"
        style={{ width: scale(200), height: verticalScale(200) }}
      />
    </View>
  );
}

function Place({ place, navigation }) {
  const { name, id, images } = place.item;
  return (
    <ListItem
      title={name}
      leftAvatar={{
        source: images[0]
          ? { uri: images[0] }
          : require("../../assets/img/no-results.png"),
      }}
      rightIcon={<Icon type="material-community" name="chevron-right" />}
      onPress={() =>
        navigation.navigate("places", {
          screen: "place",
          params: { id, name },
        })
      }
    />
  );
}

const styles = StyleSheet.create({
  searchBar: {
    marginBottom: 20,
  },
  viewBtn: {
    alignSelf: "center",
  },
  img: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Search;
