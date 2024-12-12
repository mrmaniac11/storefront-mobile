import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, SafeAreaView, TextInput, ScrollView, Modal, Linking } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Button } from '@mui/material';
import { Ionicons } from '@expo/vector-icons';

const screenHeight = Dimensions.get('window').height;

type Product = {
  id: number;
  url: string;
  selectedTags: Array<String>
};

interface CollectionAddProductsContainerProps {
  setCurrentPage: React.Dispatch<React.SetStateAction<string>>; // Type for the setState function
  productsList: Product[];
  setProductsList: React.Dispatch<React.SetStateAction<Product[]>>
 }

const CollectionAddProductsContainer: React.FC<CollectionAddProductsContainerProps>= React.memo(({setCurrentPage, productsList, setProductsList}) => {

  useFocusEffect(
    React.useCallback(() => {
      setCurrentProduct(null);
    }, [])
  );

  type Product = {
    id: number;
    url: string;
    selectedTags: Array<String>
  };

  interface CategoriesItem {
    id: number;
    title: string;
  }

  const [currentProduct, setCurrentProduct] = React.useState<Product | null>(null);
  const [modalVisible, setModalVisible] = React.useState(false);
  const inputRef = useRef<TextInput>(null);

  const newProduct: Product = {
    id: productsList.length + 1,
    url: '',
    selectedTags: []
  };

  React.useEffect(() => {
    if (modalVisible && inputRef.current) {
      inputRef.current.focus();
    }
  }, [modalVisible]);

  const toggleModal = () => {
    if (modalVisible && currentProduct && !currentProduct.url) {
      setProductsList((prevList) => 
        prevList.filter((product) => product.id !== currentProduct.id)
      );
    }
    setModalVisible(!modalVisible);
  };

  const deleteProductFromCollection = (productId: number) => {
    setProductsList((prevList) => 
      prevList.filter((product) => product.id !== productId)
    );
  }

  interface Category {
    id: number;
    title: string;
  }

  const preDefinedCategoriesData: Category[] = [
    { id: 1, title: "Party Wear" },
    { id: 2, title: "Casual Wear" },
    { id: 3, title: "Formal Wear" },
    { id: 4, title: "Ethnic Wear" },
    { id: 5, title: "Sarees" },
    { id: 6, title: "Kurtis" },
    { id: 7, title: "Lehengas" },
    { id: 8, title: "Tops & Tees" },
    { id: 9, title: "Jeans & Pants" },
    { id: 10, title: "Activewear" },
    { id: 11, title: "Loungewear" },
    { id: 12, title: "Swimwear" },
    { id: 13, title: "Accessories" },
    { id: 14, title: "Makeup" },
    { id: 15, title: "Skin Care" },
    { id: 16, title: "Hair Care" },
    { id: 17, title: "Footwear" },
    { id: 18, title: "Jewelry" },
    { id: 19, title: "Bags & Handbags" },
    { id: 20, title: "Watches" },
    { id: 21, title: "Fragrances" },
    { id: 22, title: "Winter Wear" },
    { id: 23, title: "Maternity Wear" },
    { id: 24, title: "Denim" },
    { id: 25, title: "Shirts & Blouses" },
    { id: 26, title: "Dresses" },
    { id: 27, title: "Nightwear" },
    { id: 28, title: "Undergarments" },
    { id: 29, title: "Grooming Products" },
    { id: 30, title: "Blazers & Coats" },
    { id: 31, title: "Suits & Tuxedos" },
    { id: 32, title: "Fusion Wear" },
    { id: 33, title: "Jackets" },
    { id: 34, title: "Hats & Caps" },
    { id: 35, title: "Belts" },
    { id: 36, title: "Sunglasses" },
    { id: 37, title: "Palazzos" },
    { id: 38, title: "Trousers" },
    { id: 39, title: "Scarves" },
    { id: 40, title: "Traditional Outfits" },
    { id: 41, title: "Western Wear" },
    { id: 42, title: "Workwear" },
    { id: 43, title: "Festival Wear" },
    { id: 44, title: "Plus Size Fashion" },
    { id: 45, title: "Beachwear" },
    { id: 46, title: "Jumpsuits" },
    { id: 47, title: "Ponchos & Shrugs" },
    { id: 48, title: "Wedding Collection" },
    { id: 49, title: "Fashion Jewelry" },
    { id: 50, title: "Beauty Tools & Accessories" },
  ];

  const addNewProductToCollection = () => {
    setProductsList([...productsList, newProduct]);
    toggleModal();
    setCurrentProduct(newProduct);
  };


  const showProductDetail = (product: Product) => {
    toggleModal();
    setCurrentProduct(product);
  }

  const updateProductDetails = (currentProduct: Product) => {
    setProductsList((prevList) =>
      prevList.map((product) =>
        product.id === currentProduct.id ? currentProduct : product
      )
    );    
  };

  const handleUrlChange = (currentProductUrl: string) => {
    setCurrentProduct((prevProduct) => {
      if (!prevProduct) return null;
      const updatedProduct = { ...prevProduct, url: currentProductUrl };
      updateProductDetails(updatedProduct); 
      return updatedProduct;
    });
  };
  
  const tagSelected = (tag: string) => {
    setCurrentProduct((prevProduct) => {
      if (!prevProduct) {
        return null;
      }
      let isTagAssociated= false;  
      prevProduct?.selectedTags.forEach((selectedTag) => {
        if (selectedTag === tag) {
            isTagAssociated = true;
        }
      })
      if (isTagAssociated){
        return prevProduct;
      }
      else {
        const updatedProduct = {
          ...prevProduct,
          selectedTags: [...prevProduct.selectedTags, tag],
        };
        updateProductDetails(updatedProduct);
        return updatedProduct;
      }      
    });
    
  };

  const saveAsCollectionAction = () => {

  }
  return (
      <View style={{flex: 1, justifyContent: 'space-between', marginHorizontal: 20}}>
          <TouchableOpacity onPress={addNewProductToCollection} style={styles.addButtonContainer}>
            <View style={styles.addButton}>
              <MaterialCommunityIcons style={styles.addIcon} name='plus' size={30} />
              <Text style={styles.addButtonText}>Add Products</Text>
            </View>
          </TouchableOpacity>

          { productsList.length > 0 ? (
            <ScrollView contentContainerStyle={styles.productsContainer} showsVerticalScrollIndicator={false}>
              {productsList.slice().reverse().map((product: Product) => (
                <View key={product.id} style={styles.productCard}>
                  {product.url ? (
                    <TouchableOpacity style={styles.productCardTouch} onPress={() => showProductDetail(product)}>
                      <View style={[styles.productCardViewContainer, styles.productCardViewContainerParent]}>
                        <View style={styles.productCardViewContainer}>
                          <View style={styles.productCardView}>
                            {/* <View style={styles.productId}>
                              <Text>{product.id}</Text>
                            </View> */}
                            <View style={{display: 'flex', flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'space-between'}}>
                                <TouchableOpacity style={{}} onPress={() => Linking.openURL(product.url)}>
                                <Ionicons name="link-sharp" size={20} color="#3d85c6" />
                                </TouchableOpacity>
                              <View style={{ width: '92%', marginLeft: 0, padding: 10, borderRadius: 7, borderWidth: 1, borderColor: 'lightgray'}}>
                                <ScrollView
                                  horizontal
                                  showsHorizontalScrollIndicator={false}
                                  contentContainerStyle={styles.productUrlContainer}
                                >
                                  <Text style={styles.productUrlText}>{product.url}</Text>
                                </ScrollView>
                              </View>
                              
                            </View>
                            
                          </View>
                            <View style={{display: 'flex', flexDirection: 'row'}}>
                              <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', width: '60%'}}>
                                { product.selectedTags.length === 1 &&
                                  <View style={[styles.categoryTag, styles.categoryTagForSelectedProducts, { maxWidth: '50%', backgroundColor: 'gray'}]}>
                                    <Text style={{color: 'white'}} numberOfLines={1}>{product.selectedTags[0]}</Text>
                                  </View>
                                } 
                                {!product.selectedTags.length &&
                                  <View style={[styles.categoryTag, styles.categoryTagForSelectedProducts, { maxWidth: '100%', backgroundColor: 'inherit'}]}>
                                    <Text style={{fontWeight: 'bold', fontStyle: 'italic', color: 'gray'}} numberOfLines={1}>{"No Categories"}</Text>
                                  </View>
                                }
                                {product.selectedTags.length > 1 && (
                                  <View style={{justifyContent: 'center', alignItems: 'center', borderRadius: 50, height: 30, margin: 5, marginLeft: 15}}>
                                    <Text style={{fontWeight: 'bold', fontStyle: 'italic', color: 'gray', fontSize: 13}}>
                                      <Text>
                                        {product.selectedTags.length > 9 ? 
                                        `9+ ` : `${product.selectedTags.length}  `
                                        } 
                                        <Text>{"Categories"}</Text>
                                      </Text>
                                    </Text>
                                  </View>
                                )}
                              </View>
                              <View style={{width: '40%', justifyContent: 'center', alignItems: 'flex-end'}}>
                                <View style={{display:'flex', flexDirection: 'row', alignSelf: 'flex-end'}}>
                                  <TouchableOpacity
                                    style={{}}
                                    onPress={toggleModal}
                                  >
                                    <Ionicons name="pencil" size={20} color='#1485b3'/>
                                  </TouchableOpacity>
                                  <TouchableOpacity
                                    style={{ marginHorizontal: 10}}
                                    onPress={() => deleteProductFromCollection(product.id)}
                                  >
                                    <Ionicons name="trash" size={20} color='#ff4757'/>
                                  </TouchableOpacity>
                                </View>
                              </View>
                          </View>
                        </View>
                      </View>
                      
                    </TouchableOpacity>
                  ) : null}
                </View>
              ))}
            </ScrollView>
          ): 
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{fontSize: 18, color: 'grey'}}>No products added yet</Text>
            </View>
          }
          

          <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={toggleModal}
          >
            <View style={styles.backdrop}>
              <TouchableOpacity style={styles.backdropTouchable} onPress={toggleModal} />
              <View style={styles.modalContainer}>
                <SafeAreaView>
                  <View style={{display: 'flex', flexDirection: 'row'}}>
                    <View style={{ position: 'relative', flexGrow: 4 }}>
                      <TextInput
                        ref={inputRef}
                        style={styles.productUrlInput}
                        value={currentProduct?.url}
                        onChangeText={handleUrlChange}
                        placeholder="Paste product url"
                        keyboardType="default"
                      />
                      {currentProduct?.url ? (
                        <TouchableOpacity
                          style={{ position: 'absolute', right: 10, top: '36%', backgroundColor: 'white', paddingStart: 10}}
                          onPress={toggleModal}
                        >
                          <Ionicons name="checkmark" size={24} color='#34AE57'/>
                        </TouchableOpacity>
                      ) : null}
                    </View>
                    
                    {currentProduct?.url ? (
                      <View style={{flexGrow: 1, width: 0}}>
                        <TouchableOpacity
                          style={{top: '36%', backgroundColor: 'white', paddingStart: 10}}
                          onPress={() => handleUrlChange('')}
                        >
                          <Ionicons name="close-circle" size={24} color="black" />
                        </TouchableOpacity>
                        </View>
                      ) : null}
                  </View>
                </SafeAreaView>
                <View style={styles.catergoriesTagContainer}>
                  <ScrollView 
                    contentContainerStyle={{display: 'flex', flexDirection: 'row', flexWrap:'wrap', justifyContent: 'center'}}
                    showsVerticalScrollIndicator={false}
                  >
                    {currentProduct?.selectedTags.map((tag) => (
                      <TouchableOpacity style={styles.categoryTag}
                        onPress={() => {
                          setCurrentProduct((prevProduct) => {
                            if (!prevProduct) return null;
                            const updatedTags = prevProduct.selectedTags.filter((t) => t !== tag);
                            const updatedProduct = { ...prevProduct, selectedTags: updatedTags };
                            updateProductDetails(updatedProduct);
                            return updatedProduct;
                          });
                        }}
                      >
                        <Text style={{marginEnd: 5, color: 'white'}}>{tag}</Text>
                        <View style={styles.closeButton} >
                          <Ionicons name="close" size={10} color="white" />
                        </View>
                      </TouchableOpacity>
                    ))}
                    {preDefinedCategoriesData
                      .filter((category) => !currentProduct?.selectedTags.includes(category.title))
                      .map((category: CategoriesItem) => (
                      <TouchableOpacity key={category.id} onPress={() => tagSelected(category.title)}>
                        <View style={styles.categoryTag}>
                          <Text style={{color: 'white'}}>{category.title}</Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </View>
            </View>
          </Modal>

        <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, marginTop: 10}}>
          <View style={{borderWidth: 1, borderColor: 'black', borderRadius: 10, marginRight: 10, width: '40%'}}>
            <Button style={{color: 'black', backgroundColor: 'inherit', paddingTop: 6, paddingBottom: 6}} onClick={saveAsCollectionAction}>
            Save
            </Button>
          </View>
          <Button style={{color: 'white', backgroundColor: '#34AE57', width: '60%', marginLeft: 10, borderRadius: 10, paddingTop: 6, paddingBottom: 6}} onClick={() => {setCurrentPage('social_media_linking')}}>
            Link Social Media
          </Button>
        </View>
      </View>
  )
})


