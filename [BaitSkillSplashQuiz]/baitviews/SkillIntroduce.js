import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const backgroundColor = '#0A6064';
const primaryColorFff = '#fff';
const primaryOrange = '#FD7701';

// onboard screens data =>

const introduceScreens = [
  {
    baitSkillTitle: 'WELCOME TO BAIT SKILL',
    baitSkillSubtitle: 'Think you really know fishing? Let’s check.',
    baitSkillImage: require('../assets/baitSkillImages/baitSkillIntro1.png'),
  },
  {
    baitSkillTitle: 'NAME IT RIGHT',
    baitSkillSubtitle: 'Look at the image. Pick 1 correct answer out of 4.',
    baitSkillImage: require('../assets/baitSkillImages/baitSkillIntro2.png'),
  },
  {
    baitSkillTitle: 'SKILL EARNS REWARDS',
    baitSkillSubtitle: '6 levels. 1 reward for each.',
    baitSkillImage: require('../assets/baitSkillImages/baitSkillIntro3.png'),
  },
  {
    baitSkillTitle: 'FISHING TIPS FROM A PRO',
    baitSkillSubtitle: 'Learn real tricks. Save the best ones.',
    baitSkillImage: require('../assets/baitSkillImages/baitSkillIntro4.png'),
  },
];

const SkillIntroduce = () => {
  const [introduceIndex, setIntroduceIndex] = useState(0);
  const router = useNavigation();

  const onNextButtonPress = () => {
    introduceIndex < 3
      ? setIntroduceIndex(introduceIndex + 1)
      : router.navigate('SkillSplashHome');
  };

  const onSkipButtonPress = () => {
    router.navigate('SkillSplashHome');
  };

  return (
    <View style={{ flex: 1, backgroundColor: backgroundColor }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={ui.baitSkillScrollView}
        bounces={false}
      >
        <View style={ui.baitSkillWrap}>
          <View style={{ width: '100%' }}>
            <Image
              source={introduceScreens[introduceIndex].baitSkillImage}
              style={ui.baitSkillImage}
            />
            <LinearGradient
              colors={['#0A606400', '#0A6064']}
              style={ui.baitSkillGradient}
            />
          </View>

          <View style={{ width: '100%', alignItems: 'center', top: -30 }}>
            <Text style={ui.baitSkillTitle}>
              {introduceScreens[introduceIndex].baitSkillTitle}
            </Text>
            <Text style={ui.baitSkillSecondaryTitle}>
              {introduceScreens[introduceIndex].baitSkillSubtitle}
            </Text>

            <TouchableOpacity
              style={ui.baitSkillButton}
              onPress={onNextButtonPress}
              activeOpacity={0.8}
            >
              <Text style={ui.baitSkillButtonText}>
                {introduceIndex < 3 ? 'NEXT' : 'START'}
              </Text>
            </TouchableOpacity>

            {introduceIndex < 3 && (
              <TouchableOpacity
                style={ui.baitSkillSkipButton}
                onPress={onSkipButtonPress}
                activeOpacity={0.8}
              >
                <Text style={ui.baitSkillButtonText}>SKIP</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const ui = StyleSheet.create({
  baitSkillWrap: {
    flex: 1,
    alignItems: 'center',
  },
  baitSkillScrollView: {
    flexGrow: 1,
  },
  baitSkillImage: {
    width: '100%',
    resizeMode: 'stretch',
    position: 'relative',
  },
  baitSkillGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 80,
  },
  baitSkillTitle: {
    fontSize: 36,
    color: primaryColorFff,
    fontWeight: '800',
    textAlign: 'center',
    width: '70%',
  },
  baitSkillSecondaryTitle: {
    fontSize: 24,
    color: primaryColorFff,
    fontWeight: '500',
    marginTop: 10,
    textAlign: 'center',
    width: '70%',
  },
  baitSkillButton: {
    marginTop: 30,
    backgroundColor: primaryOrange,
    paddingVertical: 5,
    paddingHorizontal: 45,
    borderRadius: 9,
    minHeight: 43,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 157,
  },
  baitSkillButtonText: {
    color: primaryColorFff,
    fontSize: 24,
    fontWeight: '700',
    fontStyle: 'italic',
  },
  baitSkillSkipButton: {
    marginTop: 10,
    backgroundColor: 'transparent',
    paddingVertical: 5,
    paddingHorizontal: 45,
    borderRadius: 9,
    minHeight: 43,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 157,
  },
});

export default SkillIntroduce;
