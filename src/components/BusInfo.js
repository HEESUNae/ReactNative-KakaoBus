import React from 'react';
import { View, Text } from 'react-native';
import BookmarkButton from './BookmarkButton';
import { COLOR } from '../color';
import AlarmButton from './AlarmButton';
import NextBusInfo from './NextBusInfo';

const BusInfo = ({ isBookmarked, onPressBookmark, num, directionDescription, numColor, processedNextBusInfos }) => {
  return (
    <View style={{ flexDirection: 'row', height: 75 }}>
      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
        <BookmarkButton
          size={20}
          isBookmarked={isBookmarked}
          onPress={onPressBookmark}
          style={{ paddingHorizontal: 10 }}
        />
        <View style={{ flex: 1 }}>
          <Text style={{ color: numColor, fontSize: 20 }}>{num}</Text>
          <Text style={{ fontSize: 13, color: COLOR.GRAY_3 }}>{directionDescription} 방향</Text>
        </View>
      </View>
      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ flex: 1 }}>
          {processedNextBusInfos.map((info, index) => (
            <NextBusInfo
              key={`next-bus-info-${index}`}
              hasInfo={info.hasInfo}
              remainedTimeText={info.remainedTimeText}
              numOfRemainedStops={info.numOfRemainedStops}
              seatStatusText={info.seatStatusText}
            />
          ))}
        </View>
        <AlarmButton onPress={() => {}} style={{ paddingHorizontal: 15 }} />
      </View>
    </View>
  );
};

export default BusInfo;
