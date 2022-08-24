/**
 * @format
 */
import './global';
import 'react-native-get-random-values';
import 'react-native-reanimated';
import {AppRegistry} from 'react-native';
import App from './app/App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
