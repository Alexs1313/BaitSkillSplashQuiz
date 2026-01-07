import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useState } from 'react';

export const StoreContext = createContext();

export const useStore = () => {
  return useContext(StoreContext);
};

export const BaitSkillStore = ({ children }) => {
  const [savedTips, setSavedTips] = useState([]);
  const [rewards, setRewards] = useState([false, false, false, false, false]);

  const getSavedTips = async () => {
    try {
      const storedTips = await AsyncStorage.getItem('storage_saved_bait_tips');

      if (storedTips) {
        const parsedJSON = JSON.parse(storedTips);

        console.log('parsed');

        if (parsedJSON != null) {
          setSavedTips(parsedJSON);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemoveBaitTip = async tip => {
    try {
      const updatedTips = savedTips.filter(svTip => svTip !== tip);

      setSavedTips(updatedTips);
      console.log('removed!!');

      await AsyncStorage.setItem(
        'storage_saved_bait_tips',
        JSON.stringify(updatedTips),
      );
    } catch (error) {
      console.log(error);
    }
  };

  const getSavedRewards = async () => {
    try {
      const savedRewards = await AsyncStorage.getItem('quiz_rewards');
      if (savedRewards) {
        const parsedJSON = JSON.parse(savedRewards);

        if (parsedJSON != null) {
          const isNormalized = parsedJSON.slice(0, 5);
          while (isNormalized.length < 5) isNormalized.push(false);
          setRewards(isNormalized);
          return;
        }
      }
    } catch (e) {}
    setRewards([false, false, false, false, false]);
  };

  const value = {
    getSavedTips,
    savedTips,
    setSavedTips,
    handleRemoveBaitTip,
    rewards,
    getSavedRewards,
    setRewards,
  };

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
};
