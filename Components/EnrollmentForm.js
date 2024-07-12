import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';

const EnrollmentForm = () => {
  const [formData, setFormData] = useState({
    
    "aadhar_number":"1234-5678-9012",
   "parent_aadhar_number":"",
   "head_of_the_family":true,
   "name":"Jane Doe",
   "dob":"1990-01-01",
   "sex":"Female",
   "age":30,
   "address":"123 Main Street, City, Country",
   "mobile_number":"9876543210",
   "bp":true,
   "diabetic":true,
   "medicines_home_delivery":true,
   "diseases":"None",
   "surgeries":"Appendectomy",
   "comments":"No additional comments"

  });

  useEffect(() => {
    parseQRData();
  }, []);

  const parseQRData = () => {
    const qrData = '<QDA n="Vijaya R Halageri" u="xxxxxxxx9545" g="F" d="03-09-1969" a="81,6th Main 4th Block,Nandini Layout,Near Rajkumar Samadhi,Bangalore North,Bengaluru,Karnataka,560096" x="" s="CNHlyxIvKb0pMl+fnlpjV9UuwFWrfvpkqIDGcyf/ABNbXuPTOc4APL1qiKtEA1uV4b6JSHcTag1FVUK5rLOk2GwefTf55pRElMPlkWf1299Yk830RjzxbSzqv6X+oyWJH/KSMRP0W/was4ewL9lGSl5n9FHw0pwt4g/ip0W3oYn6rmYmbyc/qN3pm3GbOagXLxQtzYtU36y8to9rAFL9QkcaWResWBxOCqD2PrS2hlW0i4oYgCe0oVVokQ7NIl7W6Lq82Q+4fMRJwC0VA75o0gmo5WK8fVEnNZbp8Kqg2y2UUUEghYGfaaEVKv/h2q4u3W9LGwyOw+dJXl2hthaY4w=="/>';

    // const parser = new DOMParser();
    // const xmlDoc = parser.parseFromString(qrData, 'text/xml');
    // const qdaElement = xmlDoc.getElementsByTagName('QDA')[0];
    const xml2js = require('react-native-xml2js');
    xml2js.parseString(qrData, (err, result) => {
      if (err) {
          console.error('Error parsing XML:', err);
          return;
      }

       qdaElement = result.QDA.$;
       name = qdaElement.n;
       user = qdaElement.u;
       gender = qdaElement.g;
       date = qdaElement.d;
       address = qdaElement.a;
       extra = qdaElement.x;
       secureString = qdaElement.s;
    });
    let birthdate = date;
    let age = calculateAge(birthdate);

    setFormData((prevFormData) => ({
      ...prevFormData,
      name: name,
      dob: date,
      age: age,
      sex: gender,
      address: address,
      mobile_number: user,
    }));
  };

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

  const handleFormSubmit = async (values) => {
    const formattedData = {
      ...values,
      age: parseInt(values.age), // ensure age is a number
    };

    try {
      const response = await fetch('http://192.168.31.226:8085/add_health_record', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
      });

      if (response.ok) {
        Alert.alert('Success', 'Form submitted successfully');
      } else {
        const result = await response.json();
        Alert.alert('Error', `Failed to submit form: ${result.message}`);
      }
    } catch (error) {
      Alert.alert('Error', `Failed to submit form: ${error.message}`);
    }
  };

  return (
    <Formik
      initialValues={formData}
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
        handleFormSubmit(values);
        setSubmitting(false);
      }}
    >
      {({ handleChange, handleBlur, handleSubmit, values, setFieldValue }) => (
        <View style={styles.container}>
          <Text>New Enrollment</Text>
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
          />
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
            <Button onPress={handleSubmit} title="Submit & Exit" />
            <Button onPress={() => { /* handle save and next */ }} title="Save & Next Family Member" />
          </View>
        </View>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#000',
    padding: 10,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default EnrollmentForm;
