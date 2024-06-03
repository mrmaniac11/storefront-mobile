import React, { useState } from 'react';
import { Text, View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { Button } from '@mui/material';
import networkService from '@/app/network/store';
import { useNotification } from '@/app/components/notification/NotificationContext';

function Profile() {
  const [formData, setFormData ] = useState({
      name: '',
      userName: '',
      pronounce: '',
      bio: '',
      gender: ''
    });
  
    const { errorNotification } = useNotification();
    const handleInputChange = (field: string, value: string) => {
      setFormData  ({
        ...formData,
        [field]: value,
      });
    };

    const genderContent = [{
      label: 'Male', value: 'male',
    }, {
      label: 'Female', value: 'female',
    }, {
      label: 'Prefer not to say', value: 'PNTS',
    }]

    const Divider = () => {
      return <View style={styles.divider} />;
    };
    

  const saveUserPreferenceAction = async () => {
    await networkService.post('/user-details', {
      name: formData.name,
      userName: formData.userName,
      pronounce: formData.pronounce,
      bio: formData.bio,
      gender: formData.gender
    }).then( async(response) => {
      
    }).catch( () => {
      errorNotification('Oops Somthing wrong! try again')
    }).finally( () => {
      console.log('user preference final block got executed.')
    });
  }
  return (
    <View style={{display: 'flex', flex: 1, justifyContent: 'space-between'}}>
      <View>
        <View style={{height: '18%', display: 'flex', justifyContent: 'center', alignItems: 'center', marginVertical: 10 }}>
          <View style={{height: 100, width: 100, backgroundColor: 'lightgrey', borderRadius: 50, marginVertical: 10}}>
            {/* For Image */}
          </View>
          <TouchableOpacity>
            <Text style={styles.editProfileText}>Edit picture</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.inputLabelContainer}>
            <Text style={styles.inputLabel}>Name</Text>
          </View>
          
          <TextInput
            style={styles.input}
            value={formData.name}
            onChangeText={(value) => handleInputChange('name', value)}
            placeholder="Enter your name"
            placeholderTextColor="#999"
          />
        </View>
        <View style={styles.inputContainer}>
          <View style={styles.inputLabelContainer}>
              <Text style={styles.inputLabel}>Username</Text>
            </View>
            
            <TextInput
              style={styles.input}
              value={formData.userName}
              onChangeText={(value) => handleInputChange('userName', value)}
              placeholder="Enter user name"
              placeholderTextColor="#999"
            />
        </View>
        <View style={styles.inputContainer}>
          <View style={styles.inputLabelContainer}>
              <Text style={styles.inputLabel}>Pronouns</Text>
            </View>
            
            <TextInput
              style={styles.input}
              value={formData.pronounce}
              onChangeText={(value) => handleInputChange('pronounce', value)}
              placeholder="Pronounce"
              placeholderTextColor="#999"
            />
        </View>
        <View style={styles.inputContainer}>
            <View style={styles.inputLabelContainer}>
              <Text style={styles.inputLabel}>Bio</Text>
            </View>
            
            <TextInput
              style={styles.input}
              value={formData.bio}
              onChangeText={(value) => handleInputChange('bio', value)}
              placeholder="Bio"
              placeholderTextColor="#999"
            />
        </View>

        <View style={styles.inputContainer}>
            <View style={styles.inputLabelContainer}>
              <Text style={styles.inputLabel}>Gender</Text>
            </View>
            <View style={{width: '75%'}}>
              <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                data={genderContent}
                search={false}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder='Select Gender'
                searchPlaceholder="Search..."
                value={formData.gender}
                onChange={item => {
                  handleInputChange('gender', item.value);
                }}
              /> 
            </View>
        </View>
        <View style={{marginTop: 20}}>
          <Divider/>
          <View style={{marginLeft: 20, marginTop: 15}}>
            <TouchableOpacity>
              <Text style={{color: 'rgb(19, 137, 253)', fontSize: 16}}>Add Bank Details</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={{display: 'flex', flexDirection: 'row',paddingVertical: 7, marginTop: 10, marginHorizontal: 5}}>
          <Button style={{color: 'white', backgroundColor: '#34AE57', width: '100%', marginLeft: 5, borderRadius: 10, paddingTop: 10, paddingBottom: 10}} onClick={saveUserPreferenceAction}>
            Save
          </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  editProfileText: {
    fontWeight: 800,
    color: 'rgb(19, 137, 253)'
  },
  divider: {
    height: 1,
    backgroundColor: 'lightgrey',
    marginVertical: 5,
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'row',
    margin: 20,
  },
  inputLabelContainer: {
    alignSelf: 'center', 
    marginRight: 20,
    width: '20%'
  },
  inputLabel: {
    fontSize: 16
  },
  input: {
    width: '80%',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingVertical: 5,
    fontSize: 16,
  },


  // dropdown classes
  dropdown: {
    height: 40,
    borderBottomWidth: 0.5,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
    color: 'grey'
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },


  // COMMON CLASSES - profile and addCollectionProducts.tsx
  saveCollectionButtonText: {
    fontSize: 16,
    color: 'black',
    textAlign: 'center',
  },
});

export default Profile;