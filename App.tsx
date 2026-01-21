import Toast from 'react-native-toast-message';
import BaitSkillStackNavigator from './[BaitSkillSplashQuiz]/baitskillroutes/BaitSkillStackNavigator';
import { StorageProvider } from './[BaitSkillSplashQuiz]/skillsplashstore/baitSkillContext';
import { NavigationContainer } from '@react-navigation/native';

// app main

const App = () => {
  return (
    <NavigationContainer>
      <StorageProvider>
        <BaitSkillStackNavigator />
        <Toast position="top" topOffset={40} />
      </StorageProvider>
    </NavigationContainer>
  );
};

export default App;
