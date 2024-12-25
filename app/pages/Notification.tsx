import React, { useEffect } from "react";
import { Text, View, StyleSheet } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import networkService from "../network/store";

type AddProductsProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Notification'>;
  route: RouteProp<RootStackParamList, 'Notification'>;
};

const Notification: React.FC<AddProductsProps> = ({ navigation, route }) => {

  const { creator_id } = route.params;
  const n = 50; // Number of components to render
  const components = Array.from({ length: n }, (_, index) => index + 1);

  const fetchNotification = async() => {
    await networkService.get('notifications')
    .then( async() => {

    }).catch(()=> {

    })
  }

  useEffect(() => {
    fetchNotification();
  }, [])

  return (
    <View style={{padding: 10}}>
      <View style={{}}>
        {components.map((item) => (
            <View key={item} style={styles.box}>
              <Text>Component {item}</Text>
            </View>
          ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  box: {
    marginVertical: 5,
    padding: 10,
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
    borderRadius: 10,
  },
});

export default Notification