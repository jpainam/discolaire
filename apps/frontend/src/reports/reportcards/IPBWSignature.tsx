import { Text, View } from "@react-pdf/renderer";

export function IPBWSignature({ cycle }: { cycle?: string }) {
  return (
    <View
      style={{
        flexDirection: "row",
        gap: 2,
        display: "flex",
        fontWeight: "bold",
        fontSize: 8,
        width: "80%",
      }}
    >
      <View
        style={{
          width: "30%",
          border: "1px solid black",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <Text style={{ paddingVertical: 2 }}> Parents</Text>
      </View>
      <View
        style={{
          width: "30%",
          border: "1px solid black",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <Text style={{ paddingVertical: 2 }}>Prof. Principal</Text>
      </View>

      <View
        style={{
          width: "40%",
          border: "1px solid black",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <Text style={{ paddingVertical: 2 }}>
          {" "}
          Directeur des Etudes {cycle}
        </Text>
      </View>
    </View>
  );
}

export function IPBWSignatureTrimestre() {
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
        <Text style={{ paddingVertical: 2 }}>Le Chef d'établissement</Text>
      </View>
    </View>
  );
}

export function IPBWSignatureAnnual() {
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
        <Text style={{ paddingVertical: 2 }}>Le Chef d'établissement</Text>
      </View>
    </View>
  );
}
