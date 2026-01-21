import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
  Alert,
  Linking,
  Platform,
  TouchableOpacity,
  Image,
  useWindowDimensions,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { useStore } from '../skillsplashstore/baitSkillContext';
import { baitSkillLevelsInfo } from '../splashquizdata/baitSkillLevelsInfo';
import LinearGradient from 'react-native-linear-gradient';

const SkillSettingsScreen = () => {
  const navigation = useNavigation();
  const {
    splashNotificationsEnabled,
    setSplashNotificationsEnabled,
    splashSoundEnabled,
    setSplashSoundEnabled,
  } = useStore();
  const { height } = useWindowDimensions();

  const [quizStats, setQuizStats] = useState({
    unlocked: 0,
    completed: 0,
    rewards: 0,
    total: baitSkillLevelsInfo.length,
  });

  useEffect(() => {
    const loadQuizStats = async () => {
      try {
        const unlocked = await AsyncStorage.getItem('quiz_unlocked_level');
        const completed = await AsyncStorage.getItem('quiz_completed_levels');
        const rewards = await AsyncStorage.getItem('quiz_rewards');

        const completedArr = completed ? JSON.parse(completed) : [];
        const rewardsArr = rewards ? JSON.parse(rewards) : [];

        setQuizStats({
          unlocked: unlocked ? Number(unlocked) : 0,
          completed: completedArr.filter(Boolean).length,
          rewards: rewardsArr.filter(Boolean).length,
          total: baitSkillLevelsInfo.length,
        });
      } catch (e) {
        console.warn('Failed to load quiz stats', e);
      }
    };

    loadQuizStats();
  }, []);

  const toggleNotifications = async selectedValue => {
    Toast.show({
      text1: !splashNotificationsEnabled
        ? 'Notifications turned on!'
        : 'Notifications turned off!',
    });

    try {
      await AsyncStorage.setItem(
        'toggleNotifications',
        JSON.stringify(selectedValue),
      );
      setSplashNotificationsEnabled(selectedValue);
    } catch (error) {
      console.log('Error', error);
    }
  };

  const toggleSound = async selectedValue => {
    splashNotificationsEnabled &&
      Toast.show({
        text1: !splashSoundEnabled
          ? 'Background music turned on!'
          : 'Background music turned off!',
      });

    try {
      await AsyncStorage.setItem('toggleSound', JSON.stringify(selectedValue));
      setSplashSoundEnabled(selectedValue);
    } catch (error) {
      console.log('Error', error);
    }
  };

  const handleResetProgress = () => {
    Alert.alert(
      'Reset Progress?',
      'This will reset quiz progress, rewards, and streaks. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.multiRemove([
                'GlyphEyeProgress_v1',
                'quiz_unlocked_level',
                'quiz_completed_levels',
                'quiz_rewards',
              ]);

              setQuizStats({
                unlocked: 0,
                completed: 0,
                rewards: 0,
                total: baitSkillLevelsInfo.length,
              });

              Toast.show({
                type: 'success',
                text1: 'All progress has been reset!',
              });
            } catch (err) {
              console.warn('Failed to reset progress', err);
            }
          },
        },
      ],
    );
  };

  return (
    <LinearGradient colors={['#056085ff', '#012c45ff']} style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.splashView, { paddingTop: height * 0.07 }]}>
          <View
            style={{
              width: '100%',
              alignItems: 'center',
              gap: 14,
            }}
          >
            <View
              style={[styles.baitSkillHeader, { marginBottom: height * 0.05 }]}
            >
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                activeOpacity={0.8}
              >
                <Image
                  source={require('../assets/baitSkillImages/baitSkillBackArr.png')}
                />
              </TouchableOpacity>

              <Text style={styles.baitSkillHeaderText}>Settings</Text>
            </View>

            <View style={styles.splashSettBox}>
              <Text style={styles.setBoxText}>Notifications</Text>
              <Switch
                thumbColor="#fff"
                trackColor={{ false: '#ccd1cfff', true: '#FD7701' }}
                value={splashNotificationsEnabled}
                onValueChange={toggleNotifications}
              />
            </View>

            {Platform.OS === 'ios' && (
              <View style={styles.splashSettBox}>
                <Text style={styles.setBoxText}>Background music</Text>
                <Switch
                  thumbColor="#fff"
                  trackColor={{ false: '#ccd1cfff', true: '#FD7701' }}
                  value={splashSoundEnabled}
                  onValueChange={toggleSound}
                />
              </View>
            )}

            <Pressable
              style={styles.splashSettBox}
              onPress={handleResetProgress}
            >
              <Text style={styles.setBoxText}>Reset progress</Text>
            </Pressable>

            {Platform.OS === 'ios' && (
              <Pressable
                style={styles.splashSettBox}
                onPress={() =>
                  Linking.openURL(
                    'https://apps.apple.com/us/app/bait-skill-splash-quiz/id6757817285',
                  )
                }
              >
                <Text style={styles.setBoxText}>Share App</Text>
              </Pressable>
            )}

            <View style={styles.quizStatsCard}>
              <Text style={styles.quizStatsTitle}>Quiz Statistics</Text>

              <View style={styles.quizStatsRow}>
                <Text style={styles.quizStatsLabel}>Completed</Text>
                <Text style={styles.quizStatsValue}>
                  {quizStats.completed}/{quizStats.total}
                </Text>
              </View>

              <View style={styles.quizStatsRow}>
                <Text style={styles.quizStatsLabel}>Unlocked</Text>
                <Text style={styles.quizStatsValue}>{quizStats.unlocked}</Text>
              </View>

              <View style={styles.quizStatsRow}>
                <Text style={styles.quizStatsLabel}>Rewards</Text>
                <Text style={styles.quizStatsValue}>{quizStats.rewards}</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  splashView: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 70,
    paddingBottom: 30,
  },
  baitSkillHeaderText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FD7701',
  },
  baitSkillHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 30,
    width: '85%',
    marginBottom: 60,
  },
  splashSettBox: {
    width: '90%',
    minHeight: 56,
    backgroundColor: '#FEF4D1',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  setBoxText: {
    fontWeight: '600',
    fontSize: 16,
    color: '#000',
  },
  quizSubText: {
    fontSize: 14,
    color: '#FFEAE1',
    marginTop: 2,
  },
  quizStatsCard: {
    width: '90%',
    backgroundColor: '#FEF4D1',
    borderRadius: 14,
    padding: 16,
    marginTop: 30,
    marginBottom: 10,
  },
  quizStatsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    marginBottom: 12,
    textAlign: 'center',
  },
  quizStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
    padding: 10,
    backgroundColor: '#88C3EB',
    borderRadius: 8,
  },

  quizStatsLabel: {
    fontSize: 16,
    color: '#000',
    fontWeight: '600',
  },

  quizStatsValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
});

export default SkillSettingsScreen;
