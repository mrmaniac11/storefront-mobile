import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Pressable, Animated, Dimensions, Easing, TouchableOpacity, PanResponder } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TextInput } from 'react-native-gesture-handler';
import { useNotification } from '../components/notification/NotificationContext';
import networkService from '../network/store';
import { MaterialIcons } from '@expo/vector-icons';

const screenHeight = Dimensions.get('window').height;

const AddProducts = () => {
  const [productUrl, setProductUrl] = React.useState('');
  const { successNotification, errorNotification } = useNotification();
  const createAffiliateProduct = async () => {
    await networkService.post('/create-product', { product_url: productUrl }).then( async(response) => {
      successNotification('Product created successfully!');
    }).catch ( async(errorObj) => {
      if (!errorObj.message) {
        errorNotification(errorObj.message);
      } else {
        errorNotification('Opps! Somthing wrong!');
      }
    }).finally(() => {
      console.log('finally block executed');
    })
  }

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

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
    });
  };


  return (
    <View style={styles.container}>
      <View style={{marginHorizontal: 20}}>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Adding single product</Text>
          <TouchableOpacity onPress={openModal}>
            <MaterialCommunityIcons name='information-outline' size={22} />
          </TouchableOpacity>
        </View>
        <View style={styles.subHeaderContainer}>
          <Text style={{fontSize: 12}}>Adding single product link that you wish to share.</Text>
          <Text style={{fontSize: 12}}>* Please add one product at a time.</Text>
        </View>
        <View style={styles.addProductLinkSection}>
          <Text style={{ fontSize: 18, fontWeight: 600}}>Paste your Product link.</Text>
          <SafeAreaView>
            <TextInput
              style={styles.input}
              onChangeText={setProductUrl}
              value={productUrl}
              placeholder="Orginal product link"
              keyboardType="url"
            />
          </SafeAreaView>
        </View> 
      </View>
      <View style={styles.bottomContainer}>
        <Pressable style={styles.createProductButton} onPress={createAffiliateProduct}>
          <Text style={styles.createProductText}>Create Affiliate Product</Text>
        </Pressable>
      </View>
      {modalVisible && (
        <Modal fadeAnim={fadeAnim} slideAnim={slideAnim} closeModal={closeModal} >
            <CollectionBasicFormInformation closeModal={closeModal} />
          </Modal>
      )}      
    </View>
  );
};

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between'
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20
  },
  header: {
    fontSize: 18,
    fontWeight: 500
  },
  subHeaderContainer: {
    marginTop: 10
  },
  addProductLinkSection: {
    marginTop: 40
  },
  input: {
    height: 40,
    marginTop: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 15
  },
  bottomContainer: {
    marginHorizontal: 20,
    paddingVertical: 10
  },
  createProductButton: {
    borderRadius: 10,
    backgroundColor: '#34AE57',
    padding: 11,
    marginBottom: 20
  },
  createProductText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 300,
    textAlign: 'center'
  },
  // Model content
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
    shadowRadius: 3.84,
    elevation: 5,
  },

});

export default AddProducts;
