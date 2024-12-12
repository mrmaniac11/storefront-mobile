import React from 'react';
import { Text, View } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../types';
import CollectionsList from './CollectionsList';
import HomeTopbar from '../(Home)/HomeTopBar';

type searchScreenRouteProp = RouteProp<RootStackParamList, 'Collections'>;
interface Props {
  route: searchScreenRouteProp;
}

const SearchScreen: React.FC<Props> = ({ route }) => {
  const { creator_id } = route.params || {};
  return (
    <View style ={{ flex: 1}}>
      <HomeTopbar header='LinkFit' creator_id={creator_id}  />
      <CollectionsList creator_id={creator_id}/>
    </View>
  );
}

export default SearchScreen;