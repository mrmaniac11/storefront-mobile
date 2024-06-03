import React from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';

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

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 10,
    marginTop: 10
  },
  loadingCard: {
    width: '47%',
    height: 250,
    borderRadius: 10,
    margin: 5,
    backgroundColor: 'gray', // Backup base color for card
    overflow: 'hidden',
  },
  shimmer: {
    width: '100%',
    height: '100%', // Ensure shimmer covers the entire card
    borderRadius: 10,
  },
});

export default ListLoading;
