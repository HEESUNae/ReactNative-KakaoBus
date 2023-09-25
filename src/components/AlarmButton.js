import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLOR } from '../color';

const AlarmButton = ({ style, onPress }) => {
  return (
    <TouchableOpacity style={style} onPress={onPress}>
      <Ionicons name="alarm-outline" size={24} color={COLOR.GRAY_3} />
    </TouchableOpacity>
  );
};

export default AlarmButton;
