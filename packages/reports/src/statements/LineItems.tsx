import { Text, View } from "@react-pdf/renderer";

import type { RouterOutputs } from "@repo/api";

import { formatAmount } from "./utils/format";

interface Props {
  lineItems: RouterOutputs["studentAccount"]["getStatements"];
  currency: string;
  descriptionLabel: string;
  quantityLabel: string;
  priceLabel: string;
  totalLabel: string;
}

export function LineItems({
  lineItems,
  currency,
  descriptionLabel,
  quantityLabel,
  priceLabel,
  totalLabel,
}: Props) {
  return (
    <View style={{ marginTop: 20 }}>
      <View
        style={{
          flexDirection: "row",
          borderBottomWidth: 0.5,
          borderBottomColor: "#000",
          paddingBottom: 5,
          marginBottom: 5,
        }}
      >
        <Text style={{ flex: 3, fontSize: 9, fontWeight: 500 }}>
          {descriptionLabel}
        </Text>
        <Text style={{ flex: 1, fontSize: 9, fontWeight: 500 }}>
          {priceLabel}
        </Text>
        <Text style={{ flex: 0.5, fontSize: 9, fontWeight: 500 }}>
          {quantityLabel}
        </Text>
        <Text
          style={{
            flex: 1,
            fontSize: 9,
            fontWeight: 500,
            textAlign: "right",
          }}
        >
          {totalLabel}
        </Text>
      </View>
      {lineItems.map((item, index) => (
        <View
          key={`line-item-${index.toString()}`}
          style={{ flexDirection: "row", paddingVertical: 5 }}
        >
          <Text style={{ flex: 3, fontSize: 9 }}>{item.description}</Text>
          <Text style={{ flex: 1, fontSize: 9 }}>
            {formatAmount({ currency, amount: item.amount })}
          </Text>
          <Text style={{ flex: 0.5, fontSize: 9 }}>{item.transactionRef}</Text>
          <Text style={{ flex: 1, fontSize: 9, textAlign: "right" }}>
            {formatAmount({ currency, amount: item.amount * 5 })}
          </Text>
        </View>
      ))}
    </View>
  );
}
