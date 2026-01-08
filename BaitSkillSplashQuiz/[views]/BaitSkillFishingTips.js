import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Share,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useStore } from '../[store]/baitSkillContext';

const BaitSkillFishingTips = () => {
  const router = useNavigation();
  const [currentBaitTipIndex, setCurrentBaitTipIndex] = useState(0);
  const { getSavedTips, savedTips, setSavedTips } = useStore();

  useEffect(() => {
    getSavedTips();
  }, []);

  const fishingTips = [
    'Match the bait color to water clarity\nClear water → natural colors.\nMurky water → bright colors.',
    'Check your hook sharpness every trip\nA dull hook loses fish.',
    'Use lighter line when fish are cautious\nSmaller line = more bites.',
    'Cast beyond your target area\nRetrieve through the strike zone.',
    'Fish early morning or late evening\nThat’s when fish are most active.',
    'Slow down in cold water\nFish move less — your bait should too.',
    'Change bait if there’s no action in 15 minutes\nWaiting longer rarely helps.',
    'Use scent when fish are pressured\nIt can trigger extra bites.',
    'Watch the wind direction\nWind pushes food — fish follow it.',
    'Keep your drag properly set\nToo tight breaks the line, too loose loses fish.',
    'Hide the hook in soft baits\nImproves hook-up rate and looks more natural.',
    'Don’t overlook structure\nRocks, logs, and weeds hold fish.',
    'Downsize your tackle when bites are rare\nSmaller often works better.',
    'Stay quiet near shallow water\nFish feel vibrations.',
    'Retie your knot after every few fish\nOne weak knot can ruin the day.',
  ];

  const currentTip = fishingTips[currentBaitTipIndex];

  const handleNextBaitTip = () => {
    setCurrentBaitTipIndex(prevTip => (prevTip + 1) % fishingTips.length);
  };

  const handleShareBaitTip = async () => {
    try {
      await Share.share({
        message: currentTip,
        title: 'Fishing Tip',
      });

      console.log('shared!');
    } catch (error) {
      console.log(error);
    }
  };

  const toggleSaveBaitTips = async () => {
    try {
      const isExistsTip = savedTips.includes(currentTip);

      const updatedTips = isExistsTip
        ? savedTips.filter(tip => tip !== currentTip)
        : [...savedTips, currentTip];

      setSavedTips(updatedTips);

      console.log('saved!');

      await AsyncStorage.setItem(
        'storage_saved_bait_tips',
        JSON.stringify(updatedTips),
      );
    } catch (error) {
      console.log(error);
    }
  };

  const isSavedTip = savedTips.includes(currentTip);

  return (
    <View style={{ flex: 1, backgroundColor: '#004F6F' }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.baitSkillScrollView}
      >
        <View style={styles.baitSkillWrap}>
          <View style={styles.baitSkillHeader}>
            <TouchableOpacity
              onPress={() => router.goBack()}
              activeOpacity={0.8}
            >
              <Image
                source={require('../../assets/baitSkillImages/baitSkillBackArr.png')}
                style={{}}
              />
            </TouchableOpacity>

            <Image
              source={require('../../assets/baitSkillImages/baitSkillTitle.png')}
            />
          </View>

          <View style={styles.baitSkillTipContainer}>
            <Image
              source={require('../../assets/baitSkillImages/baitSkillFish.png')}
            />
            <Text style={styles.baitSkillText}>{currentTip}</Text>

            <View style={styles.baitSkillButtonsWrap}>
              <TouchableOpacity onPress={handleShareBaitTip}>
                <Image
                  source={require('../../assets/baitSkillImages/baitSkillShare.png')}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.baitSkillNextButton}
                onPress={handleNextBaitTip}
              >
                <Text style={styles.baitSkillNextButtonText}>Next</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={toggleSaveBaitTips}>
                <Image
                  source={
                    !isSavedTip
                      ? require('../../assets/baitSkillImages/baitSkillSaved.png')
                      : require('../../assets/baitSkillImages/baitSkillIsSvd.png')
                  }
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <Image
          source={require('../../assets/baitSkillImages/baitSkillTips.png')}
          style={{
            width: 250,
            height: 250,
          }}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  baitSkillWrap: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 54,
  },
  baitSkillScrollView: {
    flexGrow: 1,
    minHeight: 600,
  },
  baitSkillHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 30,
    width: '85%',
    marginBottom: 30,
  },
  baitSkillText: {
    color: '#000000',
    fontSize: 16,
    fontFamily: 'Nunito-ExtraBold',
    textAlign: 'center',
    marginTop: 10,
  },
  baitSkillTipContainer: {
    alignItems: 'center',
    backgroundColor: '#FEF4D1',
    borderRadius: 24,
    padding: 20,
    paddingHorizontal: 10,
    marginTop: 30,
    width: '80%',
    gap: 10,
    borderWidth: 1,
    borderColor: '#00111C',
    borderStyle: 'dashed',
    minHeight: 320,
  },
  baitSkillNextButton: {
    backgroundColor: '#88C3EB',
    borderRadius: 4,
    minHeight: 24,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 103,
    zIndex: 1,
  },
  baitSkillNextButtonText: {
    color: '#000',
    fontSize: 14,
    fontFamily: 'Nunito-Bold',
  },
  baitSkillButtonsWrap: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 10,
    flex: 1,
    alignItems: 'flex-end',
  },
});

export default BaitSkillFishingTips;
