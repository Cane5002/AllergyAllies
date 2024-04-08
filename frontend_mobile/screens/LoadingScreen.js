import * as React from 'react';
import {Text, View, ActivityIndicator} from 'react-native';

export default function LoadingScreen() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Loading...</Text>
      <ActivityIndicator size="large" />
    </View>
    );
  }