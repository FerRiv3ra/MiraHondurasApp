import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

const guideLineBaseWith = 350;
const guideLineBaseHeight = 680;

const scale = size => width / guideLineBaseWith * size; //with
const verticalScale = size => height / guideLineBaseHeight * size; //height
const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor; //padding

export { scale, verticalScale, moderateScale };