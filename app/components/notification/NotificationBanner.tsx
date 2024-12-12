import React from 'react';
import { Text, StyleSheet, Animated, Dimensions, Easing } from 'react-native';
import { useNotification } from './NotificationContext';

const screenWidth = Dimensions.get('window').width;

export const NotificationBanner = () => {
  const { notification } = useNotification();
  const [slideAnim] = React.useState(new Animated.Value(screenWidth)); // Start off-screen

  React.useEffect(() => {
    if (notification) {
      // Slide in
      Animated.timing(slideAnim, {
        toValue: 0, // Fully visible
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start(() => {
        // Wait 3 seconds, then slide out
        setTimeout(() => {
          Animated.timing(slideAnim, {
            toValue: screenWidth, // Slide out smoothly
            duration: 300,
            easing: Easing.in(Easing.ease),
            useNativeDriver: true,
          }).start();
        }, 3000);
      });
    }
  }, [notification, slideAnim]);

  if (!notification) return null;

  let bgClass= styles.infoBg;
  if (notification.type === 'success') {
    bgClass = styles.successBg;
  } else if (notification.type === 'error') {
    bgClass = styles.errorBg;
  }
  return (
    <Animated.View style={[styles.banner, bgClass, { transform: [{ translateX: slideAnim }] }]}>
      <Text style={styles.message}>{notification.message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    top: 0,
    width: '100%',
    padding: 16,
    zIndex: 1000,
    height: 60,
    justifyContent: 'center',
  },
  message: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  successBg: {
    backgroundColor: 'green'
  },
  errorBg: {
    backgroundColor: 'red'
  },
  infoBg: {
    backgroundColor: 'yellow'
  }
});
