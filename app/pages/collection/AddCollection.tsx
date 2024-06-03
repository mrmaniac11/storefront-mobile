import React, { useLayoutEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity  } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types'; // Adjust the import path as necessary

// Layout Imports
import AddCollectionBasicForm from './AddCollectionBasicForm';
import CollectionAddProductsContainer from './AddCollectionProducts'
import SocialMediaLinking from './SocialMediaLinking'

type AddProductsProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'AddCollection'>;
  route: RouteProp<RootStackParamList, 'AddCollection'>;
};

const AddCollection: React.FC<AddProductsProps> = ({ navigation, route }) => {

  const { creator_id } = route.params;

  type Product = {
    id: number;
    url: string;
    selectedTags: Array<String>
  };

  const [collectionName, setCollectionName] = React.useState('');
  const [productsList, setProductsList] = React.useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState('collection_basic_details');

  useLayoutEffect(() => {
    if (currentPage === 'collection_basic_details') {
      navigation.setOptions({
        title: 'Create a Collection',
        headerBackTitle: 'Back',
        headerBackTitleVisible: true,
        headerLeft: () => (
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate('AddProducts', { creator_id })}
          >
            <Ionicons name="chevron-back" size={24} color="black" />
          </TouchableOpacity>
        ),
      });
    } else if (currentPage === 'collection_addition_page') {
      navigation.setOptions({
        title: 'Add Prodcuts',
        headerLeft: () => (
          <TouchableOpacity onPress={() => setCurrentPage('collection_basic_details')} style={{marginLeft: 10}}>
            <Ionicons name="chevron-back" size={24} color="black" />
          </TouchableOpacity>
        ),
      });
    } else if (currentPage === 'social_media_linking') {
      navigation.setOptions({
        title: 'Link Social Media',
        headerLeft: () => (
          <TouchableOpacity onPress={() => setCurrentPage('collection_addition_page')} style={{marginLeft: 10}}>
            <Ionicons name="chevron-back" size={24} color="black" />
          </TouchableOpacity>
        ),
      });
    } else if (currentPage === 'social_media_records') {
      navigation.setOptions({
        title: 'Choose Record',
        headerLeft: () => (
          <TouchableOpacity onPress={() => setCurrentPage('social_media_linking')} style={{marginLeft: 10}}>
            <Ionicons name="chevron-back" size={24} color="black" />
          </TouchableOpacity>
        ),
      });
    }
  }, [navigation, currentPage]);


  // Reset state when the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      setCollectionName('');
      setProductsList([]);
    }, [])
  );

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <View style={{flex: 1}}>
      <View style={styles.container}>
        {
            currentPage === 'collection_basic_details' ? 
          (
            <AddCollectionBasicForm
              setCurrentPage={setCurrentPage}
              setCollectionName={setCollectionName}
              collectionName={collectionName}
              setSelectedImage={setSelectedImage}
              selectedImage={selectedImage}
            />
          ) 
            : currentPage === 'collection_addition_page' ? 
          (
            <CollectionAddProductsContainer  
              setCurrentPage={setCurrentPage}
              setProductsList={setProductsList} 
              productsList={productsList} 
            />
          ) 
            : currentPage === 'social_media_linking' ? 
          (
            <SocialMediaLinking 
              setCurrentPage={setCurrentPage} 
            />
          ) 
            : currentPage === 'social_media_records' ? 
          (
            <View>
              Social media records will be here
            </View>
          ): 
            <></>
        }
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
  },
});

export default AddCollection;
