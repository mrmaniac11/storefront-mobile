import React from 'react';
import { View } from 'react-native';
import HomeMain from './HomeMain';
import HomeTopbar from './HomeTopBar';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../types';

type HomeScreenRouteProp = RouteProp<RootStackParamList, 'Home'>;

interface Props {
  route: HomeScreenRouteProp;
}
const HomeScreen: React.FC<Props> = ({ route }) => {
  const { creator_id } = route.params || {};

  return (
    <View style={{ flex: 1, width: '100%', position: 'relative' }}>
      <View style={{ flex: 1, width: '100%'}}>
        <View style={{ flex: 1 }}>
            <HomeMain creator_id={creator_id}/>
        </View>
      </View>
    </View>
  )
}
export default HomeScreen;