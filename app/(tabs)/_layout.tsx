import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import { NavigationProp } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import HomeScreen from './(Home)/_layout';
import Profile from './(Profile)/_layout';
import Collections from './(Collections)/_layout';
import { RootStackParamList } from '../types';
import { Ionicons } from '@expo/vector-icons';


const Tab = createBottomTabNavigator<RootStackParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

function HomeStack({ route }: NativeStackScreenProps<RootStackParamList, 'Home'>) {
  const creator_id = route.params?.creator_id; // Extract creator_id
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        initialParams={{ creator_id }}
      />
    </Stack.Navigator>
  );
}

function collectionStack({ route }: NativeStackScreenProps<RootStackParamList, 'Collections'>) {
  const creator_id = route.params?.creator_id;
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="Collections"
        component={Collections}
        initialParams={{ creator_id }}
      />
    </Stack.Navigator>
  );
}

function profileStack({ route }: NativeStackScreenProps<RootStackParamList, 'Profile'>) {
  const creator_id = route.params?.creator_id;
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Profile"
        component={Profile}
        initialParams={{ creator_id }}
        options={({ navigation }: { navigation: NavigationProp<RootStackParamList> }) => ({
          title: 'Edit Profile',
          headerBackTitle: 'Back',
          headerBackTitleVisible: true,
          headerLeft: () => (
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.navigate('Home', { creator_id: 'the.praveen' })}
              >
              <Ionicons name="chevron-back" size={24} color="black" />
            </TouchableOpacity>
          ),
        })}
      />
    </Stack.Navigator>
  );
}

function TabSection({ route }: NativeStackScreenProps<RootStackParamList, '(tabs)'>) {
  const creator_id = route.params?.creator_id; 

  if (!creator_id) {
    throw new Error("creator_id is required");
  }

  return (
    <View style={styles.container}>
      <Tab.Navigator
        initialRouteName='Home'
        screenOptions={{
          tabBarShowLabel: false,
          headerShown: false,
          tabBarActiveTintColor: '#34AE57',
          tabBarInactiveTintColor: 'black',
          tabBarStyle: {
            backgroundColor: 'white',
            height: '6%',
          },
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeStack}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="home" color={color} size={size} />
            ),
          }}
          initialParams={{ creator_id }}
        />
        <Tab.Screen
          name="Collections"
          component={collectionStack}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="group" color={color} size={size} />
            ),
          }}
          initialParams={{ creator_id }}
        />
        <Tab.Screen
          name="Profile"
          component={profileStack}
          initialParams={{ creator_id }}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="account" color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    flexDirection: 'row',
    marginLeft: 10,
    marginRight: 16
  },
  backText: {
    fontSize: 16,
    color: 'black',
    marginLeft: 5,
  },
});

export default TabSection;