import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../use-theme';

const AlarmButton = ({ style, onPress }) => {
  const { NEWCOLOR } = useTheme();
  return (
    <TouchableOpacity style={style} onPress={onPress}>
      <Ionicons name="alarm-outline" size={24} color={NEWCOLOR.GRAY_3_GRAY_2} />
    </TouchableOpacity>
  );
};

export default AlarmButton;
