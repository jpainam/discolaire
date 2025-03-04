import { Text, View } from "@react-pdf/renderer";

export function IPBWSignature() {
  return (
    <View
      style={{
        flexDirection: "row",
        gap: 2,
        display: "flex",
        paddingTop: 4,
        fontWeight: "bold",
        fontSize: 9,
        width: "100%",
      }}
    >
      <View
        style={{
          width: "30%",
          border: "1px solid black",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ paddingVertical: 2 }}> Parents</Text>
      </View>
      <View
        style={{
          width: "30%",
          border: "1px solid black",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ paddingVertical: 2 }}>Prof. Principal</Text>
      </View>

      <View
        style={{
          width: "40%",
          border: "1px solid black",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ paddingVertical: 2 }}> Directeur</Text>
      </View>
    </View>
  );
}
