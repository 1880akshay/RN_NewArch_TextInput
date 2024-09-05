/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import React, {useState} from 'react';
import {
  Image,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import {
  downloadFile,
  getDownloadDirectory,
  getFileNameFromUrl,
  getMimeTypeFromUrl,
} from './utils';

async function hasAndroidPermission() {
  const getCheckPermissionPromise = () => {
    if (+Platform.Version >= 33) {
      return Promise.all([
        PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
        ),
        PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
        ),
      ]).then(
        ([hasReadMediaImagesPermission, hasReadMediaVideoPermission]) =>
          hasReadMediaImagesPermission && hasReadMediaVideoPermission,
      );
    } else {
      return PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      );
    }
  };

  const hasPermission = await getCheckPermissionPromise();
  if (hasPermission) {
    return true;
  }
  const getRequestPermissionPromise = () => {
    if (+Platform.Version >= 33) {
      return PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
      ]).then(
        statuses =>
          statuses[PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          statuses[PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO] ===
            PermissionsAndroid.RESULTS.GRANTED,
      );
    } else {
      return PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      ).then(status => status === PermissionsAndroid.RESULTS.GRANTED);
    }
  };

  return await getRequestPermissionPromise();
}

const downloadImage = async url => {
  if (Platform.OS === 'android' && !(await hasAndroidPermission())) {
    return;
  }

  const dirPath = getDownloadDirectory();

  const fileName = getFileNameFromUrl(url);
  const fileExt = getMimeTypeFromUrl(url);

  const filePath = `${dirPath}/${fileName}.${fileExt}`;
  const mimeType = 'text/plain';

  return downloadFile({url, filePath, mimeType})
    .then(path => `file://${path}`)
    .then(CameraRoll.saveAsset);
};

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
  };

  const url = 'https://reactnative.dev/img/tiny_logo.png';

  const [loading, setLoading] = useState(false);

  const onPressDownload = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    downloadImage(url)
      .then(() => {
        console.log('Download success');
      })
      .catch(() => {
        console.log('Download failed');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          gap: 20,
        }}>
        <Image style={{height: 100, width: 100}} source={{uri: url}} />
        <Text style={{fontSize: 20, color: 'blue'}} onPress={onPressDownload}>
          {loading ? 'Downloading...' : 'Download'}
        </Text>
      </View>
    </SafeAreaView>
  );
}

export default App;
