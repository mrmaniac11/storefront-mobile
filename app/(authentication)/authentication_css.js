import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 20,
  },
  inputFieldsContainer: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
  },
  input: {
    borderColor: 'gray',
    width: '100%',
    height: 40,
    marginTop: 12,
    borderWidth: 1,
    padding: 20,
    borderRadius: 15,
    backgroundColor: 'rgb(233, 233, 233)',
  },
  loginContainer: {
    marginTop: 30,
    marginBottom: 20,
  },
  loginButton: {
    borderRadius: 20,
    backgroundColor: '#34AE57',
    padding: 12
  },
  primaryButtonDisabled: {
    borderRadius: 20,
    padding: 12,
    backgroundColor: '#83c997',
  },
  loginText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 300,
    textAlign: 'center'
  }
});

export default styles