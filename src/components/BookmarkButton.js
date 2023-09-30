import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLOR } from '../color';
import { useTheme } from '../use-theme';

// 북마크 커스텀 훅
const useBookmark = (initIsBookmarked) => {
  const [isBookmarked, setIsBookmarked] = useState(initIsBookmarked);
  const toggleIsBookmarked = () => setIsBookmarked(!isBookmarked);

  return {
    isBookmarked,
    toggleIsBookmarked,
  };
};

const BookmarkButton = ({ isBookmarked: isBookmarkedProps, onPress, style, size, NEWCOLOR }) => {
  const { isBookmarked, toggleIsBookmarked } = useBookmark(isBookmarkedProps);
  return (
    <TouchableOpacity
      style={style}
      onPress={() => {
        toggleIsBookmarked();
        onPress();
      }}
    >
      <Ionicons name="star" size={size} color={isBookmarked ? COLOR.YELLOW : NEWCOLOR.GRAY_1_GRAY_2} />
    </TouchableOpacity>
  );
};

export default BookmarkButton;
