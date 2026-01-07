import { NavigationContainer } from '@react-navigation/native';
import BaitSkillStackNavigator from './BaitSkillSplashQuiz/[routes]/BaitSkillStackNavigator';
import { BaitSkillStore } from './BaitSkillSplashQuiz/[store]/baitSkillContext';

const App = () => {
  return (
    <NavigationContainer>
      <BaitSkillStore>
        <BaitSkillStackNavigator />
      </BaitSkillStore>
    </NavigationContainer>
  );
};

export default App;
