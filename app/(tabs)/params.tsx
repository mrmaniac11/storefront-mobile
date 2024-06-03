import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

type TabsParamsList = {
  '(tabs)': {
    name?: string;
  };
};

type TabsNavigationProp = StackNavigationProp<TabsParamsList, '(tabs)'>;
type TabsRouteProp = RouteProp<TabsParamsList, '(tabs)'>;


export default interface ProfileProps {
  navigation: TabsNavigationProp;
  route: TabsRouteProp;
}