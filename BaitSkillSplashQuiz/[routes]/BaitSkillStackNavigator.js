import { createNativeStackNavigator } from '@react-navigation/native-stack';

import BaitSkillIntroduce from '../[views]/BaitSkillIntroduce';
import BaitSkillLoader from '../[components]/BaitSkillLoader';
import BaitSkillHome from '../[views]/BaitSkillHome';
import BaitSkillFishingTips from '../[views]/BaitSkillFishingTips';
import BaitSkillSavedTips from '../[views]/BaitSkillSavedTips';
import BaitSkillQuizLevels from '../[views]/BaitSkillQuizLevels';
import BaitSkillQuiz from '../[views]/BaitSkillQuiz';
import BaitSkillRewards from '../[views]/BaitSkillRewards';

const Stack = createNativeStackNavigator();

const BaitSkillStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="BaitSkillLoader" component={BaitSkillLoader} />
      <Stack.Screen name="BaitSkillIntroduce" component={BaitSkillIntroduce} />
      <Stack.Screen name="BaitSkillHome" component={BaitSkillHome} />
      <Stack.Screen
        name="BaitSkillFishingTips"
        component={BaitSkillFishingTips}
      />
      <Stack.Screen name="BaitSkillSavedTips" component={BaitSkillSavedTips} />
      <Stack.Screen
        name="BaitSkillQuizLevels"
        component={BaitSkillQuizLevels}
      />
      <Stack.Screen name="BaitSkillQuiz" component={BaitSkillQuiz} />
      <Stack.Screen name="BaitSkillRewards" component={BaitSkillRewards} />
    </Stack.Navigator>
  );
};

export default BaitSkillStackNavigator;
