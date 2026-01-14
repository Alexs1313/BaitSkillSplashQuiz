import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const buttonFont = 'Nunito-Black';
const gradientColors = ['#FD6201', '#FDD300'];

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
        borderColor: '#A9BDC4',
        borderRadius: 16,
        width: buttonWidth,
        ...buttonStyles,
      }}
    >
      <LinearGradient colors={gradientColors} style={s.baitSkillButton}>
        <Text style={s.baitSkillButtonText}>{buttonLabel}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const s = StyleSheet.create({
  baitSkillButton: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 13,
    height: 67,
  },
  baitSkillButtonText: {
    color: '#35251D',
    fontSize: 20,
    fontFamily: buttonFont,
  },
});

export default BaitSkillGradientButton;
