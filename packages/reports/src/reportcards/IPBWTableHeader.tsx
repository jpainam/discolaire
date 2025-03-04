import { Text, View } from "@react-pdf/renderer";

import "../fonts";

export function IPBWTableHeader({ W }: { W: number[] }) {
  return (
    <View
      style={{
        //backgroundColor: "#000",
        //color: "#fff",
        borderBottom: "1px solid black",
        fontWeight: "bold",
        fontSize: 8,
      }}
    >
      <View
        style={{
          padding: 2,
          width: W[0],
          borderRight: "1px solid black",
          paddingHorizontal: 2,
        }}
      >
        <Text>Matieres</Text>
      </View>
      <View
        style={{
          justifyContent: "center",
          width: W[1],
          borderRight: "1px solid black",
          paddingHorizontal: 2,
        }}
      >
        <Text>Note</Text>
      </View>
      <View
        style={{
          width: W[2],
          justifyContent: "center",
          borderRight: "1px solid black",
          paddingHorizontal: 2,
        }}
      >
        <Text> Coef.</Text>
      </View>
      <View
        style={{
          width: W[3],
          justifyContent: "center",
          borderRight: "1px solid black",
          paddingHorizontal: 2,
        }}
      >
        <Text> Total</Text>
      </View>
      <View
        style={{
          width: W[4],
          justifyContent: "center",
          borderRight: "1px solid black",
          paddingHorizontal: 2,
        }}
      >
        <Text> Rang</Text>
      </View>
      <View
        style={{
          width: W[5],
          justifyContent: "center",
          borderRight: "1px solid black",
          paddingHorizontal: 2,
        }}
      >
        <Text> Moy.C</Text>
      </View>
      <View
        style={{
          width: W[6],
          justifyContent: "center",
          borderRight: "1px solid black",
          paddingHorizontal: 2,
        }}
      >
        <Text> Min/Max</Text>
      </View>
      <View
        style={{
          width: W[7],
          justifyContent: "center",

          paddingHorizontal: 2,
        }}
      >
        <Text> Appreciation</Text>
      </View>
    </View>
  );
}
