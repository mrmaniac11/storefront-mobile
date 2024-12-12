import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ImageBackground } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../types';
import { BlurView } from 'expo-blur';
import { MaterialIcons } from '@expo/vector-icons';


interface Item {
  id: string;
  title: string;
  price: number;
  image_url: string;
  affiliate_url: string;
}

interface CollectionProductsProps {
  products: Array<Item>; // Array of product items
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>; // Function to control modal visibility
  setSelectedCollectionProducts: React.Dispatch<React.SetStateAction<Array<Item> | []>>; // Function to update selected products
  setSelectedProduct: React.Dispatch<React.SetStateAction<Item|null>>; // Function to set a selected product
  setModalVisibleProductDetail: React.Dispatch<React.SetStateAction<boolean>>; // Function to control product detail modal visibility
  openProductDetails: (item: Item) => void;
}

const CollectionProductDetails: React.FC<CollectionProductsProps> = ({
  products,
  openProductDetails
}) => {

  const renderItem = ({ item }: { item: Item }) => (
    <TouchableOpacity style={styles.card} onPress={() => openProductDetails(item)}>
      <ImageBackground
        source={{ uri: item.image_url }}
        style={styles.imageBackground}
        imageStyle={{ borderRadius: 10 }}
      >
        <BlurView intensity={80} style={styles.textContainer} tint="light">
           <View style={{}}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.price}>${item.price}</Text>
        </View>
        </BlurView>
      </ImageBackground>
    </TouchableOpacity>
  );

  return (
    <View style={{ width: '100%', flex: 1, marginBottom: '12%' }}>
      <FlatList
        data={products}
        renderItem={renderItem}
        numColumns={2}
        showsVerticalScrollIndicator={false}
      />
  </View>
  )
}; 

const styles = StyleSheet.create({
  card: {
    display: 'flex',
    justifyContent: 'flex-end',
    width: '47%',
    height: 250,
    borderRadius: 10,
    margin: 5,
    backgroundColor: '#ccc',
    borderColor: 'lightgrey',
    borderWidth: 0.05,
    overflow: 'hidden',
  },
  title: {
    textAlign: 'right',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  price: {
    marginTop: 'auto',
  },
 // Product image background
  imageBackground: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end', // Align text at the bottom
  },
  textContainer: {
    backgroundColor: 'lightgray',
    padding: 8,
    display: 'flex', 
    alignItems: 'flex-end', 
    overflow: 'hidden'
  },
})

export default CollectionProductDetails;