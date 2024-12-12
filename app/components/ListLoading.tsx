import React from 'react';
import { FlatList, View, StyleSheet, Dimensions } from 'react-native';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';

const screenHeight = Dimensions.get('window').height;

const ListLoading = () => {
  const n = 30; // Number of loading cards
  const components = Array.from({ length: n }, (_, index) => index + 1);

  return (
    <FlatList
      data={components}
      numColumns={2} // Display two columns
      keyExtractor={(item) => item.toString()}
      renderItem={() => (
        <View style={styles.loadingCard}>
          <ShimmerPlaceHolder
            style={styles.shimmer}
            shimmerColors={['#e0e0e0', '#f7f7f7', '#e0e0e0']} // Brighter shine effect
            shimmerStyle={{ backgroundColor: '#ccc' }} // Base background during shimmer
            visible={false} // Keep shimmer running
            duration={1500} // Slower duration for more noticeable shine
          />
        </View>
      )}
      contentContainerStyle={styles.listContainer}
    />
  );
};

let cardHeight = screenHeight * 0.3
if (screenHeight > 800) {
  cardHeight = screenHeight * 0.27
}

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 10,
    marginTop: 10
  },
  loadingCard: {
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
  shimmer: {
    width: '100%',
    height: '100%', // Ensure shimmer covers the entire card
    borderRadius: 10,
  },
});

export default ListLoading;
