import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, TouchableOpacity } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons'; // Assuming you're using Expo

import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import Collections from '../(Collections)/_layout';


import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

interface HomeMainProps {
  header: string;
  creator_id: string;
  isCustomNavigation?: boolean;
  backButtonFunction?: Function
}

const HomeTopbar: React.FC<HomeMainProps> = ({ header, creator_id, backButtonFunction = () => {},  isCustomNavigation = false }) => {

  type NavigationProps = NativeStackNavigationProp<RootStackParamList>;
  const navigation = useNavigation<NavigationProps>();

  if (!isCustomNavigation)
  {
    backButtonFunction = (creator_id: string) => {
      navigation.goBack();
    }
  }
  const navigateToAddProductsList = (creator_id: string) => {
    navigation.navigate('AddProducts', { creator_id });
  }

  const navigateToNotifiation = (creator_id: string) => {
    navigation.navigate('Notification', { creator_id });
  }

  return (
    <View style={styles.container}>
      <View style={{display: 'flex', flexDirection: 'row'}}>
        {isCustomNavigation ? 
          <TouchableOpacity
              style={styles.backButton}
              onPress={() => {backButtonFunction(creator_id)}}
              >
            <Ionicons name="arrow-back-sharp" size={24} color="black" />
            <Text style={styles.backText}></Text>
          </TouchableOpacity>
          : 
          <></>
        }
        <Text style={styles.headerText}>{header}</Text>
      </View>
      <View style={styles.headerIconsContainer}>
        <View style={{ marginEnd : 10 }}>
          <MaterialCommunityIcons 
              name="bell" 
              size={22} 
              onPress={() => navigateToNotifiation(creator_id)}
            />
        </View>
          <MaterialCommunityIcons 
            name="plus" 
            size={26}
            onPress={() => navigateToAddProductsList(creator_id)}
          />        
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 15,
    paddingLeft: 10,
    paddingRight: 10,
    height: 60
  },
  headerIconsContainer: {
    marginRight: 13,
    display: 'flex',
    flexDirection: 'row'
  },
  headerText: {
    color: '#34AE57',
    fontSize: 22,
    fontWeight: '900',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    fontSize: 16,
    color: 'black',
    marginLeft: 5,
  },
});

export default HomeTopbar;
