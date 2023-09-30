import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { RefreshControl, SafeAreaView, SectionList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BusInfo from './src/components/BusInfo';
import { COLOR } from './src/color';
import { busStop, getBusNumColorByType, getRemainedTimeText, getSeatStatusText, getSections } from './src/data';
import { SimpleLineIcons } from '@expo/vector-icons';
import BookmarkButton from './src/components/BookmarkButton';

export default function App() {
  const sections = getSections(busStop.buses);
  const [now, setNow] = useState(dayjs());
  const [refreshing, setRefreshing] = useState(false);

  const ListHeaderIcons = ({ name, size, color }) => {
    return (
      <TouchableOpacity style={{ padding: 10 }}>
        <SimpleLineIcons name={name} size={size} color={color} />
      </TouchableOpacity>
    );
  };

  const ListHeaderComponent = () => {
    return (
      <View
        style={{ backgroundColor: COLOR.GRAY_3, height: 170, justifyContent: 'center', alignItems: 'center', gap: 4 }}
      >
        <Text style={{ color: COLOR.WHITE, fontSize: 13 }}>{busStop.id}</Text>
        <Text style={{ color: COLOR.WHITE, fontSize: 20 }}>{busStop.name}</Text>
        <Text style={{ color: COLOR.GRAY_1, fontSize: 14, marginBottom: 16 }}>{busStop.directionDescription}</Text>
        <BookmarkButton
          size={25}
          isBookmarked={busStop.isBookmarked}
          onPress={() => {}}
          style={{ borderWidth: 0.3, borderColor: COLOR.GRAY_1, padding: 5, borderRadius: '100%' }}
        />
      </View>
    );
  };

  // sectionList 리스트 헤더 렌더링
  const renderSectionHeader = ({ section: { title } }) => {
    return (
      <View
        style={{
          paddingHorizontal: 13,
          paddingVertical: 3,
          backgroundColor: COLOR.GRAY_1,
          borderTopWidth: 0.5,
          borderBottomWidth: 0.5,
          borderTopColor: COLOR.GRAY_2,
          borderBottomColor: COLOR.GRAY_2,
        }}
      >
        <Text style={{ fontSize: 12, color: COLOR.GRAY_4 }}>{title}</Text>
      </View>
    );
  };

  // sectionList 리스트 렌더링
  const renderItem = ({ item: bus }) => {
    const numColor = getBusNumColorByType(bus.type);

    const firstNextBusInfo = bus.nextBusInfos?.[0] ?? null;
    const secondNextBusInfo = bus.nextBusInfos?.[1] ?? null;
    const newNextBusInfos = !firstNextBusInfo && !secondNextBusInfo ? [null] : [firstNextBusInfo, secondNextBusInfo];

    const processedNextBusInfos = bus.nextBusInfos.map((info) => {
      if (!info) return { hasInfo: false, remainedTimeText: '도착 정보 없음' };

      const { arrivalTime, numOfRemainedStops, numOfPassengers } = info;
      const remainedTimeText = getRemainedTimeText(now, arrivalTime);
      const seatStatusText = getSeatStatusText(bus.type, numOfPassengers);
      return {
        hasInfo: true,
        remainedTimeText,
        numOfRemainedStops,
        seatStatusText,
      };
    });
    return (
      <BusInfo
        isBookmarked={bus.isBookmarked}
        onPress={() => {}}
        num={bus.num}
        directionDescription={bus.directionDescription}
        numColor={numColor}
        processedNextBusInfos={processedNextBusInfos}
      />
    );
  };

  // 리스트 구분선
  const ItemSeparatorComponent = () => {
    return <View style={{ width: '100%', height: 1, backgroundColor: COLOR.GRAY_1 }} />;
  };

  // 리스트 하단
  const ListFooterComponent = () => {
    return <View style={{ height: 30 }} />;
  };

  // 화면 리프레시
  const onRefresh = () => {
    setRefreshing(true);
  };

  useEffect(() => {
    if (refreshing) {
      setNow(dayjs());
      setRefreshing(false);
    }
  }, [refreshing]);

  // 1초마다 도착시간 리렌더링
  useEffect(() => {
    const interval = setInterval(() => {
      const newNow = dayjs();
      setNow(newNow);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <View style={{ backgroundColor: COLOR.GRAY_3, width: '100%' }}>
        <SafeAreaView style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <ListHeaderIcons name="arrow-left" size={24} color={COLOR.WHITE} />
          <ListHeaderIcons name="home" size={20} color={COLOR.WHITE} />
        </SafeAreaView>
        <View style={{ position: 'absolute', width: '100%', height: 600, backgroundColor: COLOR.GRAY_3, zIndex: -1 }} />
      </View>
      <SectionList
        style={{ flex: 1, width: '100%' }}
        sections={sections} // data obj
        renderSectionHeader={renderSectionHeader}
        renderItem={renderItem}
        ListHeaderComponent={ListHeaderComponent}
        ListFooterComponent={ListFooterComponent}
        ItemSeparatorComponent={ItemSeparatorComponent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
