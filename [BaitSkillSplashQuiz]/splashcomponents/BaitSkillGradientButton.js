import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const buttonFont = 'Nunito-Black';
const gradientColors = ['#FD6201', '#FDD300', '#f87929ff'];

const BaitSkillGradientButton = ({
  onButtonPress,
  buttonLabel,
  buttonStyles,
  buttonWidth = '75%',
}) => {
  return (
    <TouchableOpacity
      onPress={onButtonPress}
      activeOpacity={0.8}
      style={{
        borderWidth: 3,
        borderColor: '#89c7ddff',
        borderRadius: 16,
        width: buttonWidth,
        ...buttonStyles,
      }}
    >
      <LinearGradient
        colors={gradientColors}
        style={s.baitSkillButton}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 2.4 }}
      >
        <Text style={s.baitSkillButtonText}>{buttonLabel}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const s = StyleSheet.create({
  baitSkillButton: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    height: 62,
  },
  baitSkillButtonText: {
    color: '#35251D',
    fontSize: 20,
    fontFamily: buttonFont,
  },
});

export default BaitSkillGradientButton;
