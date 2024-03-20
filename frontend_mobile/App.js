import * as React from 'react';
import { StyleSheet, Platform} from 'react-native'
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Portal from './screens/ProviderScreens/Portal.js';
import AllAlerts from './screens/ProviderScreens/AllAlerts.js';
import Reports from './screens/ProviderScreens/Reports.js';
import Injections from './screens/Injection/Injections.js';
import Maintenance from './screens/Injection/MaintenanceBottleNum.js';
import PracticeSurvey from './screens/Survey/PracticeSurvey.js';
import ProviderSignInScreen from './screens/ProviderScreens/ProviderSignInScreen.js';
import LoadingScreen from './screens/LoadingScreen.js';
import PatientSignUpScreen from './screens/signup/PatientSignUpScreen';
import ProviderSignUpScreen from './screens/signup/ProviderSignUpScreen.js';
import practiceEnrollment from './screens/signup/practiceEnrollment.js';
import PatientHome from './screens/PatientScreens/PatientHome.js';
import Upcoming from './screens/PatientScreens/Upcoming.js';
import InitialScreen from './screens/InitialScreen.js';
import AuthContext from './AuthContext';
import ViewPatients from './screens/ProviderScreens/ViewPatients.js';

import ViewAllAppointments from './screens/PatientScreens/ViewAllAppointments.js';
import PatientDetails from './screens/ProviderScreens/PatientDetails.js';

import { useMemo, useReducer, useEffect } from 'react';
//import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from "@react-native-async-storage/async-storage";
// import * as SecureStore from 'expo-secure-store';

import InitialMobileScreen from './screens/PatientScreens/InitialMobileScreen.js'
import InjectionInfo from './screens/PatientScreens/InjectionInfo.js';
import EditCurrentMedications from './screens/PatientScreens/EditCurrentMedications.js';
import PatientSignInScreen from './screens/PatientScreens/PatientSignInScreen.js';
//import AppointmentInfo from './screens/AppointmentInfo';

// Secure store doesn't work on web, only iOS and android ^

const Stack = createNativeStackNavigator();



const InitialMobileStack = (
  <>
  <Stack.Screen
      name="InitialMobileScreen"
      component={InitialMobileScreen}
      options={{
        title: 'InitialMobileScreen',
        headerTitleAlign: 'center',
        headerShown: false,
        headerBackTitleVisible: false,
        headerTitleStyle: { textAlign: 'center' },
        //animationTypeForReplace: state.isSignout ? 'pop' : 'push',
      }}
    />
    <Stack.Screen
      name="PatientSignIn"
      component={PatientSignInScreen}
      options={{
        title: 'Patient Login',
        headerTitleAlign: 'center',
        headerTitleStyle: { textAlign: 'center' },
        headerBackTitleVisible: false,
        //animationTypeForReplace: state.isSignout ? 'pop' : 'push',
      }}
    />
    <Stack.Screen
              name="PatientSignUpScreen"
              component={PatientSignUpScreen}
              options={{
                title: 'Patient Sign Up',
                headerBackTitleVisible: false,
                headerTitleAlign: 'center',
                headerTitleStyle: {textAlign: 'center'},
                //animationTypeForReplace: state.isSignout ? 'pop' : 'push',
              }}
            />
    <Stack.Screen
              name="ProviderSignUpScreen"
              component={ProviderSignUpScreen}
              options={{
                title: 'Provider Sign Up',
                headerTitleAlign: 'center',
                headerTitleStyle: {textAlign: 'center'},
               // animationTypeForReplace: state.isSignout ? 'pop' : 'push',
              }}
            />
    <Stack.Screen
              name="PracticeEnrollment"
              component={practiceEnrollment}
              options={{
                title: 'Practice Enrollment',
                headerTitleAlign: 'center',
                headerTitleStyle: {textAlign: 'center'},
               // animationTypeForReplace: state.isSignout ? 'pop' : 'push',
              }}
            />
    {/* Add other mobile-specific screens here */}
  </>
);

const InitialDesktopStack = (
  <>
    <Stack.Screen
      name="InitialScreen"
      component={InitialScreen}
      options={{
        title: '',
        headerTitleAlign: 'center',
        headerTitleStyle: { textAlign: 'center' },
        headerShown: false
      }}
    />
    <Stack.Screen
      name="ProviderSignInScreen"
      component={ProviderSignInScreen}
      options={{
        title: 'Provider Login',
        headerTitleAlign: 'center',
        headerTitleStyle: { textAlign: 'center' },
        //animationTypeForReplace: state.isSignout ? 'pop' : 'push',
      }}
    />
    <Stack.Screen
              name="PatientSignUpScreen"
              component={PatientSignUpScreen}
              options={{
                title: 'Patient Signup',
                headerTitleAlign: 'center',
                headerTitleStyle: {textAlign: 'center'},
               //animationTypeForReplace: state.isSignout ? 'pop' : 'push',
              }}
            />
            <Stack.Screen
              name="ProviderSignUpScreen"
              component={ProviderSignUpScreen}
              options={{
                title: 'Provider Sign Up',
                headerTitleAlign: 'center',
                headerTitleStyle: {textAlign: 'center'},
                //animationTypeForReplace: state.isSignout ? 'pop' : 'push',
              }}
            />
            <Stack.Screen
              name="PracticeEnrollment"
              component={practiceEnrollment}
              options={{
                title: 'Practice Enrollment',
                headerTitleAlign: 'center',
                headerTitleStyle: {textAlign: 'center'},
                //animationTypeForReplace: state.isSignout ? 'pop' : 'push',
              }}
            />
    {/* Add other desktop-specific screens here */}
  </>
);


