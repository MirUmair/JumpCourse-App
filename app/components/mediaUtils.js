import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { Alert, PermissionsAndroid, Platform } from 'react-native';
import { check, PERMISSIONS, request, RESULTS } from 'react-native-permissions';

export const requestPermissions = async (forCamera = false) => {
  if (Platform.OS === 'android') {
    const isAndroid13OrHigher = Platform.Version >= 33;
    if (!isAndroid13OrHigher) {
      await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
    } else {
      await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES);
    }
    if (forCamera) {
      const cameraGranted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
      if (cameraGranted !== 'granted') {
        return false;
      }
    }
    return true;
  } else {
    const galleryResult = await check(PERMISSIONS.IOS.PHOTO_LIBRARY);
    if (galleryResult !== RESULTS.GRANTED) {
      await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
    }

    if (forCamera) {
      const cameraResult = await check(PERMISSIONS.IOS.CAMERA);
      if (cameraResult !== RESULTS.GRANTED) {
        const cameraResponse = await request(PERMISSIONS.IOS.CAMERA);
        if (cameraResponse !== RESULTS.GRANTED) {
          return false;
        }
      }
    }
    return true;
  }
};

export const handleImagePicker = async (setImage) => {
  const permissionGranted = await requestPermissions(true);
  if (!permissionGranted) {
    return;
  }

  // bottomSheetRef.current?.close();
  // setLoader(true);
  const result = await launchImageLibrary({ mediaType: 'photo', quality: 1 });
  if (result.assets && result.assets.length > 0) {
    //  setImage(result.assets[0])
    // setLoader(false);
    setImage(result.assets[0]) //: navigation.navigate(Screens.AddCourse, { image: result.assets[0] });
  } else {
    // setLoader(false);
  }
};

export const launchCameraImage = async (setImage) => {
  const permissionGranted = await requestPermissions(true);
  if (!permissionGranted) {
    return;
  }
  const options = { mediaType: 'photo', quality: 1 };
  // setLoader(true);
  // setTimeout(() => {
  launchCamera(options, (response) => {
    // setLoader(false);
    if (response.assets && response.assets.length > 0) {
      setImage(response.assets[0])
    }
  });
  // }, 100);
};


// import React from 'react';
// import { handleImagePicker, launchCameraWithType } from './mediaUtils';

// function MyComponent(props) {
//     const { bottomSheetRef, setLoader, setImage, navigation, hasGalleryPermission } = props;

//     return (
//       <View>
//         <Button title="Open Gallery" onPress={() => handleImagePicker(bottomSheetRef, setLoader, setImage, navigation, hasGalleryPermission, Screens)} />
//         <Button title="Open Camera" onPress={() => launchCameraWithType('photo', bottomSheetRef, setLoader, setImage, navigation, Screens)} />
//       </View>
//     );
// }