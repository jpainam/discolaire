import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";

import type { RouterOutputs } from "@repo/api";

import { IPBWHeader } from "../headers/IPBW";

export function StudentPage({
  student,
  school,
}: {
  student: RouterOutputs["student"]["get"];
  school: RouterOutputs["school"]["getSchool"];
}) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <IPBWHeader school={school} />
        <View style={styles.header}>
          <Text>Student Details</Text>
        </View>

        {student.avatar && <Image style={styles.avatar} src={student.avatar} />}

        <View style={styles.section}>
          <Text style={styles.label}>Full Name:</Text>
          <Text style={styles.value}>
            {student.firstName} {student.lastName}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Registration Number:</Text>
          <Text style={styles.value}>{student.registrationNumber}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{student.email}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Date of Birth:</Text>
          <Text style={styles.value}>
            {student.dateOfBirth?.toLocaleDateString()}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Place of Birth:</Text>
          <Text style={styles.value}>{student.placeOfBirth}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Blood Type:</Text>
          <Text style={styles.value}>{student.bloodType}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Residence:</Text>
          <Text style={styles.value}>{student.residence}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Phone Number:</Text>
          <Text style={styles.value}>{student.phoneNumber}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Status:</Text>
          <Text style={styles.value}>{student.status}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Religion:</Text>
          <Text style={styles.value}>{student.religion?.name}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Enrollment Date:</Text>
          <Text style={styles.value}>
            {student.dateOfEntry?.toLocaleDateString()}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Achievements:</Text>
          <Text style={styles.value}>{student.achievements.join(", ")}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Hobbies:</Text>
          <Text style={styles.value}>{student.hobbies.join(", ")}</Text>
        </View>
      </Page>
    </Document>
  );
}

const styles = StyleSheet.create({
  page: {
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
  },
  section: {
    marginBottom: 15,
  },
  label: {
    fontSize: 12,
    fontWeight: "bold",
  },
  value: {
    fontSize: 12,
    marginBottom: 5,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
});

export default StudentPage;
