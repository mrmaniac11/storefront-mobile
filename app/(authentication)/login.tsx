import React, { useEffect, useState, useCallback } from 'react';
import { View, SafeAreaView, TextInput, TouchableOpacity, Text } from 'react-native';
import styles from './authentication_css';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types'; // Adjust the import path as necessary
import { useFocusEffect } from '@react-navigation/native';
import networkService from '../network/store';
import secureStore from '../network/handle_authentication';

type LoginProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
  route: RouteProp<RootStackParamList, 'Login'>;
};

const LoginAuthentication: React.FC<LoginProps> = ({ navigation, route }) => {
  const MODULES = ['login', 'forgot_password', 'create_new_password'] as const;

  type FormDataType = {
    email: string;
    password: string;
    type: typeof MODULES[number];
    typeFormatted: string;
    newPassword: string;
    confirmPassword: string;
    forgotPasswordOTP: string;
  };

  const [formData, setFormData] = useState<FormDataType>({
    email: '',
    password: '',
    type: 'login',
    typeFormatted: 'Login',
    newPassword: '',
    confirmPassword: '',
    forgotPasswordOTP: '',
  });

  const [timer, setTimer] = useState(60); // Timer state
  const [isTimerActive, setIsTimerActive] = useState(false); // Timer activity state
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsTimerActive(false); // Stop timer when it hits 0
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timer]);

  const startTimer = () => {
    setTimer(60);
    setIsTimerActive(true);
  };

  const resendOTP = () => {
    startTimer();
    getOTPForForgotPassword();
  };


  const updateFormData = (key: keyof FormDataType, value: string) => {
    setFormData((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  useEffect(() => {
    if (route.params?.email) {
      updateFormData('email', route.params.email);
    }
  }, [route.params?.email]);

  useFocusEffect(
    useCallback(() => {
      updateFormData('typeFormatted', 'Login');
      updateFormData('type', 'login');
    }, [])
  );

  const performLogin = async () => {
    console.log()
    // Login logic here
    await networkService.post('/login', { email: formData.email, password: formData.password }).then( async(response) => {
      let JWT = response.data.jwt;
      let header1 = response.headers['X-LINKFIT-USER']; 
      await secureStore.saveAuthToken(JWT);
      await secureStore.saveCustomHeader('linkfit_user_header', header1);
    }).catch ( async(errorObj) => {
      await secureStore.saveAuthToken('JWT');
      await secureStore.saveCustomHeader('linkfit_user_header', 'header1');
      console.log('catch occurs')
    }).finally(() => {
      console.log('finally block executed');
    });
  };

  const getOTPForForgotPassword = async () => {
    navigateToCreateNewPasswordPage();
  };

  const performAction = () => {
    if (formData.type === 'login') {
      performLogin();
    } else if (formData.type === 'forgot_password') {
      getOTPForForgotPassword();
    }
  };

  const navigateToSignUp = () => {
    navigation.navigate('SignUp', { email: formData.email });
  };

  const navigateToForgotPasswordPage = () => {
    updateFormData('typeFormatted', 'Forgot Password');
    updateFormData('type', 'forgot_password');
  };

  const navigateToLoginPage = () => {
    updateFormData('typeFormatted', 'Login');
    updateFormData('type', 'login');
  };

  const navigateToCreateNewPasswordPage = () => {
    updateFormData('typeFormatted', 'Create New Password');
    updateFormData('type', 'create_new_password');
  };

  const isLoginPassWordActive = formData.type === 'login';
  const isForgotPasswordActive = formData.type === 'forgot_password';
  const isForgoisCreatePasswordActivePasswordActive = formData.type === 'create_new_password';

  const canShowEmail = isLoginPassWordActive || isForgotPasswordActive;
  const canShowPassword = isLoginPassWordActive;
  const canShowCreateNewPassword = isForgoisCreatePasswordActivePasswordActive;
  const [primaryButton, setPrimaryButton] = useState({ label: '', canShow: false });


  const getPrimaryButtonLabel = () => {
    const { email, password, newPassword, confirmPassword, forgotPasswordOTP, type } = formData;

    if (type === 'login') {
      return {
        label: 'Login',
        canShow: !!(email && password), // Show only if both email and password have values
      };
    }

    if (type === 'forgot_password') {
      return {
        label: 'Send OTP',
        canShow: !!email, // Show only if email has a value
      };
    }

    if (type === 'create_new_password') {
      return {
        label: 'Update Password',
        canShow: !!(newPassword && confirmPassword && forgotPasswordOTP && forgotPasswordOTP.length === 6), // Show only if all fields have values
      };
    }

    return { label: '', canShow: false };
  };

  useEffect(() => {
    console.log(getPrimaryButtonLabel());
    setPrimaryButton(getPrimaryButtonLabel());
  }, [formData]);


  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 26, fontWeight: 'bold', alignSelf: 'center' }}>likfit</Text>
        <View style={styles.inputFieldsContainer}>
          <Text style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 10 }}>{formData.typeFormatted}</Text>

          {formData.type === 'forgot_password' && (
            <Text>Please {formData.email ? 'check' : 'enter'} your email to receive an OTP.</Text>
          )}

          {canShowEmail && (
            <SafeAreaView>
              <TextInput
                style={styles.input}
                onChangeText={(value) => updateFormData('email', value)}
                value={formData.email}
                placeholder={formData.type === 'login' ? 'Email / Username' : 'Email'}
                keyboardType="default"
                placeholderTextColor="gray"
              />
            </SafeAreaView>
          )}

          {canShowPassword && (
            <SafeAreaView>
              <TextInput
                style={styles.input}
                onChangeText={(value) => updateFormData('password', value)}
                value={formData.password}
                placeholder="Password"
                keyboardType="default"
                placeholderTextColor="gray"
              />
            </SafeAreaView>
          )}

          {canShowCreateNewPassword && (
            <>
              <SafeAreaView>
                <TextInput
                  style={styles.input}
                  onChangeText={(value) => updateFormData('newPassword', value)}
                  value={formData.newPassword}
                  placeholder="New Password"
                  keyboardType="default"
                  placeholderTextColor="gray"
                />
              </SafeAreaView>

              <SafeAreaView>
                <TextInput
                  style={styles.input}
                  onChangeText={(value) => updateFormData('confirmPassword', value)}
                  value={formData.confirmPassword}
                  placeholder="Confirm New Password"
                  keyboardType="default"
                  placeholderTextColor="gray"
                />
              </SafeAreaView>

              <SafeAreaView>
                <TextInput
                  style={styles.input}
                  onChangeText={(value) => updateFormData('forgotPasswordOTP', value)}
                  value={formData.forgotPasswordOTP}
                  placeholder="OTP"
                  keyboardType="default"
                  placeholderTextColor="gray"
                />
              </SafeAreaView>
              
            </>
          )}

          <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 15, marginVertical: 10}}>
            { isLoginPassWordActive &&
              <>
                <TouchableOpacity onPress={navigateToSignUp}>
                  <Text style={{ color: 'gray' }}>Sign Up</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={navigateToForgotPasswordPage}>
                  <Text style={{ color: 'gray' }}>Forgot Password?</Text>
                </TouchableOpacity>
              </>
            }
            { (canShowCreateNewPassword || isForgotPasswordActive) && 
              <TouchableOpacity onPress={navigateToLoginPage}>
                <Text style={{ color: 'gray' }}>Log In</Text>
              </TouchableOpacity>
            }
            { canShowCreateNewPassword && 
              <View style={{ alignItems: 'flex-end' }}>
                {isTimerActive ? (
                  <Text>Resend OTP in {timer} seconds</Text>
                ) : (
                  <TouchableOpacity onPress={resendOTP}>
                    <Text style={{ color: 'blue' }}>Resend OTP</Text>
                  </TouchableOpacity>
                )}
              </View>
            }
          </View>
        </View>
        <View style={styles.loginContainer}>
          <TouchableOpacity style={!primaryButton.canShow ? styles.primaryButtonDisabled: styles.loginButton} onPress={performAction} disabled={!primaryButton.canShow}>
            <Text style={styles.loginText}>{primaryButton.label}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default LoginAuthentication;
