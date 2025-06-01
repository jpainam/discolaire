import React, { useEffect } from "react";
import {
  ActivityIndicator,
  Appearance,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { Colors } from "~/constants/theme";

import { useQuery } from "@tanstack/react-query";
import {
  CircleAlert as AlertCircle,
  CircleCheck as CheckCircle,
  Clock,
  DollarSign,
} from "lucide-react-native";
import type { RouterOutputs } from "~/utils/api";
import { trpc } from "~/utils/api";
import { ThemedView } from "../ThemedView";

export default function ClassroomFees({
  classroomId,
}: {
  classroomId: string;
}) {
  const { data: fees, isPending } = useQuery(
    trpc.classroom.fees.queryOptions(classroomId),
  );

  const theme = useColorScheme() ?? "light";

  const [totalFees, setTotalFees] = React.useState(0);
  const [paidFees, setPaidFees] = React.useState(0);
  const [pendingFees, setPendingFees] = React.useState(0);

  useEffect(() => {
    if (fees) {
      const today = new Date();
      const total = fees.reduce((acc, fee) => acc + fee.amount, 0);
      const paid = fees
        .filter((fee) => fee.dueDate < today)
        .reduce((acc, fee) => acc + fee.amount, 0);
      const pending = fees
        .filter((fee) => fee.dueDate >= today)
        .reduce((acc, fee) => acc + fee.amount, 0);
      setTotalFees(total);
      setPaidFees(paid);
      setPendingFees(pending);
    }
  }, [fees]);

  if (isPending) {
    return (
      <ThemedView
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: Colors[theme].colors.background,
        }}
      >
        <ActivityIndicator size={"large"} />
      </ThemedView>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <CheckCircle size={16} color={Colors[theme].colors.success[500]} />
        );
      case "pending":
        return <Clock size={16} color={Colors[theme].colors.warning[500]} />;
      case "overdue":
        return (
          <AlertCircle size={16} color={Colors[theme].colors.error[500]} />
        );
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "paid":
        return "Paid";
      case "pending":
        return "Pending";
      case "overdue":
        return "Overdue";
      default:
        return "";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return Colors[theme].colors.success[500];
      case "pending":
        return Colors[theme].colors.warning[500];
      case "overdue":
        return Colors[theme].colors.error[500];
      default:
        return Colors[theme].colors.text.secondary;
    }
  };

  const renderFeeItem = ({
    item,
  }: {
    item: RouterOutputs["classroom"]["fees"][number];
  }) => (
    <TouchableOpacity key={item.id} style={styles.feeItem}>
      <View style={styles.feeDetails}>
        <Text style={styles.feeName}>{item.description}</Text>
        <Text style={styles.feeDate}>
          {item.dueDate.toLocaleDateString("fr-FR", {
            year: "2-digit",
            month: "short",
            day: "numeric",
          })}
        </Text>
      </View>
      <View style={styles.feeAmount}>
        <Text style={styles.amountText}>${item.amount.toFixed(2)}</Text>
        <View style={styles.statusContainer}>
          {getStatusIcon("paid")}
          <Text
            style={[styles.statusText, { color: getStatusColor("pending") }]}
          >
            {getStatusText("pending")}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <DollarSign size={20} color={Colors[theme].colors.primary[500]} />
          <Text style={styles.summaryTitle}>Total Fees</Text>
          <Text style={styles.summaryAmount}>${totalFees.toFixed(2)}</Text>
        </View>

        <View style={[styles.summaryCard, styles.paidCard]}>
          <CheckCircle size={20} color={Colors[theme].colors.success[500]} />
          <Text style={styles.summaryTitle}>Paid</Text>
          <Text style={styles.summaryAmount}>${paidFees.toFixed(2)}</Text>
        </View>

        <View style={[styles.summaryCard, styles.pendingCard]}>
          <Clock size={20} color={Colors[theme].colors.warning[500]} />
          <Text style={styles.summaryTitle}>Pending</Text>
          <Text style={styles.summaryAmount}>${pendingFees.toFixed(2)}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Fee Details</Text>
      {fees?.length === 0 && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No fees found for this classroom</Text>
        </View>
      )}
      {fees?.map((fee) => {
        return renderFeeItem({ item: fee });
      })}
      {/* <FlatList
        data={fees}
        renderItem={renderFeeItem}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No fees found for this classroom
            </Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      /> */}
    </View>
  );
}

const theme = Appearance.getColorScheme() ?? "light";
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  summaryContainer: {
    flexDirection: "row",
    marginBottom: 24,
  },
  summaryCard: {
    flex: 1,
    padding: 12,
    backgroundColor: Colors[theme].colors.primary[50],
    borderRadius: 12,
    marginRight: 8,
    alignItems: "center",
  },
  paidCard: {
    backgroundColor: Colors[theme].colors.success[50],
  },
  pendingCard: {
    backgroundColor: Colors[theme].colors.warning[50],
    marginRight: 0,
  },
  summaryTitle: {
    fontFamily: "Inter-Medium",
    fontSize: 12,
    color: Colors[theme].colors.text.secondary,
    marginTop: 4,
    marginBottom: 4,
  },
  summaryAmount: {
    fontFamily: "Inter-Bold",
    fontSize: 16,
    color: Colors[theme].colors.text.primary,
  },
  sectionTitle: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: Colors[theme].colors.text.primary,
    marginBottom: 12,
  },
  feeItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: Colors[theme].colors.background,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors[theme].colors.neutral[200],
  },
  feeDetails: {
    flex: 1,
  },
  feeName: {
    fontFamily: "Inter-SemiBold",
    fontSize: 15,
    color: Colors[theme].colors.text.primary,
    marginBottom: 4,
  },
  feeDate: {
    fontFamily: "Inter-Regular",
    fontSize: 13,
    color: Colors[theme].colors.text.tertiary,
  },
  feeAmount: {
    alignItems: "flex-end",
  },
  amountText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: Colors[theme].colors.text.primary,
    marginBottom: 4,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusText: {
    fontFamily: "Inter-Medium",
    fontSize: 12,
    marginLeft: 4,
  },
  listContent: {
    paddingBottom: 16,
  },
  emptyContainer: {
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: Colors[theme].colors.text.secondary,
  },
});
