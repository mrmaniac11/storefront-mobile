import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator, TouchableOpacity, Animated, Easing, ImageBackground, FlatList, } from 'react-native';
import SearchBar from "react-native-dynamic-search-bar";
import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons'; 


// component imports
import HomeTopbar from './HomeTopBar';
import ProductDetails from '../Products/ProductDetails';
import networkService from '@/app/network/store';
import ListLoading from '@/app/components/ListLoading';
import { MenuProvider } from '../../components/MenuContext';
import MenuBar from '../../components/MenuBar';

const screenHeight = Dimensions.get('window').height;

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

interface HomeMainPageParams {
  creator_id: string;
}

interface Category {
  id: number;
  title: string;
  is_selected?: boolean;
}
interface Item {
  id: string;
  title: string;
  price: number;
  image_url: string;
  affiliate_url: string;
}
const HomeMain: React.FC<HomeMainPageParams> = (props) => {
  const PRODUCTS_LIST_PER_PAGE = 30;

  const [data, setData] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMorePage, setHasMorePage] = useState<boolean>(true);
  const [selectedProduct, setSelectedProduct] = useState<Item|null>(null);
  const [activeCategoryId, setActiveCategoryId ] = useState<number|null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>('');

  const fadeAnim = useRef(new Animated.Value(screenHeight)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const doesScrollHappend = useRef(false);
  const pageRef = useRef(0);
  const flatListRef = useRef<FlatList>(null);

  // Mock data for testing
  const mockDataStore: Item[] = [];
  const globalIndex = 1001;
  const generateMockData = (count: number) => {
    const mockData: Item[] = [];

    for (let i = 0; i < count; i++) {
      mockData.push({
        id: (globalIndex + i).toString(),
        title: `Product ${globalIndex + i}`,
        price: parseFloat((Math.random() * 100).toFixed(2)),
        image_url: `https://example.com/product${globalIndex + i}.jpg`,
        affiliate_url: `https://example.com/product${globalIndex + i}`,
      });
    }
    return mockData;
  };
  const getMockData = () => {
    let page = pageRef.current;
    const pageSize = PRODUCTS_LIST_PER_PAGE;
    const requiredDataCount = page * pageSize + PRODUCTS_LIST_PER_PAGE;
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
  const fetchProductMockData = async () => {
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

  // Actions
  const handleDelete = () => {
    // Implement delete functionality here
  };
  const handleMarkAsInactive = () => {
    // Implement mark as inactive functionality here
  };
  const categorySelected = (id: number) => {
    setActiveCategoryId(id);
  };
  const clearFilterCriteria = () => {
    setActiveCategoryId(null);
  };
  const menuOptions = [
    { displayName: 'Delete', callback: handleDelete },
    { displayName: 'Mark as inactive', callback: handleMarkAsInactive }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  // Model operations
  const openProductDetails = (product: Item) => {
    setModalVisible(true);
    setSelectedProduct(product);
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
  const closeProductDetails = () => {
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
      setSelectedProduct(null);
    });
  };

  // Network call to fetch data
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await networkService.get('/products', {
        start_index: pageRef ? pageRef.current * PRODUCTS_LIST_PER_PAGE : 0,
        limit: PRODUCTS_LIST_PER_PAGE,
      });
      const products = response.data.products || [];
      const hasMorePage = response.data.pagination?.has_more_page || false;
      setData(prevData => [...prevData, ...products]);
      setHasMorePage(hasMorePage);
      pageRef.current = pageRef.current + 1
    } catch (error) {
      console.error("Error fetching data:", error);
      await fetchProductMockData();
      pageRef.current = pageRef.current + 1
    } finally {
      setIsLoading(false);
    }
  };
  const fetchMoreDataOnEndReached = () => {
    if (doesScrollHappend.current && !isLoading && hasMorePage) {
      fetchData();
    }
  }

  // Components
  const renderHorizontalScrollItem = ({ item }: { item: Category }) => (
    <TouchableOpacity onPress={() => categorySelected(item.id)}>
      <View style={[styles.categoryCard, item.id === activeCategoryId && styles.activeCategory]}>
        <Text style={[item.id === activeCategoryId && { color: 'white' }, { marginRight: 10 }]}>
          {item?.title}
        </Text>

        {item.id === activeCategoryId && (
          <TouchableOpacity
            onPress={clearFilterCriteria} // Replace with your close logic
            style={styles.closeButton}
          >
            <Ionicons name="close" size={screenHeight * 0.02} color="white" />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
  const renderFooter = () => {
    if (!isLoading ) return <View style={{ height: 0 }} />;
    if (isLoading && data.length) return <ActivityIndicator size="large" color="gray" />;
    return (
      <View>
        <ListLoading />
      </View>
    );
  };
  const renderItem = ({ item }: { item: Item }) => {
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => openProductDetails(item)}
      >
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
              <View style={{}}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.price}>${item.price}</Text>
              </View>
            </BlurView>
          </ImageBackground>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <HomeTopbar header='LinkFit' creator_id={props.creator_id} />
      <SearchBar
        style={styles.searchBar}
        placeholder="Search your products"
        placeholderTextColor="gray" // Add this line to change placeholder style
        onPress={() => { }}
        onSearchPress={() => console.log("Search Icon is pressed")}
        onChangeText={setSearchText}
        onClearPress={() => { }}
        textInputStyle={[
          styles.textInput,
          !searchText ? { fontStyle: 'italic' } : {}
        ]}
      />
      <FlatList
        data={data}
        ref={flatListRef} // Pass the reference to the FlatList
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        onScroll={() => doesScrollHappend.current = true}
        onEndReached={fetchMoreDataOnEndReached}
        ListHeaderComponent={
          <View style={styles.filterSection}>
            <FlatList
              data={preDefinedCategoriesData}
              renderItem={renderHorizontalScrollItem}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            />
          </View>
        }
        ListFooterComponent={renderFooter}
        numColumns={2}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      />

      {/* Modal for Product Details */}
      {modalVisible && selectedProduct && (
        <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
          <TouchableOpacity style={styles.backdropTouchable} onPress={closeProductDetails} />
          <Animated.View style={[styles.modalContent, { transform: [{ translateY: slideAnim }] }]}>
            <View style={{ display: 'flex', alignSelf: 'flex-end', marginEnd: 10, marginTop: 10 }}>
              <TouchableOpacity onPress={closeProductDetails}>
                <MaterialIcons name="cancel" size={30} color="lightgrey" />
              </TouchableOpacity>
            </View>
            <ProductDetails productDetails={selectedProduct} />
          </Animated.View>
        </Animated.View>
      )}
    </View>
  );
};

let cardHeight = screenHeight * 0.3
if (screenHeight > 800) {
  cardHeight = screenHeight * 0.27
}

let horizontalCardHeight = screenHeight * 0.045;
if (screenHeight > 800) {
  horizontalCardHeight = screenHeight * 0.038
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterSection: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  filterText: {
    fontStyle: 'italic',
    fontSize: 14,
    fontWeight: '500',
    color: 'black'
  },
  card: {
    flex: 1,
    display: 'flex',
    justifyContent: 'flex-end',
    width: '47%',
    height: cardHeight,
    borderRadius: 10,
    margin: 5,
    backgroundColor: '#ccc',
    borderColor: 'lightgrey',
    borderWidth: 0.05,
    overflow: 'hidden',
    marginVertical: 10,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  price: {
    marginTop: 'auto',
    textAlign: 'right'
  },
  searchBar: {
    marginBottom: 10,
    height: 36
  },
  textInput: {
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Optional: semi-transparent background
    borderRadius: 12,
    padding: 4,
  },
  modelContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    alignSelf: 'center',
  },

  productImage: {
    flex: 1,
    maxHeight: screenHeight * 0.5,
    width: '100%',
    alignSelf: 'center',
    backgroundColor: 'grey',
    position: 'relative',
    borderRadius: 20
  },
  optionContainer: {
    position: 'absolute',
    width: 70,
    height: 70,
    backgroundColor: 'white',
    justifyContent: 'center',
    borderRadius: 35,
    right: 10,
    bottom: -30
  },
  options: {
    alignSelf: 'center',
    width: 48,
    height: 48,
    backgroundColor: 'grey',
    borderRadius: 24
  },

  categoryCard: {
    display: 'flex',
    flexDirection: 'row',
    paddingStart: 15,
    paddingEnd: 5,
    height: horizontalCardHeight,
    borderRadius: 15,
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5
  },
  activeCategory: {
    backgroundColor: 'rgb(87, 86, 86)',
    borderWidth: 0,
  },

  categoryFooter: {
    marginTop: '20%',
    padding: 10,
    alignItems: 'center',
  },
  infoIcon: {
    marginRight: 20,
  },


  // Product image background
  imageBackground: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  textContainer: {
    backgroundColor: 'lightgray',
    padding: 8,
    alignItems: 'flex-end'
  },
});

export default HomeMain;
