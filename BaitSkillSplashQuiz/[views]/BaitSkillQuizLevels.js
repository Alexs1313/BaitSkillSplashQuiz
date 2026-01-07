import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY_UNLOCKED = 'quiz_unlocked_level';
const STORAGE_KEY_COMPLETED = 'quiz_completed_levels';

const levels = [
  { id: 1, title: 'Fishing Basics' },
  { id: 2, title: 'Hooks & Sinkers' },
  { id: 3, title: 'Lures & Baits' },
  { id: 4, title: 'Fish Species' },
  { id: 5, title: 'Gear & Techniques' },
];

const BaitSkillQuizLevels = () => {
  const navigation = useNavigation();
  const [unlockedLevel, setUnlockedLevel] = useState(1); // 1-based
  const [completed, setCompleted] = useState([]); // boolean array, 0-based
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const rawUnlocked = await AsyncStorage.getItem(STORAGE_KEY_UNLOCKED);
        const rawCompleted = await AsyncStorage.getItem(STORAGE_KEY_COMPLETED);

        if (rawUnlocked) {
          const num = parseInt(rawUnlocked, 10);
          if (!isNaN(num) && num >= 1)
            setUnlockedLevel(Math.min(num, levels.length));
        }

        if (rawCompleted) {
          const parsed = JSON.parse(rawCompleted);
          if (Array.isArray(parsed)) {
            setCompleted(parsed.slice(0, levels.length));
          }
        }
      } catch (e) {
        // ignore
      }
    })();
  }, []);

  const persistUnlocked = async newUnlocked => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY_UNLOCKED, String(newUnlocked));
    } catch (e) {}
  };

  const persistCompleted = async newCompleted => {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEY_COMPLETED,
        JSON.stringify(newCompleted),
      );
    } catch (e) {}
  };

  const handleSelect = idx => {
    // allow selecting only up to unlockedLevel
    if (idx + 1 <= unlockedLevel) {
      setSelectedIndex(idx);
    }
  };

  const handleStart = () => {
    const levelNumber = selectedIndex + 1;
    navigation.navigate &&
      navigation.navigate('BaitSkillQuiz', { level: levelNumber });
  };

  // Helper to mark a level complete and unlock next (can be used from quiz result)
  // Not wired to UI here, but exported to AsyncStorage for other screens to call if needed.
  const markLevelComplete = async idx => {
    const newCompleted = [...completed];
    newCompleted[idx] = true;
    setCompleted(newCompleted);
    await persistCompleted(newCompleted);

    const next = idx + 2; // next level number
    if (next > unlockedLevel && next <= levels.length) {
      setUnlockedLevel(next);
      await persistUnlocked(next);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerWrap}>
          <TouchableOpacity
            onPress={() => navigation.goBack && navigation.goBack()}
            activeOpacity={0.8}
          >
            <Image
              source={require('../../assets/baitSkillImages/baitSkillBackArr.png')}
            />
          </TouchableOpacity>
          <Image
            source={require('../../assets/baitSkillImages/baitSkillQuizTitle.png')}
          />
        </View>

        <View style={styles.listWrap}>
          {levels.map((lvl, idx) => {
            const isUnlocked = idx + 1 <= unlockedLevel;
            const isCompleted = !!completed[idx];
            const isSelected = selectedIndex === idx;

            let boxColor = styles.boxOrange.backgroundColor;
            if (isCompleted) boxColor = styles.boxGreen.backgroundColor;
            if (isSelected) boxColor = styles.boxRed.backgroundColor;
            if (!isUnlocked) boxColor = styles.boxDisabled.backgroundColor;

            return (
              <TouchableOpacity
                key={lvl.id}
                style={styles.levelRow}
                activeOpacity={0.85}
                onPress={() => handleSelect(idx)}
                disabled={!isUnlocked}
              >
                <View style={[styles.numberBox, { backgroundColor: boxColor }]}>
                  <Text style={styles.numberText}>{lvl.id}</Text>
                </View>

                <Text
                  style={[
                    styles.levelTitle,
                    !isUnlocked && styles.disabledText,
                  ]}
                >
                  {lvl.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.startWrap}>
          <TouchableOpacity
            style={styles.startButton}
            activeOpacity={0.85}
            onPress={handleStart}
          >
            <Text style={styles.startButtonText}>
              Start level {selectedIndex + 1}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#004F6F' },
  scroll: {
    paddingTop: 74,
    alignItems: 'center',
    paddingBottom: 60,
    flexGrow: 1,
  },
  headerWrap: {
    width: '85%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
    marginBottom: 28,
  },

  listWrap: { width: '80%', marginTop: 8 },
  levelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginVertical: 14,
  },
  numberBox: {
    width: 60,
    height: 60,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#A9BDC4',
  },
  numberText: {
    color: '#000',
    fontFamily: 'Nunito-ExtraBold',
    fontSize: 32,
  },
  levelTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontFamily: 'Nunito-Black',
  },
  startWrap: {
    flex: 1,
    justifyContent: 'flex-end',
    width: '85%',
    marginTop: 55,
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: '#D3341F',
    width: '80%',
    paddingVertical: 12,
    borderRadius: 9,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#A9BDC4',
  },
  startButtonText: {
    color: '#000',
    fontFamily: 'Nunito-Black',
    fontSize: 20,
  },

  // palette variants
  boxOrange: { backgroundColor: '#FD7701' },
  boxRed: { backgroundColor: '#D3341F' },
  boxGreen: { backgroundColor: '#64B31E' },
  boxDisabled: { backgroundColor: '#FD7701' },
});

export default BaitSkillQuizLevels;
