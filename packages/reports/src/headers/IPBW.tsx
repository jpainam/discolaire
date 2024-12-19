import { Image, StyleSheet, Text, View } from "@react-pdf/renderer";

import type { RouterOutputs } from "@repo/api";

const styles = StyleSheet.create({
  header: {
    flexDirection: "column",
    alignItems: "center",
  },
  boldText: {
    fontWeight: "bold",
    fontSize: 12,
  },
  smallText: {
    fontSize: 10,
  },
  logo: {
    width: 120,
    height: 100,
    margin: "auto",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
});

export function IPBWHeader({
  school,
}: {
  school: RouterOutputs["school"]["getSchool"];
}) {
  return (
    <View style={{ flexDirection: "row", marginBottom: 20 }}>
      <View style={styles.header}>
        <Text style={styles.smallText}>{school.ministry}</Text>
        <Text style={styles.smallText}>**************</Text>
        <Text style={styles.smallText}>{school.region}</Text>
        <Text style={styles.smallText}>**************</Text>
        <Text style={styles.smallText}>{school.department}</Text>
        <Text style={styles.smallText}>**************</Text>
        <Text style={styles.smallText}>{school.name}</Text>
      </View>

      <View style={styles.header}>
        {school.logo && <Image style={styles.logo} src={school.logo} />}
      </View>

      <View style={[styles.header, { gap: 4 }]}>
        <Text style={styles.smallText}>
          Autorisation d'ouverture {school.authorization}
        </Text>
        <Text style={styles.smallText}>{school.address}</Text>
        <Text style={styles.smallText}>Téléphone: {school.phoneNumber1}</Text>
        <Text style={styles.smallText}>Email: {school.email}</Text>
        <Text style={styles.smallText}>{school.website}</Text>
      </View>
    </View>
  );
}
