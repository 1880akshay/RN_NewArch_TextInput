/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useMemo, useState} from 'react';
import {
  SafeAreaView,
  StatusBar,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const [focus, setFocus] = useState(false);

  const containerStyle = useMemo(
    () => [{width: '100%'}, focus && {elevation: 3}],
    [focus],
  );

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />

      <View style={containerStyle}>
        <TextInput
          placeholder="Text"
          style={{height: 60, width: 300, borderColor: 'black', borderWidth: 1}}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
        />
      </View>
    </SafeAreaView>
  );
}

export default App;
