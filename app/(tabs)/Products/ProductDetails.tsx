import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../types';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height; // Get screen height for vertical animation

type HomeScreenRouteProp = RouteProp<RootStackParamList, 'ProductDetails'>;
interface Props {
  route: HomeScreenRouteProp;
}

interface Item {
  id: string;
  title: string;
  price: number;
  image_url: string;
  affiliate_url: string;
}

interface productDeailsProps {
  productDetails: Item
}

const ProductDetails: React.FC<productDeailsProps> = ({}) => {
  return (
    <View style={{flex: 1, width: '80%', borderRadius: 20}}>
      <View style={styles.modelContainer}>
        <View style={styles.productImage}>
          {/* <View style={styles.optionContainer}>
              <View style={styles.options}>
              
              </View>
          </View> */}
        </View>
        <View style={{width: '100%'}}>
          <View >
            <Text style={styles.date}>28-Aug-2024</Text>
          </View>
          
          <View style={styles.descriptionContainer}>
            <View style={styles.brandLogoContainer}>
              <View style={styles.brandLogo}>
                
              </View>
            </View>
            <View style={styles.descriptionContentContainer}>
              <Text style={styles.description} numberOfLines={1}>
                RoastedOver shirt t-shirt for men
              </Text>
              <Text>Myntra</Text>
            </View>
            <View style={styles.rateContainer}>
              <Text style={styles.rate}>$699.99</Text>
            </View>
          </View>
          <View style={styles.additionalInforamtion}>
            <View style={styles.additionalInforamtionSection}>
              <View style={styles.additionalInforamtionCard}>
                <Text style={styles.additionalInforamtionText}>3.5</Text>
              </View>
              <Text style={styles.additionalInforamtionTitle}>
                Affiliate
              </Text>
            </View>
            
            <View style={styles.additionalInforamtionSection}>
              <Text style={[styles.additionalInforamtionTitle, { marginTop: 'auto'} ]}>
                Earned amount
              </Text>
              <Text style={[styles.additionalInforamtionText, { margin: 'auto', fontSize: 16, fontWeight: 700}]}>244883</Text>
              
            </View>

            <View style={styles.additionalInforamtionSection}>
              <View style={styles.additionalInforamtionCard}>
                <Text style={styles.additionalInforamtionText}>6.7</Text>
              </View>
              <Text style={styles.additionalInforamtionTitle}>
                Total Unit
              </Text>
            </View>
          </View>
          <View style={styles.impressionContainer}>
          </View>
        </View>
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
  modelContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    alignSelf: 'center',
  },
  productImage: {
    flex: 1,
    minHeight: screenHeight * 0.25,
    maxHeight: screenHeight * 0.5,
    width: '100%',
    alignSelf: 'center',
    backgroundColor: 'grey',
    position: 'relative',
    borderRadius: 20
  },
  date: {
    alignSelf: 'auto',
    marginTop: 6,
    marginLeft: 10,
    fontSize: 11,
    color: 'grey'
  },

  // Description container: ensure all elements are stacked in a column
  descriptionContainer: {
    flexDirection: 'row', // Ensure column layout
    justifyContent: 'space-around', // Space out the elements
    alignItems: 'center', // Align to the start (left)
    marginTop: 20,
    paddingTop: 10,

  },

  // Adjust brand logo container to stack vertically
  brandLogoContainer: {
    width: '10%', // Take up full width to avoid side-by-side layout
    alignItems: 'flex-start', // Align logo to the left
    marginBottom: 10, // Space between logo and next item
  },
  brandLogo: {
    height: 34,
    width: 34,
    borderRadius: 17,
    backgroundColor: 'grey',

  },

  // Ensure the description content stacks below the logo
  descriptionContentContainer: {
    width: '70%', // Take up full width
    marginBottom: 10, // Space between description and rate
    paddingHorizontal: 10,
  },
  description: {
    fontWeight: 800
  },

  rateContainer: {
    width: '20%',
    alignItems: 'flex-start'
  },
  // The rate should also stack below other elements
  rate: {
    fontWeight: '900',
    fontSize: 15,
  },
  additionalInforamtion: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 20,
    width: '100%'
  },
  additionalInforamtionCard: {
    height: 50,
    width: 50,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: 'grey',
    justifyContent: 'center',
    alignItems: 'center'
  },
  additionalInforamtionTitle: {
    paddingTop: 10
  },
  additionalInforamtionSection: {
    flexDirection: 'column',
    alignItems: 'center'
  },
  additionalInforamtionText: {

  },
  impressionContainer: {
    alignSelf: 'center',
    marginTop: screenWidth * 0.05,
    height: screenWidth * 0.1,
    width: screenWidth * 0.7,
    backgroundColor: 'lightgrey',
    borderRadius: 5
  },
});

export default ProductDetails;