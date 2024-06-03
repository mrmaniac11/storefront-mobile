import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';


const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

type AddProductsProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'AddProducts'>;
  route: RouteProp<RootStackParamList, 'AddProducts'>;
};

const AddProducts: React.FC<AddProductsProps> = ({ navigation, route }) => {
  const { creator_id } = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.bodyContainer}>
        <View>
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('AddSingleProduct', { creator_id })}
          >
            <Text style={styles.cardTitle}>Add Single Product</Text>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('AddCollection', { creator_id })}
          >
            <Text style={styles.cardTitle}>Add Collection</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bodyContainer: {
    flex: 1,
    alignItems: 'center',
  },
  card: {
    width: screenWidth * 0.8,
    height: screenHeight * 0.1,
    backgroundColor: 'white',
    borderRadius: 10,
    marginVertical: 10,
    // Add box shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // Add elevation for Android
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AddProducts;
