import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Share,
  useWindowDimensions,
} from 'react-native';
import { useStore } from '../skillsplashstore/baitSkillContext';
import BaitSkillGradientButton from '../splashcomponents/BaitSkillGradientButton';

const font = 'Nunito-ExtraBold';
const backColor = '#004F6F';

const SkillSavedTips = () => {
  const router = useNavigation();
  const { getSavedTips, savedTips, handleRemoveBaitTip } = useStore();
  const { height } = useWindowDimensions();

  useEffect(() => {
    getSavedTips();
  }, []);

  const handleShareBaitTip = async tip => {
    try {
      await Share.share({
        message: tip,
        title: 'Fishing Tip',
      });

      console.log('shared!!');
    } catch (error) {
      console.warn(error);
    }
  };

  const handleGoToFishingTips = () => {
    router.navigate('BaitSkillFishingTips');
  };

  return (
    <View style={{ flex: 1, backgroundColor: backColor }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.baitSkillScrollView}
      >
        <View style={[styles.baitSkillWrap, { paddingTop: height * 0.06 }]}>
          <View style={styles.baitSkillHeader}>
            <TouchableOpacity
              onPress={() => router.goBack()}
              activeOpacity={0.8}
            >
              <Image
                source={require('../assets/baitSkillImages/baitSkillBackArr.png')}
              />
            </TouchableOpacity>

            <Image
              source={require('../assets/baitSkillImages/baitSkillSavedTitle.png')}
            />
          </View>

          {savedTips && savedTips.length > 0 ? (
            savedTips.map((tip, idx) => (
              <View key={`${idx}-${tip}`} style={styles.baitSkillTipContainer}>
                <Image
                  source={require('../assets/baitSkillImages/baitSkillFish.png')}
                />
                <Text style={styles.baitSkillText}>{tip}</Text>

                <View style={styles.baitSkillButtonsWrap}>
                  <TouchableOpacity
                    onPress={() => handleShareBaitTip(tip)}
                    activeOpacity={0.8}
                  >
                    <Image
                      source={require('../assets/baitSkillImages/baitSkillShare.png')}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handleRemoveBaitTip(tip)}
                    activeOpacity={0.8}
                  >
                    <Image
                      source={require('../assets/baitSkillImages/baitSkillIsSvd.png')}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <View
              style={{ alignItems: 'center', marginTop: 80, width: '100%' }}
            >
              <Text
                style={{
                  color: '#FFFFFF',
                  fontSize: 24,
                  fontWeight: '500',
                  marginBottom: 100,
                }}
              >
                You have no saved tips.
              </Text>

              <BaitSkillGradientButton
                onButtonPress={handleGoToFishingTips}
                buttonLabel="Fishing Tips"
                buttonWidth={'50%'}
              />
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  baitSkillWrap: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 74,
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
    marginBottom: 60,
  },
  baitSkillText: {
    color: '#000000',
    fontSize: 16,
    fontFamily: font,
    textAlign: 'center',
    marginTop: 10,
  },
  baitSkillTipContainer: {
    alignItems: 'center',
    backgroundColor: '#FEF4D1',
    borderRadius: 24,
    padding: 20,
    paddingHorizontal: 10,
    width: '75%',
    gap: 10,
    borderWidth: 1,
    borderColor: '#00111C',
    borderStyle: 'dashed',
    minHeight: 320,
    marginBottom: 22,
  },
  baitSkillButtonsWrap: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
    flex: 1,
    alignItems: 'flex-end',
  },
});

export default SkillSavedTips;
