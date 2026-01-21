import { createNativeStackNavigator } from '@react-navigation/native-stack';

import BaitSkillLoader from '../splashcomponents/BaitSkillLoader';
import BaitSkillFishingTips from '../baitviews/BaitSkillFishingTips';
import BaitSkillQuiz from '../baitviews/BaitSkillQuiz';
import BaitSkillRewards from '../baitviews/BaitSkillRewards';
import SkillSavedTips from '../baitviews/SkillSavedTips';
import SkillIntroduce from '../baitviews/SkillIntroduce';
import SkillSplashHome from '../baitviews/SkillSplashHome';
import SkillSettingsScreen from '../baitviews/SkillSettingsScreen';

const Stack = createNativeStackNavigator();

const BaitSkillStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="BaitSkillLoader" component={BaitSkillLoader} />
      <Stack.Screen name="SkillIntroduce" component={SkillIntroduce} />
      <Stack.Screen name="SkillSplashHome" component={SkillSplashHome} />
      <Stack.Screen
        name="BaitSkillFishingTips"
        component={BaitSkillFishingTips}
      />
      <Stack.Screen name="SkillSavedTips" component={SkillSavedTips} />
      <Stack.Screen name="BaitSkillQuiz" component={BaitSkillQuiz} />
      <Stack.Screen name="BaitSkillRewards" component={BaitSkillRewards} />
      <Stack.Screen
        name="SkillSettingsScreen"
        component={SkillSettingsScreen}
      />
    </Stack.Navigator>
  );
};

export default BaitSkillStackNavigator;
