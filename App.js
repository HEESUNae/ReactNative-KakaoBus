import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import {
  RefreshControl,
  SafeAreaView,
  SectionList,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import BusInfo from './src/components/BusInfo';
import { busStop, getBusNumColorByType, getRemainedTimeText, getSeatStatusText, getSections } from './src/data';
import { SimpleLineIcons } from '@expo/vector-icons';
import BookmarkButton from './src/components/BookmarkButton';
import { useTheme } from './src/use-theme';

export default function App() {
  const sections = getSections(busStop.buses);
  const [now, setNow] = useState(dayjs());
  const [refreshing, setRefreshing] = useState(false);

  const { NEWCOLOR, isDark, toggleIsDark } = useTheme();

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
        style={{
          backgroundColor: NEWCOLOR.GRAY_3_GRAY_2,
          height: 170,
          justifyContent: 'center',
          alignItems: 'center',
          gap: 4,
        }}
      >
        <Text style={{ color: NEWCOLOR.WHITE_BLACK, fontSize: 13 }}>{busStop.id}</Text>
        <Text style={{ color: NEWCOLOR.WHITE_BLACK, fontSize: 20 }}>{busStop.name}</Text>
        <Text style={{ color: NEWCOLOR.GRAY_1_GRAY_4, fontSize: 14, marginBottom: 16 }}>
          {busStop.directionDescription}
        </Text>
        <BookmarkButton
          NEWCOLOR={NEWCOLOR}
          size={25}
          isBookmarked={busStop.isBookmarked}
          onPress={() => {}}
          style={{ borderWidth: 0.3, borderColor: NEWCOLOR.GRAY_1_GRAY_4, padding: 5, borderRadius: '100%' }}
        />
        <Switch value={isDark} onValueChange={(v) => toggleIsDark()} />
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
          backgroundColor: NEWCOLOR.GRAY_1_GRAY_4,
          borderTopWidth: 0.5,
          borderBottomWidth: 0.5,
          borderTopColor: NEWCOLOR.GRAY_2_GRAY_3,
          borderBottomColor: NEWCOLOR.GRAY_2_GRAY_3,
        }}
      >
        <Text style={{ fontSize: 12, color: NEWCOLOR.GRAY_4_GRAY_1 }}>{title}</Text>
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
        NEWCOLOR={NEWCOLOR}
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
    return <View style={{ width: '100%', height: 1, backgroundColor: NEWCOLOR.GRAY_1_GRAY_2 }} />;
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
      <View style={{ backgroundColor: NEWCOLOR.GRAY_3_GRAY_2, width: '100%' }}>
        <SafeAreaView style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <ListHeaderIcons name="arrow-left" size={24} color={NEWCOLOR.WHITE_BLACK} />
          <ListHeaderIcons name="home" size={20} color={NEWCOLOR.WHITE_BLACK} />
        </SafeAreaView>
        <View
          style={{
            position: 'absolute',
            width: '100%',
            height: 600,
            backgroundColor: NEWCOLOR.GRAY_3_GRAY_2,
            zIndex: -1,
          }}
        />
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
