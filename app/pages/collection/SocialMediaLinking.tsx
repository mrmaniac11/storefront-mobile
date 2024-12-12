import React from 'react';
import { View, Text, TouchableOpacity, Dimensions, StyleSheet, Image } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;


type Product = {
  id: number;
  url: string;
  selectedTags: Array<String>
};

interface SocialMediaLinkingProps{
  setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
}

const saveCollectionWithSocialMedia = () => {

}

const SocialMediaLinking: React.FC<SocialMediaLinkingProps> = ({setCurrentPage}) => {
  const openRecordsInSocialMedia = (socialMedia: string) => {
    setCurrentPage('social_media_records');
  } 

  return (
    <View style={styles.container}>
      <View style={styles.bodyContainer}>
        <View>
            <TouchableOpacity
            style={styles.card}
            onPress={() => openRecordsInSocialMedia('instagram')} // Navigate to the target page when clicked
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image source={require('../../Images/Instagram_icon.png.webp')} style={{ width: 45, height: 45, marginRight: 10 }} />
                <Text style={styles.cardTitle}>Instagram</Text>
              </View>
            </TouchableOpacity>
        </View>
      </View>
      <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 7, paddingHorizontal: 5, marginBottom: 10, marginHorizontal: 10}}>
        <TouchableOpacity style={{backgroundColor: '#34AE57', width: '100%', borderRadius: 10, paddingTop: 10, paddingBottom: 10}} onPress={() => saveCollectionWithSocialMedia()}>
          <Text style={{textAlign: 'center', fontSize: 16, color: 'white', paddingVertical: 5}}>Proceed</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bodyContainer: {
    flex: 1,
    alignItems: 'center',
  },
  card: {
    width: screenWidth * 0.8,
    height: screenHeight * 0.1,
    backgroundColor: 'white',
    borderRadius: 10,
    marginVertical: 10,
    // Add box shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // Add elevation for Android
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SocialMediaLinking;