const SignedInMobileStack = (
  <>
      <Stack.Screen name="PatientHome" component={PatientHome} options={{title: 'AllergyAlly'}} />
      <Stack.Screen name="Upcoming" component={Upcoming} options={{title: 'Upcoming Appointment', headerBackTitleVisible: false}} />
      <Stack.Screen name="PatientSignUpScreen" component={PatientSignUpScreen} options={{title: 'Patient Sign Up'}} />
      <Stack.Screen name= "ViewAllAppointments" component={ViewAllAppointments} options={{title: 'AllergyAlly', headerBackTitleVisible: false}} />
      <Stack.Screen name="InjectionInfo" component={InjectionInfo} options={{title: 'AllergyAlly', headerBackTitleVisible: false}} />
      <Stack.Screen name="EditCurrentMedications" component={EditCurrentMedications} options={{title: 'AllergyAlly', headerBackTitleVisible: false}} />
     
  </>
);


const SignedInDesktopStack = (
  <>
      <Stack.Screen name="Portal" component={Portal} />
      <Stack.Screen name="AllAlerts" component={AllAlerts} options={{title: 'All Alerts'}}/>
      <Stack.Screen name="Reports" component={Reports} />
      <Stack.Screen name="PatientHome" component={PatientHome} options={{title: 'Allergy Ally'}} />
      <Stack.Screen name="Upcoming" component={Upcoming} options={{title: 'Upcoming Appointment'}} />
      <Stack.Screen name="PatientSignUpScreen" component={PatientSignUpScreen} options={{title: 'Patient Sign Up'}} />
      <Stack.Screen name="ProviderSignUpScreen" component={ProviderSignUpScreen} options={{title: 'Provider Sign Up'}} />
      <Stack.Screen name="PracticeEnrollmentScreen" component={practiceEnrollment} options={{ title: 'Practice Enrollment Screen'}} />
      <Stack.Screen name="PracticeSurvey" component={PracticeSurvey} />
      <Stack.Screen name="ViewPatients" component={ViewPatients} options={{ title: 'View Patients'}}/>
      <Stack.Screen name="Injections" component={Injections} options={{title: 'Injections'}} />
      <Stack.Screen name="Maintenance" component={Maintenance} options={{title: 'Maintenance'}} />
      <Stack.Screen name="PatientDetails" component={PatientDetails} options={{title: 'Patient Details'}} />
      <Stack.Screen name= "ViewAllAppointments" component={ViewAllAppointments} options={{title: 'ViewAllAppointments', headerBackTitleVisible: false}} />
      <Stack.Screen name="InjectionInfo" component={InjectionInfo} options={{title: 'InjectionInfo', headerBackTitleVisible: false}} />
  </>
);


//PatientHome: the bottom tab navigation bar
//PatientAppointments: the patient home screen

export default function App({navigation}) {

  const isDesktop = Platform.OS === 'web';
  
  const initialState = {
    isLoading: true,
    isSignout: false,
    userToken: null,
  };

  const [state, dispatch] = useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    initialState // Use the initial state here
  );

  useEffect(() => {
    const bootstrapAsync = async () => {
      let userToken;

      try {
        // restore token - see SignInScreen for how to decrypt
        userToken = await AsyncStorage.getItem('userToken');
        if (userToken) {
          dispatch({ type: 'RESTORE_TOKEN', token: userToken });
        } 
        else {
          dispatch({ type: 'RESTORE_TOKEN', token: null });
        } 
      } catch (e) {
        // Restoring token failed
        console.error('Error:', e);
      }
    };

    bootstrapAsync();
  }, []);

  const authContext = useMemo(() => ({
    signIn: async (data) => {
      await AsyncStorage.setItem('userToken', data);
      dispatch({ type: 'SIGN_IN', token: data });
    },
    signOut: async () => {
      await AsyncStorage.removeItem('userToken');
      dispatch({ type: 'SIGN_OUT'});
    },
    userToken: state.userToken, 
  }), [state.userToken]);

  return (

    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <Stack.Navigator  screenOptions={() => ({
        headerTitleStyle: styles.headerTitleStyle,
        headerStyle: { backgroundColor: '#1059d5'},
        headerTintColor: 'white',
        headerTitleContainerStyle: {
          justifyContent: 'center',
        },
        })}>
          {state.isLoading ? (
            // We haven't finished checking for the token yet
            <Stack.Screen name="Loading" component={LoadingScreen} />
          ) : state.userToken == null ? (
            // No token found, user isn't signed in
            isDesktop ? InitialDesktopStack : InitialMobileStack
          ) : (
            // User is signed in
            isDesktop ? SignedInDesktopStack : SignedInMobileStack
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider> 
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleStyle: {
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
    alignSelf: 'center',
    color: 'white',
  },
  root: {
    flex: 1,
  }
});
