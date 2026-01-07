import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useStore } from '../[store]/baitSkillContext';

const BaitSkillRewards = () => {
  const router = useNavigation();
  const { rewards, getSavedRewards } = useStore();

  useEffect(() => {
    getSavedRewards();
  }, []);

  const rewardsBaitPos = [
    { top: 20, left: 65, width: 63, height: 63 },
    { top: 92, left: 65, width: 63, height: 63 },
    { top: 170, left: 70, width: 55, height: 55 },
    { top: 240, left: 65, width: 68, height: 68 },
    { top: 319, left: 69, width: 59, height: 69 },
  ];

  const rewardsImgs = [
    require('../../assets/baitSkillImages/rewardLvl1.png'),
    require('../../assets/baitSkillImages/rewardLvl2.png'),
    require('../../assets/baitSkillImages/rewardLvl3.png'),
    require('../../assets/baitSkillImages/rewardLvl4.png'),
    require('../../assets/baitSkillImages/rewardLvl5.png'),
  ];

  return (
    <ImageBackground
      source={require('../../assets/baitSkillImages/storeBg.png')}
      style={{ flex: 1 }}
    >
      <View style={styles.baitSkillBox}>
        <ScrollView
          contentContainerStyle={styles.baitSkillScroll}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.baitSkillHeader}>
            <TouchableOpacity onPress={() => router.goBack()}>
              <Image
                source={require('../../assets/baitSkillImages/baitSkillBackArr.png')}
              />
            </TouchableOpacity>
            <Image
              source={require('../../assets/baitSkillImages/rewardsTitlte.png')}
            />
          </View>

          <View style={styles.baitSkillStage}>
            <ImageBackground
              source={require('../../assets/baitSkillImages/rewardShelf.png')}
              style={styles.baitSkillShelf}
              resizeMode="contain"
            >
              {rewardsBaitPos.map((pos, rewIdx) =>
                rewards[rewIdx] ? (
                  <Image
                    key={String(rewIdx)}
                    source={rewardsImgs[rewIdx]}
                    style={[
                      styles.baitSkillBadge,

                      {
                        top: pos.top,
                        left: pos.left,
                        width: pos.width,
                        height: pos.height,
                      },
                    ]}
                    resizeMode="contain"
                  />
                ) : null,
              )}
            </ImageBackground>

            <Image
              source={require('../../assets/baitSkillImages/rewardChar.png')}
              style={styles.baitSkillChar}
              resizeMode="contain"
            />
          </View>
        </ScrollView>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  baitSkillBox: { flex: 1 },
  baitSkillScroll: {
    paddingTop: 74,
    alignItems: 'center',
    paddingBottom: 40,
    minHeight: 700,
  },
  baitSkillHeader: {
    width: '85%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 8,
  },
  baitSkillStage: {
    marginTop: 100,
    alignSelf: 'flex-start',
  },
  baitSkillShelf: {
    width: 184,
    height: 490,
    marginLeft: 30,
  },
  baitSkillBadge: { position: 'absolute' },
  baitSkillChar: {
    position: 'absolute',
    right: -160,
    bottom: 0,
  },
});

export default BaitSkillRewards;