const commonShadowStyles = {
  borderRadius: 10,
  shadowColor: '#000',
  shadowOpacity: 0.1,
  shadowRadius: 2,
  elevation: 5,
};

const styles = StyleSheet.create({
  addButtonContainer: {
    height: screenHeight * 0.07,
    width: '100%',
    marginVertical: 20
  },
  addButton: {
    height: '100%',
    backgroundColor: '#34AE57',
    flexDirection: 'row',
    alignItems: 'center',
    paddingStart: 20,
    borderRadius: 10,
  },
  addIcon: {
    color: 'white',
  },
  addButtonText: {
    marginStart: 20,
    color: 'white'
  },
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.09)',
  },
  backdropTouchable: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    width: '87%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 10,
    justifyContent: 'flex-end',
  },
  productUrlInput: {
    borderWidth: 0.001,
    width: '100%',
    height: 35,
    marginTop: 12,
    padding: 10,
    borderRadius: 10,
  },

    productsContainer: {
    flexGrow: 1,
    borderRadius: 10,
    padding: 10,
    overflow: 'hidden', // To prevent overflow beyond the height
  },
  
  productCard: {
    width: '100%',
    marginBottom: 5,
  },
  productCardTouch: {
    width: '100%',
  },
  productCardView: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  productId: {
    paddingVertical: 5,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 10,
  },
  productUrlText: {
    flexShrink: 1,
    overflow: 'scroll',
  },
  catergoriesTagContainer: {
    padding: 15,
    marginTop: 20,
    borderRadius: 20,
    minHeight: screenHeight * 0.2,
    maxHeight: screenHeight * 0.5,
    width: '100%',
    backgroundColor: 'black',
    overflow: 'scroll'
  },

  categoryTag: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    margin: 5,
    backgroundColor: 'rgb(87, 86, 86)',
  },

  categoryTagForSelectedProducts: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  productCardViewContainerParent: {
    ...commonShadowStyles,
    shadowOffset: { width: -1, height: 5 },
    marginBottom: 15,
  },
  productCardViewContainer: {
    ...commonShadowStyles,
    shadowOffset: { width: 1, height: 5 },
  },
  
  productUrlContainer: {
    flexGrow: 1, // Ensures the scrollview grows if necessary
  },
  // close button
  closeButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Optional: semi-transparent background
    borderRadius: 12,
    padding: 4,
  },
});

export default CollectionAddProductsContainer;
