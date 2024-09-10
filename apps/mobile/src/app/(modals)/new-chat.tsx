import { Appearance, Image, StyleSheet, Text, View } from "react-native";
import { AlphabetList } from "react-native-section-alphabet-list";

import contacts from "~/../assets/data/contacts.json";
import { useColorScheme } from "~/components/useColorScheme";
import Colors from "~/constants/Colors";
import { defaultStyles } from "~/constants/Styles";

interface NewChatType {
  value: string;
  name: string;
  img: string;
  desc: string;
  key: string;
}
interface Contact {
  first_name: string;
  last_name: string;
  desc: string;
  img: string;
}
const Page = () => {
  const data: NewChatType[] = contacts.map((contact: Contact, index) => ({
    value: `${contact.first_name} ${contact.last_name}`,
    name: `${contact.first_name} ${contact.last_name}`,
    img: contact.img,
    desc: contact.desc,
    key: `${contact.first_name} ${contact.last_name}-${index}`,
  }));

  const theme = useColorScheme() ?? "light";

  return (
    <View
      style={{
        flex: 1,
        paddingTop: 110,
        backgroundColor: Colors[theme].background,
      }}
    >
      <AlphabetList
        data={data}
        stickySectionHeadersEnabled
        indexLetterStyle={{
          color: Colors[theme].primary,
          fontSize: 12,
        }}
        indexContainerStyle={{
          width: 24,
          backgroundColor: Colors[theme].background,
        }}
        renderCustomItem={(item) => {
          const v = item as NewChatType;
          return (
            <>
              <View style={styles.listItemContainer}>
                <Image source={{ uri: v.img }} style={styles.listItemImage} />
                <View>
                  <Text style={{ color: "#000", fontSize: 14 }}>
                    {item.value}
                  </Text>
                  <Text style={{ color: Colors[theme].gray, fontSize: 12 }}>
                    {v.desc.length > 40
                      ? `${v.desc.substring(0, 40)}...`
                      : v.desc}
                  </Text>
                </View>
              </View>
              <View style={[defaultStyles.separator, { marginLeft: 50 }]} />
            </>
          );
        }}
        renderCustomSectionHeader={(section) => (
          <View style={styles.sectionHeaderContainer}>
            <Text style={{ color: Colors[theme].gray }}>{section.title}</Text>
          </View>
        )}
        style={{
          marginLeft: 14,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  listItemContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    height: 50,
    paddingHorizontal: 14,
    backgroundColor: "#fff",
  },

  listItemImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },

  sectionHeaderContainer: {
    height: 30,
    backgroundColor: Colors[Appearance.getColorScheme() ?? "light"].background,
    justifyContent: "center",
    paddingHorizontal: 14,
  },
});

export default Page;
