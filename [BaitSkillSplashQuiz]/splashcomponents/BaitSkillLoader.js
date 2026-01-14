import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { View, StyleSheet, Image, ImageBackground } from 'react-native';
import { WebView } from 'react-native-webview';
import { htmlspinner } from '../skillsplashconstants/htmlspinner';

const BaitSkillLoader = () => {
  const navigation = useNavigation();

  useEffect(() => {
    setTimeout(() => {
      navigation.replace('SkillIntroduce');

      console.log('nav1');
    }, 4000);
  }, []);

  return (
    <ImageBackground
      source={require('../assets/baitSkillImages/baitSkillback.png')}
      style={{ flex: 1 }}
    >
      <View style={styles.imageWrap}>
        <Image source={require('../assets/baitSkillImages/baitSkillLg.png')} />
      </View>

      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <WebView
          originWhitelist={['*']}
          source={{ html: htmlspinner }}
          style={styles.webView}
          scrollEnabled={false}
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  imageWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  webView: {
    width: 360,
    height: 120,
    backgroundColor: 'transparent',
  },
});

export default BaitSkillLoader;
