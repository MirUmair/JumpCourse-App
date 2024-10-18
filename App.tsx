import 'react-native-reanimated';
import * as React from 'react';
import Stacks from './app/app';
import RNBootSplash from 'react-native-bootsplash';
import {LogBox} from 'react-native';
LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications
function App() {
  React.useEffect(() => {
    RNBootSplash.hide(); // Hide the splash screen
  }, []);
  return <Stacks hideSplashScreen={true} />;
}

export default App;
