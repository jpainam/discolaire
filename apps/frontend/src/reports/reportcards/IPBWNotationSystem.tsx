import { Text, View } from "@react-pdf/renderer";

const notations: {
  interval: string;
  notation: string;
  description: string;
}[] = [
  {
    interval: "[18.00; 20.00[",
    notation: "A+",
    description: "Compétences Très Acquises",
  },
  {
    interval: "[16.00; 18.00[",
    notation: "A",
    description: "Compétences Très Acquises",
  },
  {
    interval: "[15.00; 16.00[",
    notation: "B+",
    description: "Compétences Bien Acquises",
  },
  {
    interval: "[14.00; 15.00[",
    notation: "B",
    description: "Compétences Bien Acquises",
  },
  {
    interval: "[12.00; 14.00[",
    notation: "C+",
    description: "Compétences Acquises",
  },
  {
    interval: "[10.00; 12.00[",
    notation: "C",
    description: "Compétences Acquises",
  },
  {
    interval: "[00.00; 10.00[",
    notation: "D",
    description: "Compétences Non Acquises",
  },
];

const W = [30, 10, 60];

export function IPBWNotationSystem() {
  return (
    <View
      style={{
        display: "flex",
        width: "40%",
        flexDirection: "column",
        border: "1px solid black",
      }}
    >
      {notations.map((n, index) => {
        return (
          <View
            style={{
              borderBottom:
                index < notations.length - 1 ? "1px solid black" : "",
              flexDirection: "row",
              display: "flex",
            }}
            key={index}
          >
            <View
              style={{
                width: `${W[0]}%`,
                borderRight: "1px solid black",
                alignItems: "center",
                paddingVertical: 2,
                justifyContent: "center",
              }}
            >
              <Text>{n.interval}</Text>
            </View>
            <View
              style={{
                width: `${W[1]}%`,
                borderRight: "1px solid black",
                alignItems: "center",
                paddingVertical: 2,
                justifyContent: "center",
              }}
            >
              <Text>{n.notation}</Text>
            </View>
            <View
              style={{
                width: `${W[2]}%`,
                //alignItems: "center",
                paddingVertical: 2,
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  paddingHorizontal: 2,
                }}
              >
                {" "}
                {n.description}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}
