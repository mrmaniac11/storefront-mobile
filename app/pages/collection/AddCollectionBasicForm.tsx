import React, { useState, useRef, Children } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, TextInput, Pressable, Image, Animated, Easing, Dimensions, PanResponder } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { launchImageLibrary } from 'react-native-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

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
  const [modalVisibleContent, setModalVisibleContent] = useState<'image-modal' | 'info-modal'|''>('');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        setModalVisible(false);
        setModalVisibleContent('');
      };
    }, [])
  );

  const openImageModal = () => {
    setModalVisibleContent('image-modal');
    openModal();
  }

  const openCollectionInfoModal = () => {    
    setModalVisibleContent('info-modal');
    openModal();
  }

  const openModal = () => {
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
  const closeModal = () => {
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
      setModalVisibleContent('');
    });
  };

  let errors = [];
  const validate = () => {
    if (collectionName === '') {
      errors.push('collection_name');
    }
  }

  const removeCollectionImage = () => {
    setSelectedImage(null);
  }

  const navigateToCollectionProductAdditionPage = () => {
    setCurrentPage('collection_addition_page')
  }
  return (
    <View style={{flex: 1, justifyContent: 'space-between'}}>
      <View style={{marginHorizontal: 20}}>
        <View style={{marginBottom: 20}}>
          <View style={styles.headerContainer}>
            <Text style={styles.header}>Create product collection</Text>
            <TouchableOpacity onPress={openCollectionInfoModal}>
              <MaterialCommunityIcons name='information-outline' size={22} />
            </TouchableOpacity>
          </View>
          <View style={styles.subHeaderContainer}>
            <Text style={styles.subHeaderText}>Adding multiple product links that you wish to share.</Text>
          </View>
        </View>

        {/* Collection Name Section */}
        <View style={styles.collectionNameSection}>
          <View style={{marginBottom: 10}}>
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
          </View>
          <Pressable style={styles.attachImageBtn} onPress={() => selectedImage ? openImageModal() : openImagePicker()}>
            <View style={styles.imageSection}>
              <Text style={styles.imageText}>{selectedImage ? "Preview Image" : "Attach Image"}</Text>
              <MaterialCommunityIcons style={styles.imageIcon} name='image-outline' size={18} />
            </View>
          </Pressable>
        </View>
      </View>
      <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, marginHorizontal: 10}}>
        <TouchableOpacity style={styles.fulllLengthBlackBorderButton} onPress={navigateToCollectionProductAdditionPage}>
          <Text style={styles.saveCollectionButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
      {modalVisible && modalVisibleContent &&(
        <Modal fadeAnim={fadeAnim} slideAnim={slideAnim} closeModal={closeModal} >
          { modalVisibleContent === 'image-modal' &&
            <CollectionImageModal selectedImage={selectedImage} openImagePicker={openImagePicker} removeCollectionImage={removeCollectionImage} closeModal={closeModal} />
          }
          { modalVisibleContent === 'info-modal' &&
            <CollectionBasicFormInformation closeModal={closeModal}/>
          }
          </Modal>
      )}      
    </View>
  )
});

interface ModalProps {
  fadeAnim: Animated.Value;
  closeModal: () => void;
  slideAnim: Animated.Value;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ fadeAnim, closeModal, slideAnim, children }) => {
  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, { dy: pan.y }], { useNativeDriver: false }),
      onPanResponderRelease: (e, gestureState) => {
        if (gestureState.dy > 100) {
          closeModal();
        } else {
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  return (
    <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
      <TouchableOpacity style={styles.backdropTouchable} onPress={closeModal} />
      <Animated.View 
        {...panResponder.panHandlers} 
        style={[
          styles.modalContent, 
          { transform: [{ translateY: slideAnim }] }
          ]}>
        {children}
        <View></View>
      </Animated.View>
    </Animated.View>
  )
}

const CollectionBasicFormInformation: React.FC<{ closeModal: () => void}> = ({ closeModal }) => {
  return (
    <>
      <View style={{ display: 'flex', alignSelf: 'flex-end', width: '100%' }}>
        <TouchableOpacity style={{marginTop: 20, marginRight: 20}} onPress={closeModal}>
          {/* <MaterialCommunityIcons style={{textAlign: 'right'}} name='close-circle-outline' size={26} color={'gray'}/> */}
          <MaterialIcons style={{textAlign: 'right'}} name="cancel" size={30} color="lightgrey" />

        </TouchableOpacity>
        <View style={{ width: '100%', height: 1, backgroundColor: '#ccc', marginVertical: 10 }} />
      </View>
      <View>
        <Text>Collection Name</Text>
        <TextInput placeholder="Collection Name" />
      </View>
    </>
  )
}
const CollectionImageModal: React.FC<{ selectedImage: string|null, openImagePicker: () => void, removeCollectionImage: () => void, closeModal: () => void }> = ({ selectedImage, openImagePicker, removeCollectionImage, closeModal }) => {
  return (
    <>
      <View style={{ display: 'flex', alignSelf: 'flex-end', width: '100%' }}>
        <TouchableOpacity style={{marginTop: 20, marginRight: 20}} onPress={closeModal}>
          <Text style={[styles.basicButtonText, {fontSize: 18, color: 'black', textAlign: 'right'}]}>Done</Text>
        </TouchableOpacity>
        <View style={{ width: '100%', height: 1, backgroundColor: '#ccc', marginVertical: 10 }} />
      </View>
      <View>
        { selectedImage ? 
          <Image source={{ uri: selectedImage }} style={styles.previewImage} /> 
          : 
          <View style={styles.previewImage}>
            <View style={{ width: 150, height: 150, borderRadius: 50, backgroundColor: 'grey', alignItems: 'center', justifyContent: 'center' }}>
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
    </>
  )
}

const styles = StyleSheet.create({
  headerContainer: {
    marginTop: 20,
    marginBottom: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  header: {
    fontSize: 18,
    fontWeight: '700',
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
    fontSize: 16,
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
    padding: 11,
    borderWidth: 1,
    borderColor: 'black',
    marginBottom: 20,
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
    width: 150,
    height: 150,
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
    height: '60%',
    backgroundColor: 'white',
    backfaceVisibility: 'hidden',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopEndRadius: 20,
    borderTopStartRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 5,
  },
});

export default CollectionAddProductsContainer