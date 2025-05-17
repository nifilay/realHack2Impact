// index.js
import 'react-native-gesture-handler';           // keep this first!
import { registerRootComponent } from 'expo';    // ⇐ import from 'expo'
import App from './App';

registerRootComponent(App);
