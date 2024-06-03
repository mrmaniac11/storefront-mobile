import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, TextInput, Pressable, Image, Animated, Easing, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { launchImageLibrary } from 'react-native-image-picker';

interface CollectionAddProductsContainerProps {
  setCollectionName: React.Dispatch<React.SetStateAction<string>>; // Type for the setState function
  setCurrentPage: React.Dispatch<React.SetStateAction<string>>
  setSelectedImage: React.Dispatch<React.SetStateAction<string|null>>;
  collectionName: string;
  selectedImage: string | null;
 }
const screenHeight = Dimensions.get('window').height;


const CollectionAddProductsContainer: React.FC<CollectionAddProductsContainerProps>= React.memo(
(
  {
    setCollectionName,
    setCurrentPage,
    setSelectedImage,
    collectionName,
    selectedImage,
  }
) => {

  const openImagePicker = () => {
    const options = {
      mediaType: 'photo' as const,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorMessage) {
        console.log('ImagePicker Error:', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        // Set the selected image's URI to state
        const uri = response.assets[0].uri;
        setSelectedImage(uri || null);
        openImageModal();
      }
    });
  };

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const fadeAnim = useRef(new Animated.Value(screenHeight)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const openImageModal = () => {
    setModalVisible(true);
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };
  const closeImageModal = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: screenHeight,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setModalVisible(false);
    });
  };

  const removeCollectionImage = () => {
    setSelectedImage(null);
  }
  return (
    <View style={{flex: 1, justifyContent: 'space-between'}}>
      <View style={{marginHorizontal: 20}}>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Create product collection</Text>
          <MaterialCommunityIcons style={styles.infoIcon} name='information-outline' size={22} />
        </View>

        <View style={styles.subHeaderContainer}>
          <Text style={styles.subHeaderText}>Adding multiple product links that you wish to share.</Text>
        </View>

        {/* Collection Name Section */}
        <View style={styles.collectionNameSection}>
          <Text style={styles.sectionTitle}>Name your Collection</Text>
          <SafeAreaView>
            <TextInput
              style={styles.input}
              onChangeText={setCollectionName}
              value={collectionName}
              placeholder="Collection name"
              keyboardType="default"
            />
          </SafeAreaView>
          <Pressable style={styles.attachImageBtn} onPress={() => selectedImage ? openImageModal() : openImagePicker()}>
            <View style={styles.imageSection}>
              <Text style={styles.imageText}>{selectedImage ? "Preview Image" : "Attach Image"}</Text>
              <MaterialCommunityIcons style={styles.imageIcon} name='image-outline' size={18} />
            </View>
          </Pressable>
        </View>
      </View>
      <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, marginHorizontal: 10}}>
        <TouchableOpacity style={styles.fulllLengthBlackBorderButton} onPress={() => {setCurrentPage('collection_addition_page')}}>
          <Text style={styles.saveCollectionButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
      {modalVisible && (
        <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
          <TouchableOpacity style={styles.backdropTouchable} onPress={closeImageModal} />
          <Animated.View style={[styles.modalContent, { transform: [{ translateY: slideAnim }] }]}>
            <View style={{ display: 'flex', alignSelf: 'flex-end', marginTop: 10, marginRight: 15 }}>
              <TouchableOpacity onPress={closeImageModal}>
                <Text style={[styles.basicButtonText, {fontSize: 18}]}>Done</Text>
              </TouchableOpacity>
            </View>
            <View>
              { selectedImage ? 
                <Image source={{ uri: selectedImage }} style={styles.previewImage} /> 
                : 
                <View style={styles.previewImage}>
                  <View style={{ width: 250, height: 250, borderRadius: 50, backgroundColor: 'grey', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: 'white' }}>No image selected</Text>
                  </View>
                </View>
              }
              { selectedImage ?
                <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-around', width: '100%'}}>
                  <Pressable style={styles.editButton} onPress={openImagePicker}>
                    <View style={styles.imageSection}>
                    <Text style={styles.basicButtonText}>Edit</Text>
                    </View>
                  </Pressable>
                  <TouchableOpacity onPress={removeCollectionImage} style={[styles.editButton, styles.removeButton]}>
                    <Text style={styles.basicButtonText}>{"Remove"}</Text>
                  </TouchableOpacity>
                </View>
                :
                <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-around', width: '100%'}}>
                  <Pressable style={styles.editButton} onPress={openImagePicker}>
                    <View style={styles.imageSection}>
                    <Text style={[styles.basicButtonText]}>Add Image</Text>
                    </View>
                  </Pressable>
                </View>
              }
            </View>
            <View></View>
          </Animated.View>
        </Animated.View>
      )}      
    </View>
  )
});


const styles = StyleSheet.create({
  headerContainer: {
    marginTop: 20,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  header: {
    fontSize: 18,
    fontWeight: '500',
  },
  infoIcon: {
    marginRight: 20,
  },
  subHeaderContainer: {
    marginBottom: 25,
  },
  subHeaderText: {
    fontSize: 12,
  },
  collectionNameSection: {
    backgroundColor: 'inherit',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  input: {
    width: '100%',
    height: 40,
    marginTop: 12,
    borderWidth: 1,
    padding: 20,
    borderRadius: 15,
  },
  attachImageBtn: {
    alignContent: 'flex-end',
    marginTop: 5,
  },
  imageSection: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  imageText: {
    color: '#006DB5',
    fontSize: 16,
  },
  imageIcon: {
    marginLeft: 5,
  },
  fulllLengthBlackBorderButton: {
    backgroundColor: 'black',
    width: '100%',
    marginRight: 5,
    borderRadius: 10,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'black',
  },
  saveCollectionButtonText: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
  },

  // For Selected Image preview
  button: {
    alignContent: 'flex-end',
    width: 80,
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
  },
  previewImage: {
    width: 250,
    height: 250,
    borderRadius: 10,
  },
  editButton: {
    marginTop: 20,
    paddingVertical: 5,
    paddingHorizontal: 15,
    backgroundColor: '#126cbd',
    borderRadius: 5,
  },
  removeButton: {
    backgroundColor: '#ff4757',
  },
  basicButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  // Model for collection image
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  backdropTouchable: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContent: {
    width: '100%',
    height: '75%',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default CollectionAddProductsContainer