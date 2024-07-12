// EnrollmentForm.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import GetLocation from 'react-native-get-location'

GetLocation.getCurrentPosition({
    enableHighAccuracy: true,
    timeout: 60000,
})
.then(location => {
    console.log(location);
})
.catch(error => {
    const { code, message } = error;
    console.warn(code, message);
});

const RadioButton = ({ options, selectedOption, onSelect }) => {
  return (
    <View style={styles.radioButtonRow}>
      {options.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={styles.radioButtonContainer}
          onPress={() => onSelect(option)}
        >
          <View style={styles.radioButton}>
            {selectedOption === option && <View style={styles.radioButtonSelected} />}
          </View>
          <Text style={styles.radioButtonText}>{option}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const Checkbox = ({ label, value, onChange }) => {
  return (
    <TouchableOpacity style={styles.checkboxContainer} onPress={() => onChange(!value)}>
      <View style={[styles.checkbox, value && styles.checkboxChecked]} />
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

const EnrollmentForm = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [bpChecked, setBpChecked] = useState(false);
  const [diabeticChecked, setDiabeticChecked] = useState(false);
  const options = ['Scan Adhaar', 'API', 'Manual'];

  const makeApiCall = async (values) => {
    const url = 'http://192.168.31.226:8085/add_health_record';
    const requestBody = {
      aadhar_number: values.adharNo,
      parent_aadhar_number: "",
      head_of_the_family: true,
      name: values.name,
      dob: values.dob,
      sex: values.sex,
      age: parseInt(values.age),
      address: values.address,
      mobile_number: values.mobNo,
      bp: bpChecked,
      diabetic: diabeticChecked,
      medicines_home_delivery: values.needHomeDelivery,
      diseases: values.comorbidities,
      surgeries: values.surgery,
      comments: values.comment,
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const responseData = await response.json();
      Alert.alert('Success', 'Health record added successfully', [{ text: 'OK' }]);
      console.log(responseData);
    } catch (error) {
      Alert.alert('Error', 'Failed to add health record', [{ text: 'OK' }]);
      console.error('Error:', error);
    }
  };

  return (
    <Formik
      initialValues={{
        adharNo: '',
        name: '',
        dob: '',
        age: '',
        sex: '',
        address: '',
        mobNo: '',
        needHomeDelivery: false,
        comorbidities: '',
        surgery: '',
        comment: ''
      }}
      validationSchema={Yup.object({
        adharNo: Yup.string().required('Required'),
        name: Yup.string().required('Required'),
        dob: Yup.string().required('Required'),
        age: Yup.number().required('Required'),
        sex: Yup.string().required('Required'),
        address: Yup.string().required('Required'),
        mobNo: Yup.string().required('Required'),
      })}
      onSubmit={(values, { setSubmitting }) => {
        makeApiCall(values);
        setSubmitting(false);
      }}
    >
      {({ handleChange, handleBlur, handleSubmit, values, setFieldValue }) => (
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.formContainer}>
            <View style={styles.headerContainer}>
              <Text style={styles.headerTitle}>Med Monitor</Text>
            </View>
            
            <View style={styles.section}>
              <Text style={styles.title}>Select an Option</Text>
              <RadioButton
                options={options}
                selectedOption={selectedOption}
                onSelect={setSelectedOption}
              />
              {selectedOption && <Text style={styles.selectedOption}>Selected: {selectedOption}</Text>}
            </View>
            
            <TextInput
              style={styles.input}
              onChangeText={handleChange('adharNo')}
              onBlur={handleBlur('adharNo')}
              value={values.adharNo}
              placeholder="Adhar No"
            />
            <TextInput
              style={styles.input}
              onChangeText={handleChange('name')}
              onBlur={handleBlur('name')}
              value={values.name}
              placeholder="Name"
            />
            <TextInput
              style={styles.input}
              onChangeText={handleChange('dob')}
              onBlur={handleBlur('dob')}
              value={values.dob}
              placeholder="DOB"
            />
            <TextInput
              style={styles.input}
              onChangeText={handleChange('age')}
              onBlur={handleBlur('age')}
              value={values.age}
              placeholder="Age"
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              onChangeText={handleChange('sex')}
              onBlur={handleBlur('sex')}
              value={values.sex}
              placeholder="Sex"
            />
            <TextInput
              style={styles.input}
              onChangeText={handleChange('address')}
              onBlur={handleBlur('address')}
              value={values.address}
              placeholder="Address"
            />
            <TextInput
              style={styles.input}
              onChangeText={handleChange('mobNo')}
              onBlur={handleBlur('mobNo')}
              value={values.mobNo}
              placeholder="Mob No"
              keyboardType="phone-pad"
            />
            
            <Checkbox
              label="High Blood Pressure"
              value={bpChecked}
              onChange={setBpChecked}
            />
            <Checkbox
              label="Diabetic"
              value={diabeticChecked}
              onChange={setDiabeticChecked}
            />

            <Text style={styles.subtitle}>Previous Health History</Text>
            <TextInput
              style={styles.input}
              onChangeText={handleChange('comorbidities')}
              onBlur={handleBlur('comorbidities')}
              value={values.comorbidities}
              placeholder="Any other Comorbidities Diseases?"
            />
            <TextInput
              style={styles.input}
              onChangeText={handleChange('surgery')}
              onBlur={handleBlur('surgery')}
              value={values.surgery}
              placeholder="Any surgery done?"
            />
            <TextInput
              style={styles.input}
              onChangeText={handleChange('comment')}
              onBlur={handleBlur('comment')}
              value={values.comment}
              placeholder="Comment"
            />
            <View style={styles.buttonContainer}>
              <Button onPress={handleSubmit} title="Submit & Exit" color="#007da5" />
              <Button onPress={() => { /* handle save and next */ }} title="Save & Next Family Member" color="#007da5" />
            </View>
          </View>
        </ScrollView>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  formContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  headerContainer: {
    backgroundColor: '#6200ee',
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  section: {
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    marginVertical: 10,
    color: '#555',
  },
  radioButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  radioButton: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#007da5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  radioButtonSelected: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#007da5',
  },
  radioButtonText: {
    fontSize: 16,
    color: '#333',
  },
  selectedOption: {
    marginTop: 10,
    fontSize: 16,
    color: 'green',
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: '#007da5',
  },
  label: {
    fontSize: 16,
    color: '#333',
  },
});

export default EnrollmentForm;
