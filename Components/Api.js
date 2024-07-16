import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView, StatusBar, Dimensions } from 'react-native';
import Modal from 'react-native-modal';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Location from './Loc';
import UploadImage from './Add_image';
import DateTimePicker from '@react-native-community/datetimepicker';
import Scan from './Scan';
import { useNavigation } from '@react-navigation/native';

const EnrollmentForm = () => {
  const [initialValues, setInitialValues] = useState({
    adharNo: '',
    name: '',
    dob: '',
    age: '',
    sex: '',
    address: '',
    mobile_number: '',
    comorbidities: '',
    surgery: '',
    comment: '',
  });

  const navigation = useNavigation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const calculateAge = (birthdate) => {
    const [day, month, year] = birthdate.split('-').map(Number);
    const birthDate = new Date(year, month - 1, day);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  };

  useEffect(() => {
    parseQRData();
  }, []);

  const parseQRData = () => {
    const xml2js = require('react-native-xml2js');
    const xmlData = '<QDA n="Vijaya R Halageri" u="xxxxxxxx9545" g="F" d="03-09-1969" a="81,6th Main 4th Block,Nandini Layout,Near Rajkumar Samadhi,Bangalore North,Bengaluru,Karnataka,560096" x="" s="CNHlyxIvKb0pMl+fnlpjV9UuwFWrfvpkqIDGcyf/ABNbXuPTOc4APL1qiKtEA1uV4b6JSHcTag1FVUK5rLOk2GwefTf55pRElMPlkWf1299Yk830RjzxbSzqv6X+oyWJH/KSMRP0W/was4ewL9lGSl5n9FHw0pwt4g/ip0W3oYn6rmYmbyc/qN3pm3GbOagXLxQtzYtU36y8to9rAFL9QkcaWResWBxOCqD2PrS2hlW0i4oYgCe0oVVokQ7NIl7W6Lq82Q+4fMRJwC0VA75o0gmo5WK8fVEnNZbp8Kqg2y2UUUEghYGfaaEVKv/h2q4u3W9LGwyOw+dJXl2hthaY4w=="/>';

    xml2js.parseString(xmlData, (err, result) => {
      if (err) {
        console.error('Error parsing XML:', err);
        return;
      }

      const qdaElement = result.QDA.$;
      const name = qdaElement.n;
      const user = qdaElement.u;
      const gender = qdaElement.g;
      const date = qdaElement.d;
      const address = qdaElement.a;
      const age = calculateAge(date);

      setInitialValues((prevInitialValues) => ({
        ...prevInitialValues,
        name: name,
        dob: date,
        age: age.toString(),
        sex: gender,
        address: address,
        mobile_number: user,
      }));
    });
  };

  const RadioButton = ({ options, selectedOption, onSelect }) => {
    return (
      <View style={styles.radioButtonRow}>
        {options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={styles.radioButtonContainer}
            onPress={() => {
              onSelect(option);
              if (option === 'Upload') {
                setIsModalVisible(true);
              } 
              if (option === 'Scan Adhaar'){
                navigation.navigate(Scan);
                    
              }}
            }
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

  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedOption1, setSelectedOption1] = useState(null);
  const [bpChecked, setBpChecked] = useState(false);
  const [diabeticChecked, setDiabeticChecked] = useState(false);
  const [needHomeDeliveryChecked, setNeedHomeDeliveryChecked] = useState(false);
  const options = ['Scan Adhaar', 'Upload', 'Manual'];
  const options1 = ['New Family Enrollment', 'Attach Member'];

  const makeApiCall = async (values) => {
    const url = 'http://192.168.31.226:8085/add_health_record';
    const requestBody = {
      aadhar_number: values.adharNo,
      parent_aadhar_number: '',
      head_of_the_family: true,
      name: values.name,
      dob: values.dob,
      sex: values.sex,
      age: parseInt(values.age),
      address: values.address,
      mobile_number: values.mobile_number,
      bp: bpChecked,
      diabetic: diabeticChecked,
      medicines_home_delivery: needHomeDeliveryChecked,
      diseases: values.comorbidities,
      surgeries: values.surgery,
      comments: values.comment,
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
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
      initialValues={initialValues}
      enableReinitialize={true}
      validationSchema={Yup.object({
        adharNo: Yup.string()
          .matches(/^\d{12}$/, '* Aadhaar number must be exactly 12 digits')
          .required('* Required'),
        name: Yup.string()
          .matches(/^[a-zA-Z\s]+$/, '* Name can only contain letters and spaces')
          .required('* Required'),
        dob: Yup.string().required('* Required'),
        age: Yup.number().required('* Required').positive().integer(),
        sex: Yup.string().required('* Required'),
        address: Yup.string().required('* Required'),
        mobile_number: Yup.string()
          .matches(/^\d{10}$/, ' * Mobile number must be exactly 10 digits')
          .required('* Required'),

        comorbidities: Yup.string().required('* Required'),
        surgery: Yup.string().required('* Required'),
        comment: Yup.string().required('* Required'),
      })}
      onSubmit={(values, { setSubmitting }) => {
        makeApiCall(values);
        setSubmitting(false);
      }}
    >
      {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.formContainer}>
            <View style={styles.headerContainer}>
              <Text style={styles.headerTitle}>Med Monitor</Text>
            </View>

            <View>
              <Location />
            </View>

            <View style={styles.container}>
              <View style={styles.section}>
                <RadioButton options={options1} selectedOption={selectedOption1} onSelect={setSelectedOption1} />
              </View>
              <View style={styles.section}>
                <Text style={styles.title}>Select an Option</Text>
                <RadioButton options={options} selectedOption={selectedOption} onSelect={setSelectedOption} />
              </View>
            </View>
            <Modal isVisible={isModalVisible} onBackdropPress={() => setIsModalVisible(false)}>
              <View style={styles.modalContent}>
                <UploadImage />
                <Button title="Close" onPress={() => setIsModalVisible(false)} />
              </View>
            </Modal>

            <TextInput
              style={styles.input}
              onChangeText={handleChange('adharNo')}
              onBlur={handleBlur('adharNo')}
              value={values.adharNo}
              placeholder="Adhar No"
            />
            {errors.adharNo && touched.adharNo ? <Text style={styles.error}>{errors.adharNo}</Text> : null}

            <TextInput
              style={styles.input}
              onChangeText={handleChange('name')}
              onBlur={handleBlur('name')}
              value={values.name}
              placeholder="Name"
            />
            {errors.name && touched.name ? <Text style={styles.error}>{errors.name}</Text> : null}

            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <TextInput
                style={styles.input}
                placeholder="Date of Birth (DD-MM-YYYY)"
                value={values.dob}
                editable={false}
                pointerEvents="none"
              />
            </TouchableOpacity>
            {errors.dob && touched.dob ? <Text style={styles.error}>{errors.dob}</Text> : null}

            {showDatePicker && (
              <DateTimePicker
                value={values.dob ? new Date(values.dob.split('-').reverse().join('-')) : new Date()}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    const formattedDate = selectedDate.toLocaleDateString('en-GB').replace(/\//g, '-');
                    handleChange('dob')(formattedDate);
                    const age = calculateAge(formattedDate);
                    handleChange('age')(age.toString());
                  }
                }}
              />
            )}

            <TextInput
              style={styles.input}
              onChangeText={handleChange('age')}
              onBlur={handleBlur('age')}
              value={values.age}
              placeholder="Age"
              keyboardType="numeric"
            />
            {errors.age && touched.age ? <Text style={styles.error}>{errors.age}</Text> : null}

            <TextInput
              style={styles.input}
              onChangeText={handleChange('sex')}
              onBlur={handleBlur('sex')}
              value={values.sex}
              placeholder="Sex"
            />
            {errors.sex && touched.sex ? <Text style={styles.error}>{errors.sex}</Text> : null}

            <TextInput
              style={styles.input}
              onChangeText={handleChange('address')}
              onBlur={handleBlur('address')}
              value={values.address}
              placeholder="Address"
            />
            {errors.address && touched.address ? <Text style={styles.error}>{errors.address}</Text> : null}

            <TextInput
              style={styles.input}
              onChangeText={handleChange('mobile_number')}
              onBlur={handleBlur('mobile_number')}
              value={values.mobile_number}
              placeholder="Mobile Number"
              keyboardType="numeric"
            />
            {errors.mobile_number && touched.mobile_number ? <Text style={styles.error}>{errors.mobile_number}</Text> : null}

            <Checkbox label="BP" value={bpChecked} onChange={setBpChecked} />
            <Checkbox label="Diabetic" value={diabeticChecked} onChange={setDiabeticChecked} />
            <Checkbox label="Need Home Delivery" value={needHomeDeliveryChecked} onChange={setNeedHomeDeliveryChecked} />

            <TextInput
              style={styles.input}
              onChangeText={handleChange('comorbidities')}
              onBlur={handleBlur('comorbidities')}
              value={values.comorbidities}
              placeholder="Comorbidities"
            />
            {errors.comorbidities && touched.comorbidities ? <Text style={styles.error}>{errors.comorbidities}</Text> : null}

            <TextInput
              style={styles.input}
              onChangeText={handleChange('surgery')}
              onBlur={handleBlur('surgery')}
              value={values.surgery}
              placeholder="Surgery"
            />
            {errors.surgery && touched.surgery ? <Text style={styles.error}>{errors.surgery}</Text> : null}

            <TextInput
              style={styles.input}
              onChangeText={handleChange('comment')}
              onBlur={handleBlur('comment')}
              value={values.comment}
              placeholder="Comment"
            />
            {errors.comment && touched.comment ? <Text style={styles.error}>{errors.comment}</Text> : null}
              
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
  formContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  headerContainer: {
    backgroundColor: '#007da5',
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 20,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 12,
    paddingHorizontal: 10,
  },
  error: {
    fontSize: 12,
    color: 'red',
    marginBottom: 8,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#007da5',
  },
  label: {
    fontSize: 16,
  },
  section: {
    marginVertical: 10,
  },
  radioButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioButton: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  radioButtonSelected: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#007da5',
  },
  radioButtonText: {
    fontSize: 16,
  },
  container: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});

export default EnrollmentForm;
