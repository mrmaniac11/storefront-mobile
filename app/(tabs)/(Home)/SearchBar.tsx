import React, { useState, useRef, useEffect } from 'react';
import {SafeAreaView, StyleSheet, TextInput} from 'react-native';
import { Dimensions } from 'react-native';

interface searchBarProps {
  needFilterOptions: boolean
}
const SearchBar: React.FC<searchBarProps> = ({
  needFilterOptions
}) => {
  const [searchText, onChangesearchText ] = React.useState('');

  return (
    <>
      <SafeAreaView>
        <TextInput
          style={styles.input}
          onChangeText={onChangesearchText}
          value={searchText}
          placeholder="Type to search"
        />
      </SafeAreaView>
    </>
  )
};

const screenWidth = Dimensions.get('window').width;
const widthPercentageSearch = screenWidth * 0.5 // 60% of screen width

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  input: {
    width: widthPercentageSearch,
    height: 40,
    borderWidth: 1,
    padding: 10,
    borderColor: 'grey',
    borderRadius: 10,
    position: 'relative',
    zIndex: 1
  },
});

export default SearchBar