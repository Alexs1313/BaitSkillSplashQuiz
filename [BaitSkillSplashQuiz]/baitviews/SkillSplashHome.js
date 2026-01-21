import { useFocusEffect, useNavigation } from '@react-navigation/native';
import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import BaitSkillGradientButton from '../splashcomponents/BaitSkillGradientButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';
import Sound from 'react-native-sound';
import { useStore } from '../skillsplashstore/baitSkillContext';

const SkillSplashHome = () => {
  const router = useNavigation();

  const [splashMusIdx, setSplashMusIdx] = useState(0);
  const [sound, setSound] = useState(null);
  const baitSplashTracksCycle = [
    'lets-go-fishing-270521.mp3',
    'lets-go-fishing-270521.mp3',
  ];
  const {
    setSplashNotificationsEnabled,
    splashSoundEnabled,
    setSplashSoundEnabled,
  } = useStore();

  useFocusEffect(
    useCallback(() => {
      loadSplashBgMusic();
      loadSplashVibration();
    }, []),
  );

  useEffect(() => {
    playSplashMusic(splashMusIdx);

    return () => {
      if (sound) {
        sound.stop(() => {
          sound.release();
        });
      }
    };
  }, [splashMusIdx]);

  const playSplashMusic = index => {
    if (sound) {
      sound.stop(() => {
        sound.release();
      });
    }

    const splashTrackPath = baitSplashTracksCycle[index];

    const newSplashGameSound = new Sound(
      splashTrackPath,

      Sound.MAIN_BUNDLE,

      error => {
        if (error) {
          console.log('Error =>', error);
          return;
        }

        newSplashGameSound.play(success => {
          if (success) {
            setSplashMusIdx(
              prevIndex => (prevIndex + 1) % baitSplashTracksCycle.length,
            );
          } else {
            console.log('Error =>');
          }
        });
        setSound(newSplashGameSound);
      },
    );
  };

  useEffect(() => {
    const setVolumeGameMusic = async () => {
      try {
        const splashMusicValue = await AsyncStorage.getItem('toggleSound');

        const isSplashMusicOn = JSON.parse(splashMusicValue);
        setSplashSoundEnabled(isSplashMusicOn);
        if (sound) {
          sound.setVolume(isSplashMusicOn ? 1 : 0);
        }
      } catch (error) {
        console.error('Error =>', error);
      }
    };

    setVolumeGameMusic();
  }, [sound]);

  useEffect(() => {
    if (sound) {
      sound.setVolume(splashSoundEnabled ? 1 : 0);
    }
  }, [splashSoundEnabled]);

  const loadSplashVibration = async () => {
    try {
      const splashNotValue = await AsyncStorage.getItem('toggleNotifications');
      if (splashNotValue !== null) {
        const isSplashVibrationOn = JSON.parse(splashNotValue);
        setSplashNotificationsEnabled(isSplashVibrationOn);
      }
    } catch (error) {
      console.error('Error!', error);
    }
  };

  const loadSplashBgMusic = async () => {
    try {
      const splashMusicValue = await AsyncStorage.getItem('toggleSound');
      const isSplashMusicOn = JSON.parse(splashMusicValue);
      setSplashSoundEnabled(isSplashMusicOn);
    } catch (error) {
      console.error('Error loading settings =>', error);
    }
  };

  return (
    <ImageBackground
      source={require('../assets/baitSkillImages/baitSkillback.png')}
      style={{ flex: 1 }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.baitSkillScrollView}
      >
        <View style={styles.baitSkillWrap}>
          <Image
            source={require('../assets/baitSkillImages/baitSkillFisher.png')}
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
            onButtonPress={() => router.navigate('SkillSavedTips')}
            buttonLabel="Saved Tips"
            buttonStyles={styles.baitSkillBtnMarg}
          />
          <BaitSkillGradientButton
            onButtonPress={() => router.navigate('SkillSettingsScreen')}
            buttonLabel="Settings"
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

export default SkillSplashHome;
