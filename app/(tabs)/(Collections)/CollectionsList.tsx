import React, 
{ useState,
  useEffect,
  useRef } from 'react';
import { View,
  Text, 
  StyleSheet,
  Dimensions, 
  TouchableOpacity, 
  Animated,
  Easing,
  FlatList, 
  NativeSyntheticEvent, 
  NativeScrollEvent,
  ImageBackground,
  ActivityIndicator
} from 'react-native';
import SearchBar from "react-native-dynamic-search-bar";
import { MaterialIcons } from '@expo/vector-icons';
import ProductDetails from '../Products/ProductDetails'
import networkService from '@/app/network/store';
import { BlurView } from 'expo-blur';
import CollectionProductDetails from './CollectionProducts';
import ListLoading from '@/app/components/ListLoading';
import MenuBar from '../../components/MenuBar';
import { MenuProvider } from '../../components/MenuContext';

const screenHeight = Dimensions.get('window').height;
interface CollectionListPageProps {
  creator_id: string;
}

interface Item {
  id: string;
  title: string;
  price: number;
  image_url: string;
  affiliate_url: string;
}

const CollectionsList: React.FC<CollectionListPageProps> = ({creator_id}) => {
  interface Collections {
    index: number,
    id: string;
    name: string;
    description: string;
    image_url: string;
    media_ind: boolean;
    total_products: number;
    media_data: {
      id: string;
      media_id: string;
      media_type: string;
      media_source: string;
      thumbnail_url: string;
    };
  }

  const [selectedProduct, setSelectedProduct] = useState<Item|null>(null);
  const [selectedCollectionProducts, setSelectedCollectionProducts] = useState<Item[]>([])
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalVisibleProductDetail, setModalVisibleProductDetail] = useState<boolean>(false);
  const [data, setData] = useState<Collections[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasMorePage, setHasMorePage] = useState<boolean>(true);

  const fadeAnimProduct = useRef(new Animated.Value(0)).current;
  const COLLECTION_LIST_PER_PAGE = 40;

  const slideAnim = useRef(new Animated.Value(screenHeight)).current;
  const slideAnimProduct = useRef(new Animated.Value(screenHeight)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pageRef = useRef(0);
  const scrollY = useRef(new Animated.Value(0)).current;
  const isScrollingDownRef = useRef(true);
  const opacity = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(0)).current
  const previousOffset = useRef(0);
  const marginTopAnim = useRef(new Animated.Value(60)).current;
  const doesScrollHappend = useRef(false);
  const flatListRef = useRef<FlatList>(null);

  // Mock data's
  const mockDataStore: Collections[] = [];
  let globalIndex = 1001;
  const mockData: Item[] =  [
    { id: "1685", title: "Title", price: 112, image_url: "https://m.media-amazon.com/images/I/81Lq+GdvLML._AC_UL640_FMwebp_QL65_.jpg", affiliate_url: "www.linkfit.com/share/xcv3sd" },
    { id: "1686", title: "Title", price: 113, image_url: "https://m.media-amazon.com/images/I/71PJDbuITPL._AC_UL640_FMwebp_QL65_.jpg", affiliate_url: "www.linkfit.com/share/xcv3sd" },
    { id: "1687", title: "Title", price: 114, image_url: "https://m.media-amazon.com/images/I/61oXoXM4LDL._AC_UL640_FMwebp_QL65_.jpg", affiliate_url: "www.linkfit.com/share/xcv3sd" },
    { id: "1688", title: "Title", price: 115, image_url: "https://m.media-amazon.com/images/I/91-UGuJO5hL._AC_UL640_FMwebp_QL65_.jpg", affiliate_url: "www.linkfit.com/share/xcv3sd" },
    { id: "1689", title: "Title", price: 116, image_url: "https://m.media-amazon.com/images/I/61J+31tRUJL._AC_UL640_FMwebp_QL65_.jpg", affiliate_url: "www.linkfit.com/share/xcv3sd" },
    { id: "1690", title: "Title", price: 117, image_url: "https://m.media-amazon.com/images/I/6141UBj2nXL._SY879_.jpg", affiliate_url: "www.linkfit.com/share/xcv3sd" },
    { id: "1691", title: "Title", price: 118, image_url: "https://m.media-amazon.com/images/I/81ZRJ33PZCL._AC_UL640_FMwebp_QL65_.jpg", affiliate_url: "www.linkfit.com/share/xcv3sd" },
    { id: "1692", title: "Title", price: 119, image_url: "https://m.media-amazon.com/images/I/81SOsEnYUBL._AC_UL640_FMwebp_QL65_.jpg", affiliate_url: "www.linkfit.com/share/xcv3sd" },
    { id: "1693", title: "Title", price: 120, image_url: "https://m.media-amazon.com/images/I/91GLR08Ns5L._AC_UL640_FMwebp_QL65_.jpg", affiliate_url: "www.linkfit.com/share/xcv3sd" },
  ];
  const generateMockData = (count: number) => {
    const mockData: Collections[] = [];
    let i: number;
    for (i = 0; i < count; i++) {
      mockData.push({
        index: i,
        id: (globalIndex++).toString(),
        name: `Test Collection Name ${globalIndex}`,
        description: `Test Collection Description ${globalIndex}`,
        image_url: "",
        media_ind: true,
        total_products: 5,
        media_data: {
          id: (globalIndex + 1000).toString(),
          media_id: `XCV67890@#DFH${globalIndex}`,
          media_type: "Reel",
          media_source: "Instagram",
          thumbnail_url: "www.instagram.com/assets/image-png",
        },
      });
    }
    return mockData;
  };
  const getMockData = () => {
    let page = pageRef.current;
    const pageSize = COLLECTION_LIST_PER_PAGE;
    const requiredDataCount = page * pageSize + COLLECTION_LIST_PER_PAGE;
    if (mockDataStore.length < requiredDataCount) {
      const additionalData = generateMockData(
        requiredDataCount - mockDataStore.length
      );
      mockDataStore.push(...additionalData);
    }
    const start = page * pageSize;
    const end = start + pageSize;
    const data = mockDataStore.slice(start, end);

    return {
      data,
      has_next: true,
    };
  };
  const fetchCollectionMockData = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("setting data");
        const result = getMockData();
        setData(prevData => {
          const prevDataLength = prevData.length;
          const newData = [...prevData, ...result.data];
          if (prevDataLength === 0) {
            flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
          }
          return newData;
        });
        setHasMorePage(result.has_next);
        resolve(true);
      }, 1000);
    });
  };

  //Actions
  const handleDelete = () => {
    // Implement delete functionality here
  };
  const handleMarkAsInactive = () => {
    // Implement mark as inactive functionality here
  };
  const getCollectionDetails = (collection_id: string, creator_id: string) => {
    setSelectedCollectionProducts(mockData);
    openListOfProductDetails();
  }
  const menuOptions = [
    { displayName: 'Delete', callback: handleDelete },
    { displayName: 'Mark as inactive', callback: handleMarkAsInactive }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  // Model operations
  const openProductDetails = (product: Item) => {
    setSelectedProduct(product);
    setModalVisibleProductDetail(true);
    Animated.parallel([
      Animated.timing(slideAnimProduct, {
        toValue: 0,
        duration: 5,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
      Animated.timing(fadeAnimProduct, {
        toValue: 1, // Fade in
        duration: 5,
        useNativeDriver: true,
      }),
    ]).start();
  };
  const closeProductDetails = () => {
    Animated.parallel([
      Animated.timing(slideAnimProduct, {
        toValue: screenHeight,
        duration: 5,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnimProduct, {
        toValue: 0,
        duration: 5,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setModalVisibleProductDetail(false);
      setSelectedProduct(null);
    });
  };
  const openListOfProductDetails = () => {
    setModalVisible(true);
  
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 5,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 5,
        useNativeDriver: true,
      }),
    ]).start();
  };
  const closeListOfProductDetails = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: screenHeight,
        duration: 5,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 5,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setModalVisible(false);
      setSelectedCollectionProducts([]);
    });
  };
  const closeProductDetailsWithProductsList = () => {
    closeListOfProductDetails();
    closeProductDetails();
  }

  // Network call
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await networkService.get('collections', {
        start_index: pageRef.current * COLLECTION_LIST_PER_PAGE,
        limit: COLLECTION_LIST_PER_PAGE
      });
      const collections = response.data.collections || [];
      const hasMore = response.data.pagination?.has_more_page || false;
      setData(prevData => [...prevData, ...collections]);
      setHasMorePage(hasMore);
      pageRef.current = pageRef.current + 1;
    } catch (error) {
        console.error("Error fetching data:", error);
        await fetchCollectionMockData();
        pageRef.current = pageRef.current + 1;
    } finally {
        setIsLoading(false);
    }

  };
  const fetchMoreDataOnEndReached = () => {
    if (doesScrollHappend.current && !isLoading && hasMorePage) {
      fetchData();
    }
  }

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: true,
      listener: (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        doesScrollHappend.current = true;
        const currentOffset = event.nativeEvent.contentOffset.y;
        const isScrollingDown = currentOffset > previousOffset.current;
        let currentOpacity = 1;
        let currentTranslateY = 0;
        if (isScrollingDown) {
          console.log("scrolling down");
          
          if (currentOffset < 60) {
            currentOpacity = 1 - (currentOffset / 60);
            currentTranslateY = -(currentOffset / 2);
          } else {
            currentOpacity = 0;
            currentTranslateY = -60;
          }
          Animated.parallel([
            Animated.timing(opacity, {
              toValue: currentOpacity,
              duration: 5,
              useNativeDriver: true,
            }),
            Animated.timing(translateY, {
              toValue: currentTranslateY,
              duration: 5,
              useNativeDriver: true,
            }),
            Animated.timing(marginTopAnim, {
              toValue: 0,
              duration: 5,
              useNativeDriver: false,
            })
          ]).start();          
          isScrollingDownRef.current = true;
        } else if (!isLoading){
          if (currentOffset < 60) {
            currentOpacity = 1;
            currentTranslateY = 0;
          } else {
            if (isScrollingDownRef.current) {
              currentOpacity = 0;
              currentTranslateY = 10;
            } else {
              currentOpacity = 1;
              currentTranslateY = 0;
            }
          }
          if (!(currentOffset === previousOffset.current)) {
            console.log("scrolling up");
            Animated.timing(marginTopAnim, {
              toValue: 60,
              duration: 5,
              useNativeDriver: false,
            }).start();
          }
          Animated.parallel([
            Animated.timing(opacity, {
              toValue: currentOpacity,
              duration: 5,
              useNativeDriver: true,
            }),
            Animated.timing(translateY, {
              toValue: currentOpacity,
              duration: 5,
              useNativeDriver: true,
            }),
          ]).start();
          isScrollingDownRef.current = false;
        }
        previousOffset.current = currentOffset;
      },
    }
  );

  const renderFooter = () => {        
    if (!isLoading ) return <View style={{ height: 0 }} />;
    if (isLoading && data.length) return <ActivityIndicator size="large" color="gray" />;
    return (
      <View style={styles.footer}>
        <ListLoading/>
      </View>
    );
  };

  const renderItem = ({ item, index }: { item: Collections, index: number }) => {
    const firstItem = data[index * 2];
    const secondItem = data[index * 2 + 1];
    if (!firstItem) return <View></View>;
    return (
      <View style={{ flexDirection: 'row', justifyContent: 'center', width: '100%', marginBottom: 16 }}>
        {firstItem && (
            <TouchableOpacity style={styles.card} onPress={() => getCollectionDetails(firstItem.id, creator_id)}>
              <View style={{ position: 'absolute', top: 5, right: -15 }}>
                <MenuProvider>
                  <MenuBar options={menuOptions} />
                </MenuProvider>
              </View>
              <View>
                <ImageBackground
                    source={{ uri: item.image_url }}
                    style={styles.imageBackground}
                    imageStyle={{ borderRadius: 10 }}
                  >
                  <BlurView intensity={80} style={styles.textContainer} tint="light">
                    <View>
                    <Text style={styles.title}>{firstItem.name}</Text>
                    <Text style={styles.total}>Total Products: {firstItem.total_products}</Text>
                    </View>
                  </BlurView>
                </ImageBackground>
              </View>
            </TouchableOpacity>
        )}
        {secondItem && (
          <TouchableOpacity style={styles.card} onPress={() => getCollectionDetails(secondItem.id, creator_id)}>
            <View style={{ position: 'absolute', top: 5, right: -15 }}>
            <MenuProvider>
              <MenuBar options={menuOptions} />
            </MenuProvider>
            </View>
            <View>
              <ImageBackground
                source={{ uri: item.image_url }}
                style={styles.imageBackground}
                imageStyle={{ borderRadius: 10 }}
              >
                <BlurView intensity={80} style={styles.textContainer} tint="light">
                  <View>
                  <Text style={styles.title}>{firstItem.name}</Text>
                    <Text style={styles.total}>Total Products: {firstItem.total_products}</Text>
                  </View>
                </BlurView>
              </ImageBackground>
            </View>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
        <View style={{ flex: 1 }}>
          <View style={{ marginTop: 10, flex: 1 }}>
            <Animated.View
              style={[
              styles.searchContainer,
              {
                opacity: opacity,
                transform: [{ translateY: translateY }],
              },
              ]}
            >
              <SearchBar
                style={styles.searchBar}
                placeholder="Search here"
                onPress={() => {}}
                onSearchPress={() => console.log("Search Icon is pressed")}
                onChangeText={(text) => console.log(text)}
                onClearPress={() => {}}
                textInputStyle={styles.textInput}
              />
            </Animated.View>
            <Animated.View style={{marginTop: marginTopAnim, flex: 1}}>
              <FlatList
                data={data}
                ref={flatListRef}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                scrollEventThrottle={16}  
                ListFooterComponent={renderFooter}
                onScroll={handleScroll}
                onEndReached={fetchMoreDataOnEndReached}
                numColumns={1}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ }}
              />
            </Animated.View>
          </View>
        </View>
        {selectedCollectionProducts?.length > 0 && modalVisible && (
          <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
            <TouchableOpacity style={styles.backdropTouchable} onPress={closeListOfProductDetails} />
            <Animated.View style={[styles.modalContent, { transform: [{ translateY: slideAnim }] }]}>
              <View style={{display: 'flex', alignSelf:'flex-end', marginEnd: 10, marginVertical: 10}}>
                <TouchableOpacity onPress={closeListOfProductDetails}>
                    <MaterialIcons name="cancel" size={30} color="lightgrey" />           
                </TouchableOpacity>
              </View>
              <View style={{ width: '100%', height: '100%' }}>
                {selectedCollectionProducts?.length ? 
                  <CollectionProductDetails 
                    products={selectedCollectionProducts} 
                    setModalVisible={setModalVisible} 
                    setSelectedCollectionProducts={setSelectedCollectionProducts}
                    setSelectedProduct={setSelectedProduct}
                    setModalVisibleProductDetail={setModalVisibleProductDetail}
                    openProductDetails={openProductDetails}
            />  : <></>
                }
              </View>
            </Animated.View>
          </Animated.View>          
        )}

        {selectedProduct && modalVisibleProductDetail && (
          <Animated.View style={[styles.backdrop, { opacity: fadeAnimProduct }]}>
            <TouchableOpacity style={styles.backdropTouchable} onPress={closeProductDetailsWithProductsList} />
            <Animated.View style={[styles.modalContent, { transform: [{ translateY: slideAnimProduct }] }]}>
              <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 10, alignItems:'center'}}>
                <View style={{marginStart: 10, marginTop: 10}}>
                  <TouchableOpacity style={{display: 'flex', flexDirection: 'row',}} onPress={closeProductDetails}>
                      <MaterialIcons style={{marginEnd: 5}} name="arrow-back" size={25} color="lightgrey" />
                      <Text style={{alignSelf: 'center'}}>Back to products</Text>        
                  </TouchableOpacity>
                </View>
                
                <View style={{marginEnd: 10, marginTop: 10}}>
                  <TouchableOpacity onPress={closeProductDetailsWithProductsList}>
                      <MaterialIcons name="cancel" size={25} color="lightgrey" />           
                  </TouchableOpacity>
                </View>
              </View>
              
              {selectedProduct ?
                <ProductDetails productDetails={selectedProduct}/> : <></>
              }
            </Animated.View>
          </Animated.View>
        )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
  total: {
    marginBottom: 5,
    textAlign: 'right',
  },
  footer: {
    padding: 10,
    alignItems: 'center',
  },
  textInput: {
    borderWidth: 0,
    elevation: 0,
    shadowOpacity: 0,
    padding: 0,
    margin: 0,
    paddingTop: 5,
    fontSize: 16,
  },
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
    backgroundColor: 'white',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    alignItems: 'center',
  },


  // Products list styles
  price: {
    marginTop: 'auto',
  },

  textContainer: {
    backgroundColor: 'lightgray',
    padding: 8,
    display: 'flex', 
    alignItems: 'flex-end', 
    overflow: 'hidden'
  },

  // search bar styles
  searchContainer: {
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: 1,
  },
  searchBar: {
    minHeight: 40,
    maxHeight: 60,
  },

    // Product image background
  imageBackground: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
});

export default CollectionsList;