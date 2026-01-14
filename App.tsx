import BaitSkillStackNavigator from './[BaitSkillSplashQuiz]/baitskillroutes/BaitSkillStackNavigator';
import { Context } from './[BaitSkillSplashQuiz]/skillsplashstore/baitSkillContext';
import { NavigationContainer } from '@react-navigation/native';

const App = () => {
  return (
    <NavigationContainer>
      <Context>
        <BaitSkillStackNavigator />
      </Context>
    </NavigationContainer>
  );
};

export default App;
