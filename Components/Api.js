import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Location from './Loc';

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

  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedOption1, setSelectedOption1] = useState(null);
  const [bpChecked, setBpChecked] = useState(false);
  const [diabeticChecked, setDiabeticChecked] = useState(false);
  const [needHomeDeliveryChecked, setNeedHomeDeliveryChecked] = useState(false);
  const options = ['Scan Adhaar', 'API', 'Manual'];
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

            <TextInput
              style={styles.input}
              onChangeText={handleChange('dob')}
              onBlur={handleBlur('dob')}
              value={values.dob}
              placeholder="DOB"
            />
            {errors.dob && touched.dob ? <Text style={styles.error}>{errors.dob}</Text> : null}

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
              placeholder="Mob No"
              keyboardType="phone-pad"
            />
            {errors.mobile_number && touched.mobile_number ? <Text style={styles.error}>{errors.mobile_number}</Text> : null}

            <Checkbox label="Blood Pressure" value={bpChecked} onChange={setBpChecked} />
            <Checkbox label="Diabetic" value={diabeticChecked} onChange={setDiabeticChecked} />
            <Checkbox label="Need Medicine Home Delivery?" value={needHomeDeliveryChecked} onChange={setNeedHomeDeliveryChecked} />

            <TextInput
              style={styles.input}
              onChangeText={handleChange('comorbidities')}
              onBlur={handleBlur('comorbidities')}
              value={values.comorbidities}
              placeholder="Any other Comorbidities Diseases?"
            />
            {errors.comorbidities && touched.comorbidities ? <Text style={styles.error}>{errors.comorbidities}</Text> : null}

            <TextInput
              style={styles.input}
              onChangeText={handleChange('surgery')}
              onBlur={handleBlur('surgery')}
              value={values.surgery}
              placeholder="Any surgery done?"
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
    backgroundColor: '#007da5',
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
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
  error: {
    color: 'red',
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
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#007da5',
    alignItems: 'center',
    justifyContent: 'center',
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
