import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import HomeScreen from './Screens/HomeScreen';

import LoginScreen from './Screens/LoginScreen';
import ResetPasswordScreen from './Screens/ResetPasswordScreen';
import RegisterScreen from './Screens/RegisterScreen';
import PostList from './Screens/PostList';
import PostScreen from './Screens/PostScreen';

const AppNavigator = createStackNavigator({
  Home: { screen: HomeScreen },
  Login: { screen: LoginScreen },
  ResetPassword: { screen: ResetPasswordScreen },
  Register: { screen: RegisterScreen },
  PostList: { screen: PostList },
  Post: { screen: PostScreen },
},
  {
    initialRouteName: 'Home',
  }
);

const App = createAppContainer(AppNavigator);

export default App;