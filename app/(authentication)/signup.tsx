import React, { useState, useEffect } from 'react';
import { View, SafeAreaView, TextInput, TouchableOpacity, Text } from 'react-native';
import styles from './authentication_css'
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types'; // Adjust the import path as necessary
import { OtpInput } from "react-native-otp-entry";


type signUpProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'SignUp'>;
  route: RouteProp<RootStackParamList, 'SignUp'>;
};

const signUpAuthentication: React.FC<signUpProps> = ({ navigation, route }) => {

  const MODULES = ['signup', 'otp_verification'] as const;

  type FormDataType = {
    email: string;
    password: string;
    type: typeof MODULES[number];
    typeFormatted: string;
    OTP: string;
  };

  const [formData, setFormData] = useState<FormDataType>({
    email: '',
    password: '',
    type: 'signup',
    typeFormatted: '',
    OTP: ''
  });
  const [primaryButton, setPrimaryButton] = useState({ label: '', canShow: false });

  const updateFormData = (key: string, value: string) => {
    setFormData((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const getPrimaryButtonLabel = () => {
    const { email, password, OTP, type } = formData;

    if (type === 'signup') {
      return {
        label: 'Verify',
        canShow: !!(email && password), // Show only if both email and password have values
      };
    }
    if (type === 'otp_verification') {
      return {
        label: 'SignUp',
        canShow: !!OTP && OTP.length === 6, // Show only if email has a value
      };
    }
    return { label: '', canShow: false };
  };

  useEffect(() => {
    console.log(getPrimaryButtonLabel());
    setPrimaryButton(getPrimaryButtonLabel());
  }, [formData]);

  useEffect(() => {
    if (route.params?.email) {
      updateFormData('email' , route.params.email);
    }
  }, [route.params?.email]);
    
  const loginAction = () => {
    navigation.navigate('Login', { email: formData.email } );
  }

  const registerUserWithSignUp = () => {

  }

  const OTPVerfication = () => {
    updateFormData('type', 'otp_verification');
  }

  const signUpPageAction = () => {
    if (formData.type === 'signup') {
      OTPVerfication();
    } else if ( formData.type === 'otp_verification') {
      registerUserWithSignUp()
    }
  }


  return (
    <View style={styles.container}>
      <View style={{ flex: 1}}>
        <Text style={{fontSize: 26, fontWeight: 'bold', display: 'flex', alignSelf: 'center',}}>LinkFit</Text>
        <View style={styles.inputFieldsContainer}>
          { formData.type === 'signup' ?
            <>
            <Text style={{fontSize: 32, fontWeight: 'bold', marginBottom: 10}}>SignUp</Text>
              <SafeAreaView>
                <TextInput
                  style={styles.input}
                  onChangeText={(value) => updateFormData('email', value)}
                  value={formData.email}
                  placeholder="Email"
                  keyboardType="default"
                  placeholderTextColor={'gray'}
                />
              </SafeAreaView>
              <SafeAreaView>
                <TextInput
                  style={styles.input}
                  onChangeText={(value) => updateFormData('password', value)}
                  value={formData.password}
                  placeholder="Password"
                  keyboardType="default"
                  placeholderTextColor={'gray'}
                />
              </SafeAreaView>
              <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, marginHorizontal: 10}}>
                <TouchableOpacity onPress={loginAction}>
                  <Text style={{ color: 'gray' }}>LogIn</Text>
                </TouchableOpacity>
              </View>
            </>
            :
            <>
            <Text style={{fontSize: 32, fontWeight: 'bold', marginBottom: 10}}>OTP</Text>
              <OtpInput numberOfDigits={6} onTextChange={(value) => updateFormData('OTP', value)} />
              <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, marginHorizontal: 10}}>
                <TouchableOpacity onPress={() => updateFormData('type', 'signup')}>
                  <Text style={{ color: 'blue' }}>Back</Text>
                </TouchableOpacity>
              </View>
            </>
          }
        </View>
        <View style={styles.loginContainer}>
          <TouchableOpacity style={!primaryButton.canShow ? styles.primaryButtonDisabled: styles.loginButton} onPress={signUpPageAction} disabled={!primaryButton.canShow}>
            <Text style={styles.loginText}>{primaryButton.label}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
} 

export default signUpAuthentication;