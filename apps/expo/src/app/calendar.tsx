import type {
  AgendaEntry,
  AgendaSchedule,
  DateData,
} from "react-native-calendars";
import React from "react";
import { Alert, StyleSheet, TouchableOpacity } from "react-native";
import { Agenda } from "react-native-calendars";

import { Text, useThemeColor, View } from "~/components/Themed";
import { useColorScheme } from "~/components/useColorScheme";

const testIDs = {
  menu: {
    CONTAINER: "menu",
    CALENDARS: "calendars_btn",
    CALENDAR_LIST: "calendar_list_btn",
    HORIZONTAL_LIST: "horizontal_list_btn",
    AGENDA: "agenda_btn",
    EXPANDABLE_CALENDAR: "expandable_calendar_btn",
    WEEK_CALENDAR: "week_calendar_btn",
    TIMELINE_CALENDAR: "timeline_calendar_btn",
    PLAYGROUND: "playground_btn",
  },
  calendars: {
    CONTAINER: "calendars",
    FIRST: "first_calendar",
    LAST: "last_calendar",
  },
  calendarList: { CONTAINER: "calendarList" },
  horizontalList: { CONTAINER: "horizontalList" },
  agenda: {
    CONTAINER: "agenda",
    ITEM: "item",
  },
  expandableCalendar: { CONTAINER: "expandableCalendar" },
  weekCalendar: { CONTAINER: "weekCalendar" },
};

export default function AgendaScreen() {
  // reservationsKeyExtractor = (item, index) => {
  //   return `${item?.reservation?.day}${index}`;
  // };
  const [items, setItems] = React.useState<AgendaSchedule>({});

  const loadItems = (day: DateData) => {
    setTimeout(() => {
      for (let i = -15; i < 85; i++) {
        const time = day.timestamp + i * 24 * 60 * 60 * 1000;
        const strTime = timeToString(time);

        if (!items[strTime]) {
          items[strTime] = [];

          const numItems = Math.floor(Math.random() * 3 + 1);
          for (let j = 0; j < numItems; j++) {
            items[strTime].push({
              name: "Item for " + strTime + " #" + j,
              height: Math.max(50, Math.floor(Math.random() * 150)),
              day: strTime,
            });
          }
        }
      }

      const newItems: AgendaSchedule = {};
      Object.keys(items).forEach((key) => {
        if (items[key]) newItems[key] = items[key];
      });
      setItems(newItems);
    }, 1000);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const renderDay = (day: Date | undefined) => {
    if (day) {
      return <Text style={styles.customDay}>{day.getDay()}</Text>;
    }
    return <View style={styles.dayItem} />;
  };

  const renderItem = (reservation: AgendaEntry, isFirst: boolean) => {
    const fontSize = isFirst ? 16 : 14;
    const color = isFirst ? "black" : "#43515c";

    return (
      <TouchableOpacity
        testID={testIDs.agenda.ITEM}
        style={[styles.item, { height: reservation.height }]}
        onPress={() => Alert.alert(reservation.name)}
      >
        <Text style={{ fontSize, color }}>{reservation.name}</Text>
      </TouchableOpacity>
    );
  };

  const renderEmptyDate = () => {
    return (
      <View style={styles.emptyDate}>
        <Text>This is empty date!</Text>
      </View>
    );
  };

  const rowHasChanged = (r1: AgendaEntry, r2: AgendaEntry) => {
    return r1.name !== r2.name;
  };

  const timeToString = (time: number) => {
    const date = new Date(time);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return date.toISOString().split("T")[0]!;
  };
  const calendarBackground = useThemeColor({}, "background");
  const theme = useColorScheme() ?? "light";

  return (
    <Agenda
      key={theme}
      testID={testIDs.agenda.CONTAINER}
      items={items}
      loadItemsForMonth={loadItems}
      selected={"2017-05-16"}
      renderItem={renderItem}
      renderEmptyDate={renderEmptyDate}
      rowHasChanged={rowHasChanged}
      showClosingKnob={true}
      styles={{
        backgroundColor: calendarBackground,
      }}
      // markingType={'period'}
      // markedDates={{
      //    '2017-05-08': {textColor: '#43515c'},
      //    '2017-05-09': {textColor: '#43515c'},
      //    '2017-05-14': {startingDay: true, endingDay: true, color: 'blue'},
      //    '2017-05-21': {startingDay: true, color: 'blue'},
      //    '2017-05-22': {endingDay: true, color: 'gray'},
      //    '2017-05-24': {startingDay: true, color: 'gray'},
      //    '2017-05-25': {color: 'gray'},
      //    '2017-05-26': {endingDay: true, color: 'gray'}}}
      // monthFormat={'yyyy'}
      theme={{
        calendarBackground: calendarBackground,
        agendaKnobColor: "green",
        dayTextColor: "white",
        monthTextColor: "white",
        textDisabledColor: "grey",
        agendaDayTextColor: "yellow",
        agendaDayNumColor: "green",
        agendaTodayColor: "red",
      }}
      // renderDay={this.renderDay}
      // hideExtraDays={false}
      // showOnlySelectedDayItems
      // reservationsKeyExtractor={this.reservationsKeyExtractor}
    />
  );
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: "white",
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17,
  },
  emptyDate: {
    height: 15,
    flex: 1,
    paddingTop: 30,
  },
  customDay: {
    margin: 10,
    fontSize: 24,
    color: "green",
  },
  dayItem: {
    marginLeft: 34,
  },
});
