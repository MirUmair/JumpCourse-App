
import React from "react"
import { initialWindowMetrics, SafeAreaProvider } from "react-native-safe-area-context"
import AppNavigator from "./navigators/mainStack"
import store from './redux/store';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';

interface AppProps {
  hideSplashScreen: boolean
}

/**
 * This is the root component of our app.
 * @param {AppProps} props - The props for the `App` component.
 * @returns {JSX.Element} The rendered `App` component.
 */
function App(props: AppProps) {
 
  // otherwise, we're ready to render the app
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <GestureHandlerRootView>
        <Provider store={store}>
          <AppNavigator />
        </Provider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  )
}

export default App
