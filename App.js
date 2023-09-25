import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, SectionList, StyleSheet, Text, View } from 'react-native';
import BusInfo from './src/components/BusInfo';
import { busStop, getBusNumColorByType, getRemainedTimeText, getSeatStatusText, getSections } from './src/data';
import dayjs from 'dayjs';

export default function App() {
  const sections = getSections(busStop.buses);
  const now = dayjs();

  // sectionList render
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

  return (
    <SafeAreaView style={styles.container}>
      <SectionList
        style={{ flex: 1, width: '100%' }}
        sections={sections} // data obj
        renderSectionHeader={({ section: { title } }) => <Text>{title}</Text>}
        renderItem={renderItem}
      />
    </SafeAreaView>
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
