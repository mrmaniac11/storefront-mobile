import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Button, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TextInput } from 'react-native-gesture-handler';
import { useNotification } from '../components/notification/NotificationContext';
import networkService from '../network/store';

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

  return (
    <View style={styles.container}>
      <View style={{}}>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Adding single product</Text>
          <MaterialCommunityIcons style={{ marginRight: 20}} name='information-outline' size={22}/>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 20,
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
    marginBottom: 30,
  },
  createProductButton: {
    borderRadius: 20,
    backgroundColor: '#34AE57',
    padding: 10
  },
  createProductText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 300,
    textAlign: 'center'
  }
});

export default AddProducts;
