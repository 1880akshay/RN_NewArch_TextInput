/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {TextInput, View} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const Screen1 = () => {
  return (
    <View style={{flex: 1, padding: 30, justifyContent: 'flex-end'}}>
      <TextInput
        placeholder="test"
        style={{borderWidth: 1, borderColor: 'black', height: 60}}
      />
    </View>
  );
};

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Screen1"
          component={Screen1}
          options={{statusBarTranslucent: true}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
