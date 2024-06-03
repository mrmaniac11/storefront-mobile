// import * as React from 'react';
import React, { useState } from 'react';
import * as Linking from 'expo-linking';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme, TouchableOpacity, StyleSheet } from 'react-native';
import { NavigationContainer, DarkTheme, DefaultTheme, NavigationProp, LinkingOptions } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import { NavigationContainerRef } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Local imports
import { RootStackParamList } from './types';

// Local Layout imports
import TabSection from './(tabs)/_layout';
import NotFound from './+not-found';
import AddProducts from './pages/AddProductsMain';
import AddSingleProduct from './pages/AddSingleProduct';
import AddCollection from './pages/collection/AddCollection';
import Notification from './pages/Notification';
import Login from './(authentication)/login';
import SignUp from './(authentication)/signup';
import { NotificationProvider } from './components/notification/NotificationContext';
import { NotificationBanner } from './components/notification/NotificationBanner';

// Dont know what is the use of this below code...
export const isMountedRef = React.useRef<boolean>(false);
export const navigationRef = React.createRef<NavigationContainerRef<any>>();
export function navigate(name: string, params?: object) {
  if (isMountedRef.current && navigationRef.current) {
    navigationRef.current.navigate(name, params);
  }
}
SplashScreen.preventAutoHideAsync();

// Componenet starts here...
export default function RootLayout() {
  const scheme = useColorScheme();
  let MyTheme = scheme === 'dark' ? DarkTheme : DefaultTheme;
  MyTheme = DefaultTheme;
  const Stack = createNativeStackNavigator<RootStackParamList>();
  const [initialRoute, setInitialRoute] = useState<keyof RootStackParamList | null>(null);
  const linking: LinkingOptions<ReactNavigation.RootParamList> = {
    prefixes: ['https://myapp.com', 'myapp://'],
    config: {
      screens: {
        '(tabs)': {
          path: ':creator_id',
          screens: {
            Profile: {
              path: '/profile',
              screens: {
                Profile: '',
              },
            },
            Home: {
              path: '',
              screens: {
                Home: '/home',
                ProductDetails: '/products/:product_id',
              },
            },
            Collections: {
              path: '/collections',
              screens: {
                Collections: '',
                CollectionProducts: '/:collection_id',
              },
            },
          },
        },
        AddProducts: ':creator_id/add',
        AddSingleProduct: ':creator_id/add/product',
        AddCollection: ':creator_id/add/collection',
        Notification: ':creator_id/notifications',
        Login: 'login',
        SignUp: 'signup',
        '+not-found': '*',
      },
    },
  };

  React.useEffect(() => {
    const preventSplash = async () => {
      await SplashScreen.hideAsync();
    };

    preventSplash();

    const initialize = async () => {
      const url = await Linking.getInitialURL();
      if (url) {
        const parsedUrl = Linking.parse(url);
        if (parsedUrl.path === 'signup') {
          setInitialRoute('SignUp' as keyof RootStackParamList);
        } else if (parsedUrl.path === 'login') {
          setInitialRoute('Login' as keyof RootStackParamList);
        } else {
          setInitialRoute('(tabs)' as keyof RootStackParamList);
        }
      } else {
        setInitialRoute('(tabs)' as keyof RootStackParamList);
      }
    };
  
    initialize();
  }, []);

  if (!initialRoute) return null;

  return (
    <NotificationProvider>
      <NavigationContainer
        independent={true}
        theme={MyTheme}
        linking={linking}
        ref={navigationRef}
        onReady={() => {
          isMountedRef.current = true;
        }}
      >
        <Stack.Navigator initialRouteName={initialRoute}
          screenOptions={{
            headerStyle: {
              backgroundColor: '#ffffff',
            },
            headerTintColor: '#00000',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen name="(tabs)"
              options={{ headerShown: false }}
              component={({ navigation, route }: NativeStackScreenProps<RootStackParamList, '(tabs)'>) => (
                <TabSection
                  navigation={navigation}
                  route={{ ...route, params: { creator_id: 'the.praveen' } }}
                />
              )}
          />
          <Stack.Screen name="AddProducts" 
              component={AddProducts} 
              initialParams={{ creator_id: 'the.praveen' }}
              options={({ navigation }: { navigation: NavigationProp<RootStackParamList> }) => ({
                title: 'Add Products',
                headerBackTitle: 'Back',
                headerBackTitleVisible: true,
                headerLeft: () => (
                  <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.navigate('(tabs)', { creator_id: 'the.praveen' })}
                    >
                    <Ionicons name="chevron-back" size={24} color="black" />
                  </TouchableOpacity>
                ),
            })}
          />
          <Stack.Screen name="AddSingleProduct" 
              component={AddSingleProduct} 
              initialParams={{ creator_id: 'the.praveen' }}
              options={({ navigation }: { navigation: NavigationProp<RootStackParamList> }) => ({
                title: 'Add Single Product',
                headerBackTitle: 'Back',
                headerBackTitleVisible: true,
                style: {
                  display: 'flex',
                  alignItems: 'center',
                },
                headerLeft: () => (
                  <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.navigate('AddProducts', { creator_id: 'the.praveen' })}
                    >
                    <Ionicons name="chevron-back" size={24} color="black" />
                  </TouchableOpacity>
                ),
            })}
          />
          <Stack.Screen name="AddCollection" 
              component={AddCollection} 
              initialParams={{ creator_id: 'the.praveen' }}
              options={({ navigation }: { navigation: NavigationProp<RootStackParamList> }) => ({
                title: 'Create a collection',
                headerBackTitle: 'Back',
                headerBackTitleVisible: true,
                headerLeft: () => (
                  <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.navigate('AddProducts', { creator_id: 'the.praveen' })}
                    >
                    <Ionicons name="chevron-back" size={24} color="black" />
                  </TouchableOpacity>
                ),
            })}
          />

          <Stack.Screen name="Notification" 
            component={Notification} 
            initialParams={{ creator_id: 'the.praveen' }}
            options={({ navigation }: { navigation: NavigationProp<RootStackParamList> }) => ({
              title: 'Notification',
              headerBackTitle: 'Back',
              headerBackTitleVisible: true,
              headerLeft: () => (
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => navigation.navigate('(tabs)', { creator_id: 'the.praveen' })}
                  >
                  <Ionicons name="chevron-back" size={24} color="black" />
                </TouchableOpacity>
              ),
            })}
          />

          {/* LOGIN STACK */}
          <Stack.Screen name="Login" 
            component={Login} 
            options={() => ({
              headerShown: false
            })}
          />

          <Stack.Screen  name="SignUp" 
            component={SignUp} 
            options={() => ({
              headerShown: false
            })}
          />
          <Stack.Screen name="+not-found" component={NotFound} />
        </Stack.Navigator>
      </NavigationContainer>
      <NotificationBanner />
    </NotificationProvider>
  );
}

const styles = StyleSheet.create({
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 16
  },
  backText: {
    fontSize: 16,
    color: 'black',
    marginLeft: 5,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 56,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  emptyView: {
    width: 24,
  },
});
