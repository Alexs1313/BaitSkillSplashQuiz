import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { View, StyleSheet, Image, ImageBackground } from 'react-native';
import { WebView } from 'react-native-webview';

const baitSkillLoader = `
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<style>
  html, body {
    margin: 0;
    padding: 0;
    background: transparent;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
  }

  .loading-wave {
    width: 300px;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: flex-end;
  }

  .loading-bar {
    width: 20px;
    height: 10px;
    margin: 0 5px;
    background-color: #3498db;
    border-radius: 5px;
    animation: loading-wave-animation 1s ease-in-out infinite;
  }

  .loading-bar:nth-child(2) { animation-delay: 0.1s; }
  .loading-bar:nth-child(3) { animation-delay: 0.2s; }
  .loading-bar:nth-child(4) { animation-delay: 0.3s; }

  @keyframes loading-wave-animation {
    0% { height: 10px; }
    50% { height: 50px; }
    100% { height: 10px; }
  }
</style>
</head>
<body>
  <div class="loading-wave">
    <div class="loading-bar"></div>
    <div class="loading-bar"></div>
    <div class="loading-bar"></div>
    <div class="loading-bar"></div>
  </div>
</body>
</html>
`;

const BaitSkillLoader = () => {
  const navigation = useNavigation();

  useEffect(() => {
    setTimeout(() => {
      navigation.replace('BaitSkillIntroduce');
    }, 4000);
  }, []);

  return (
    <ImageBackground
      source={require('../../assets/baitSkillImages/baitSkillback.png')}
      style={{ flex: 1 }}
    >
      <View style={styles.imageWrap}>
        <Image
          source={require('../../assets/baitSkillImages/baitSkillLg.png')}
        />
      </View>

      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <WebView
          originWhitelist={['*']}
          source={{ html: baitSkillLoader }}
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
