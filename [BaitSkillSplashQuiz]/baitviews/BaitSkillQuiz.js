import React, { useEffect, useState, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Share,
  ImageBackground,
  useWindowDimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { baitSkillLevelsInfo } from '../splashquizdata/baitSkillLevelsInfo';
import LinearGradient from 'react-native-linear-gradient';
import { useStore } from '../skillsplashstore/baitSkillContext';
import Toast from 'react-native-toast-message';

const fontEB = 'Nunito-ExtraBold';
const fontB = 'Nunito-Bold';
const fontBlack = 'Nunito-Black';

const unlockedLevelsKey = 'quiz_unlocked_level';
const completedLevelsKey = 'quiz_completed_levels';
const rewardsKey = 'quiz_rewards';

const BaitSkillQuiz = () => {
  // states =>
  const { width, height } = useWindowDimensions();
  const navigation = useNavigation();
  const [screen, setScreen] = useState('levels');
  const [unlockedLevel, setUnlockedLevel] = useState(1);
  const [completed, setCompleted] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [selectedLevelIndex, setSelectedLevelIndex] = useState(0);
  const [qIndex, setQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(-1);
  const [disabled, setDisabled] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const timerRef = useRef(null);
  const { splashNotificationsEnabled } = useStore();
  // share =>

  const handleShareQuizRes = async () => {
    try {
      const level = baitSkillLevelsInfo[selectedLevelIndex];

      const shrMessage = `I scored ${correctCount} / ${level.baitskillquestions.length} on "${level.baitskilltitle}"`;

      await Share.share({ message: shrMessage, title: 'Quiz result' });

      console.log('shared!!');
    } catch (e) {
      console.warn('err!');
    }
  };

  // effect =>

  useEffect(() => {
    (async () => {
      try {
        const unlocked = await AsyncStorage.getItem(unlockedLevelsKey);

        const compl = await AsyncStorage.getItem(completedLevelsKey);

        const rewardsData = await AsyncStorage.getItem(rewardsKey);
        if (unlocked) {
          const num = parseInt(unlocked, 10);
          if (!isNaN(num))
            setUnlockedLevel(
              Math.min(Math.max(num, 1), baitSkillLevelsInfo.length),
            );

          console.log('is unlocked!');
        }
        if (compl) {
          const parsedJON = JSON.parse(compl);
          if (parsedJON != null && Array.isArray(parsedJON))
            setCompleted(parsedJON.slice(0, baitSkillLevelsInfo.length));
        } else {
          setCompleted(new Array(baitSkillLevelsInfo.length).fill(false));
        }
        if (rewardsData) {
          const parsedR = JSON.parse(rewardsData);

          if (parsedR != null && Array.isArray(parsedR))
            setRewards(parsedR.slice(0, baitSkillLevelsInfo.length));
        } else {
          setRewards(new Array(baitSkillLevelsInfo.length).fill(false));
        }
        if (unlocked) {
          const num = parseInt(unlocked, 10);

          if (!isNaN(num))
            setSelectedLevelIndex(
              Math.min(Math.max(num - 1, 0), baitSkillLevelsInfo.length - 1),
            );
        } else {
          setSelectedLevelIndex(0);
        }
      } catch (e) {
        setCompleted(new Array(baitSkillLevelsInfo.length).fill(false));

        setRewards(new Array(baitSkillLevelsInfo.length).fill(false));

        setSelectedLevelIndex(0);
      }
    })();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // foo =>

  const prsstBaitState = async (newUnlocked, newCompleted, newRewards) => {
    try {
      if (typeof newUnlocked === 'number')
        await AsyncStorage.setItem(unlockedLevelsKey, String(newUnlocked));

      if (Array.isArray(newCompleted))
        await AsyncStorage.setItem(
          completedLevelsKey,
          JSON.stringify(newCompleted),
        );

      if (Array.isArray(newRewards))
        await AsyncStorage.setItem(rewardsKey, JSON.stringify(newRewards));
    } catch (e) {
      console.warn('err!');
    }
  };

  const chooseBaitSkillLevel = selIDX => {
    if (selIDX + 1 <= unlockedLevel) {
      setSelectedLevelIndex(selIDX);
    }
  };

  const startSelectedLevel = idx => {
    const target = typeof idx === 'number' ? idx : selectedLevelIndex;
    if (target + 1 <= unlockedLevel) {
      setSelectedLevelIndex(target);

      setQIndex(0);

      setSelectedOption(-1);

      setDisabled(false);

      setCorrectCount(0);

      setScreen('quiz');
    }
  };

  const chooseBaitSkillOption = idx => {
    if (disabled) return;

    setSelectedOption(idx);

    setDisabled(true);
    const currentBaitQuizQuestion =
      baitSkillLevelsInfo[selectedLevelIndex].baitskillquestions[qIndex];
    const isCorrect = idx === currentBaitQuizQuestion.baitskillcorrectIndex;
    if (isCorrect) setCorrectCount(c => c + 1);
    timerRef.current = setTimeout(() => {
      const next = qIndex + 1;
      if (
        next < baitSkillLevelsInfo[selectedLevelIndex].baitskillquestions.length
      ) {
        setQIndex(next);
        setSelectedOption(-1);
        setDisabled(false);
      } else {
        completeBaitSkillQuiz();
      }
    }, 700);
  };

  const completeBaitSkillQuiz = async () => {
    const passedQuiz = correctCount >= 4;
    const newCompleted = [
      ...(completed.length
        ? completed
        : new Array(baitSkillLevelsInfo.length).fill(false)),
    ];
    const newBaitSkillRewards = [
      ...(rewards.length
        ? rewards
        : new Array(baitSkillLevelsInfo.length).fill(false)),
    ];
    newCompleted[selectedLevelIndex] = passedQuiz;
    if (passedQuiz) newBaitSkillRewards[selectedLevelIndex] = true;
    let newUnlocked = unlockedLevel;
    if (passedQuiz) {
      const nextLevel = Math.min(
        baitSkillLevelsInfo.length,
        selectedLevelIndex + 2,
      );
      if (nextLevel > newUnlocked) newUnlocked = nextLevel;
    }
    setCompleted(newCompleted);

    setRewards(newBaitSkillRewards);

    setUnlockedLevel(newUnlocked);

    splashNotificationsEnabled &&
      Toast.show({
        type: passedQuiz ? 'success' : 'error',
        text1: passedQuiz ? 'Level completed!' : 'Level failed!',
        text2: passedQuiz
          ? 'Congratulations on completing the level!'
          : 'Better luck next time!',
        position: 'bottom',
        visibilityTime: 2000,
      });

    await prsstBaitState(newUnlocked, newCompleted, newBaitSkillRewards);
    setScreen('result');
  };

  const handleTryAgain = () => {
    setQIndex(0);
    setSelectedOption(-1);
    setDisabled(false);
    setCorrectCount(0);
    setScreen('quiz');
  };

  const handleResultNext = () => {
    const nextLevel = selectedLevelIndex + 1;
    if (
      nextLevel < baitSkillLevelsInfo.length &&
      nextLevel + 1 <= unlockedLevel
    ) {
      startSelectedLevel(nextLevel);
    } else if (
      nextLevel < baitSkillLevelsInfo.length &&
      nextLevel + 1 > unlockedLevel
    ) {
      startSelectedLevel(nextLevel);
    } else {
      setScreen('levels');
    }
  };

  // levels screen =>

  const baitLevelsScreen = () => (
    <LinearGradient colors={['#056085ff', '#012c45ff']} style={{ flex: 1 }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          sty.baitskillscroll,
          { paddingTop: height * 0.07 },
        ]}
      >
        <View style={[sty.headerWrap]}>
          <TouchableOpacity
            onPress={() => navigation.goBack && navigation.goBack()}
            activeOpacity={0.8}
          >
            <Image
              source={require('../assets/baitSkillImages/baitSkillBackArr.png')}
            />
          </TouchableOpacity>
          <Image
            source={require('../assets/baitSkillImages/baitSkillQuizTitle.png')}
          />
        </View>

        <View style={sty.listWrap}>
          {baitSkillLevelsInfo.map((lvl, lsIdx) => {
            const isUnlocked = lsIdx + 1 <= unlockedLevel;
            const isCompleted = !!completed[lsIdx];

            let boxColor = '#FF8A00';
            if (isCompleted) boxColor = '#67B84A';
            if (!isUnlocked) boxColor = '#FF8A00';
            if (lsIdx === selectedLevelIndex) boxColor = '#C9422F';

            return (
              <TouchableOpacity
                key={lvl.id}
                style={sty.levelRow}
                onPress={() => chooseBaitSkillLevel(lsIdx)}
                disabled={!isUnlocked}
                activeOpacity={1}
              >
                <View style={[sty.numberBox, { backgroundColor: boxColor }]}>
                  <Text style={sty.numberText}>{lvl.id}</Text>
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={[sty.levelTitle]}>{lvl.baitskilltitle}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={sty.startWrap}>
          <TouchableOpacity
            style={sty.startButton}
            activeOpacity={0.85}
            onPress={() => startSelectedLevel(selectedLevelIndex)}
            disabled={selectedLevelIndex + 1 > unlockedLevel}
          >
            <Text style={sty.startButtonText}>
              Start level {selectedLevelIndex + 1}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );

  const currentBaitQuizLevel = baitSkillLevelsInfo[selectedLevelIndex];
  const currentBaitQuizQuestion =
    currentBaitQuizLevel && currentBaitQuizLevel.baitskillquestions[qIndex];

  // game screen =>

  const baitQuizScreen = () => (
    <ImageBackground
      source={require('../assets/baitSkillImages/quizGameBg.png')}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingTop: height * 0.06 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={sty.header}>
          <TouchableOpacity
            onPress={() => setScreen('levels')}
            activeOpacity={0.8}
          >
            <Image
              source={require('../assets/baitSkillImages/baitSkillBackArr.png')}
            />
          </TouchableOpacity>
          <Text style={sty.title}>{currentBaitQuizLevel?.baitskilltitle}</Text>
        </View>
        <View style={[sty.cardWrap, { marginTop: height * 0.02 }]}>
          <Image
            source={currentBaitQuizQuestion.baitskillimage}
            style={sty.questionImage}
          />

          <Text style={sty.questionText}>
            {currentBaitQuizQuestion.baitskillquestion}
          </Text>

          <View style={sty.optionsRow}>
            <TouchableOpacity
              style={[
                sty.optionButton,
                selectedOption === 0 &&
                  (0 === currentBaitQuizQuestion.baitskillcorrectIndex
                    ? sty.correct
                    : sty.wrong),
              ]}
              onPress={() => chooseBaitSkillOption(0)}
              activeOpacity={0.85}
            >
              <Text style={sty.optionText}>
                {currentBaitQuizQuestion.baitskilloptions[0]}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                sty.optionButton,
                selectedOption === 1 &&
                  (1 === currentBaitQuizQuestion.baitskillcorrectIndex
                    ? sty.correct
                    : sty.wrong),
              ]}
              onPress={() => chooseBaitSkillOption(1)}
              activeOpacity={0.85}
            >
              <Text style={sty.optionText}>
                {currentBaitQuizQuestion.baitskilloptions[1]}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={sty.optionsRow}>
            <TouchableOpacity
              style={[
                sty.optionButton,
                selectedOption === 2 &&
                  (2 === currentBaitQuizQuestion.baitskillcorrectIndex
                    ? sty.correct
                    : sty.wrong),
              ]}
              onPress={() => chooseBaitSkillOption(2)}
              activeOpacity={0.85}
            >
              <Text style={sty.optionText}>
                {currentBaitQuizQuestion.baitskilloptions[2]}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                sty.optionButton,
                selectedOption === 3 &&
                  (3 === currentBaitQuizQuestion.baitskillcorrectIndex
                    ? sty.correct
                    : sty.wrong),
              ]}
              onPress={() => chooseBaitSkillOption(3)}
              activeOpacity={0.85}
            >
              <Text style={sty.optionText}>
                {currentBaitQuizQuestion.baitskilloptions[3]}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={sty.footer}>
          <Image source={require('../assets/baitSkillImages/quizFish.png')} />
        </View>
      </ScrollView>
    </ImageBackground>
  );

  // res =>

  const baitResultScreen = () => {
    const passed = !!completed[selectedLevelIndex];
    return (
      <View style={{ flex: 1, backgroundColor: '#004F6F' }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            sty.baitskillscroll,
            { paddingTop: height * 0.06 },
          ]}
        >
          <View style={[sty.container, { paddingTop: height * 0.04 }]}>
            {passed ? (
              <>
                <View>
                  <Image
                    source={require('../assets/baitSkillImages/resultBack.png')}
                    style={{ position: 'absolute', left: -50 }}
                  />
                  <Image
                    source={require('../assets/baitSkillImages/succssesFisher.png')}
                    style={sty.hero}
                  />
                </View>
                <Image
                  source={require('../assets/baitSkillImages/goodResText.png')}
                  style={{ marginTop: 20 }}
                />
                <Text style={[sty.resultSub, { marginBottom: height * 0.02 }]}>
                  You’re one step closer to mastering fishing.
                </Text>

                <View style={sty.actions}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={sty.secondaryBtn}
                    onPress={handleResultNext}
                  >
                    <Text style={sty.primaryText}>Next Level</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={sty.secondaryBtn}
                    onPress={handleShareQuizRes}
                  >
                    <Text style={sty.secondaryText}>Share</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={sty.secondaryBtn}
                    onPress={() => setScreen('levels')}
                  >
                    <Text style={sty.secondaryText}>Home</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                <View>
                  <Image
                    source={require('../assets/baitSkillImages/resultBack.png')}
                    style={{ position: 'absolute', left: -50 }}
                  />
                  <Image
                    source={require('../assets/baitSkillImages/unluckyFisher.png')}
                    style={sty.hero}
                  />
                </View>
                <Image
                  source={require('../assets/baitSkillImages/badResText.png')}
                  style={{ marginTop: 20 }}
                />
                <Text style={sty.failSub}>Learn the basics and try again.</Text>

                <View style={sty.actions}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={sty.secondaryBtn}
                    onPress={handleTryAgain}
                  >
                    <Text style={sty.primaryText}>Try Again</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={sty.secondaryBtn}
                    onPress={handleShareQuizRes}
                  >
                    <Text style={sty.secondaryText}>Share</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={sty.secondaryBtn}
                    onPress={() => setScreen('levels')}
                  >
                    <Text style={sty.secondaryText}>Home</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </ScrollView>
      </View>
    );
  };

  return screen === 'levels'
    ? baitLevelsScreen()
    : screen === 'quiz'
    ? baitQuizScreen()
    : baitResultScreen();
};

const sty = StyleSheet.create({
  baitskillscroll: {
    paddingTop: 74,
    alignItems: 'center',
    paddingBottom: 40,
    minHeight: 600,
  },
  headerWrap: {
    width: '85%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
    marginBottom: 28,
  },
  levelTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontFamily: fontBlack,
  },
  disabledText: { opacity: 0.5 },
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
    fontFamily: fontEB,
    fontSize: 32,
  },
  startWrap: {
    width: '85%',
    marginTop: 25,
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
    fontFamily: fontBlack,
    fontSize: 20,
  },
  header: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  title: {
    color: '#FFAA00',
    fontSize: 32,
    fontFamily: fontEB,
  },
  cardWrap: {
    marginTop: 20,
    marginHorizontal: 20,
    alignItems: 'center',
  },
  questionImage: {
    width: 270,
    height: 230,
    resizeMode: 'contain',
    marginTop: 50,
  },
  questionText: {
    marginTop: 18,
    fontSize: 32,
    fontFamily: fontEB,
    color: '#14243E',
    textAlign: 'center',
    marginBottom: 40,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
    width: '100%',
    justifyContent: 'center',
  },
  optionButton: {
    backgroundColor: '#88C3EB',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 4,
    width: '40%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionText: {
    fontFamily: fontEB,
    fontSize: 14,
    color: '#000',
    textAlign: 'center',
  },
  correct: { backgroundColor: '#67B84A' },
  wrong: { backgroundColor: '#C9422F' },
  footer: { marginTop: 46, alignItems: 'flex-end' },
  progressText: {
    color: '#00111C',
    fontFamily: fontB,
    marginBottom: 12,
  },
  footerButtons: { flexDirection: 'row', gap: 12 },
  shareBtn: {
    backgroundColor: '#FF8A00',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
  },
  shareText: { color: '#000', fontFamily: fontEB },
  quitBtn: {
    backgroundColor: '#FEF4D1',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#00111C',
  },
  quitText: { color: '#000', fontFamily: fontB },
  container: { paddingTop: 74, alignItems: 'center', paddingHorizontal: 20 },
  hero: { resizeMode: 'contain', marginTop: 20 },
  resultTitle: {
    color: '#FFAA00',
    fontFamily: fontEB,
    fontSize: 28,
    textAlign: 'center',
    marginTop: 8,
  },
  resultSub: {
    color: '#FFFFFF',
    fontFamily: fontB,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 40,
  },
  failTitle: {
    color: '#FF8A00',
    fontFamily: fontEB,
    fontSize: 28,
    textAlign: 'center',
    marginTop: 8,
  },
  failSub: {
    color: '#FFFFFF',
    fontWeight: '500',
    fontSize: 24,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 40,
  },
  actions: {
    marginTop: 22,
    width: '100%',
    alignItems: 'center',
    gap: 12,
  },
  primaryText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 24,
    fontStyle: 'italic',
  },
  secondaryBtn: {
    backgroundColor: '#FD7701',
    width: 157,
    paddingVertical: 8,
    borderRadius: 9,
    alignItems: 'center',
    marginTop: 2,
  },
  secondaryText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 24,
    fontStyle: 'italic',
  },
});

export default BaitSkillQuiz;
