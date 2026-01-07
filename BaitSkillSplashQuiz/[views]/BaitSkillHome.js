import { useNavigation } from '@react-navigation/native';
import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import BaitSkillGradientButton from '../[components]/BaitSkillGradientButton';

const BaitSkillHome = () => {
  const router = useNavigation();

  return (
    <ImageBackground
      source={require('../../assets/baitSkillImages/baitSkillback.png')}
      style={{ flex: 1 }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.baitSkillScrollView}
      >
        <View style={styles.baitSkillWrap}>
          <Image
            source={require('../../assets/baitSkillImages/baitSkillFisher.png')}
          />

          <BaitSkillGradientButton
            onButtonPress={() => router.navigate('BaitSkillQuiz')}
            buttonLabel="Fishing Knowledge Quiz"
          />
          <BaitSkillGradientButton
            onButtonPress={() => router.navigate('BaitSkillFishingTips')}
            buttonLabel="Fishing Tips"
            buttonStyles={styles.baitSkillBtnMarg}
          />
          <BaitSkillGradientButton
            onButtonPress={() => router.navigate('BaitSkillRewards')}
            buttonLabel="Rewards"
            buttonStyles={styles.baitSkillBtnMarg}
          />
          <BaitSkillGradientButton
            onButtonPress={() => router.navigate('BaitSkillSavedTips')}
            buttonLabel="Saved Tips"
            buttonStyles={styles.baitSkillBtnMarg}
          />
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  baitSkillWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 35,
  },
  baitSkillScrollView: {
    flexGrow: 1,
  },
  baitSkillImage: {
    width: '100%',
    resizeMode: 'stretch',
    position: 'relative',
  },
  baitSkillBtnMarg: {
    marginTop: 14,
  },
});

export default BaitSkillHome;
