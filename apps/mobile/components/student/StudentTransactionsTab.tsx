import type { RouterOutputs } from "@repo/api";
import { TransactionType } from "@repo/db/enums";

import { useQuery } from "@tanstack/react-query";
import {
  CircleArrowDown as ArrowDownCircle,
  CircleArrowUp as ArrowUpCircle,
  Calendar,
  Search,
} from "lucide-react-native";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { trpc } from "~/utils/api";

export default function StudentTransactionsTab({
  student,
}: {
  student: RouterOutputs["student"]["get"];
}) {
  const { data: transactions, isPending } = useQuery(
    trpc.student.transactions.queryOptions(student.id),
  );
  const getTransactionIcon = (type: TransactionType) => {
    if (type === TransactionType.CREDIT) {
      return <ArrowDownCircle size={20} color="#10b981" />;
    } else {
      return <ArrowUpCircle size={20} color="#ef4444" />;
    }
  };

  const renderTransactionItem = ({
    item,
  }: {
    item: RouterOutputs["student"]["transactions"][number];
  }) => (
    <TouchableOpacity style={styles.transactionItem} activeOpacity={0.7}>
      <View style={styles.transactionIcon}>
        {getTransactionIcon(item.transactionType)}
      </View>

      <View style={styles.transactionDetails}>
        <Text style={styles.transactionTitle}>{item.description}</Text>
        <Text style={styles.transactionDescription}>{item.description}</Text>
        <Text style={styles.transactionDate}>
          {item.createdAt.toLocaleDateString("fr-FR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })}
        </Text>
      </View>

      <View style={styles.transactionAmount}>
        <Text
          style={[
            styles.amountText,
            item.transactionType === "CREDIT"
              ? styles.creditAmount
              : styles.debitAmount,
          ]}
        >
          {item.transactionType === "CREDIT" ? "+" : "-"}$
          {item.amount.toFixed(2)}
        </Text>
        <Text style={styles.transactionCategory}>{item.method}</Text>
      </View>
    </TouchableOpacity>
  );

  if (isPending) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <View style={styles.searchContainer}>
          <Search size={16} color="#64748b" />
          <Text style={styles.searchPlaceholder}>Search transactions...</Text>
        </View>

        <TouchableOpacity style={styles.dateFilter}>
          <Calendar size={16} color="#4361ee" />
          <Text style={styles.dateFilterText}>Filter</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.balanceSummary}>
        <View style={styles.balanceItem}>
          <Text style={styles.balanceLabel}>Current Balance</Text>
          <Text style={styles.balanceValue}>
            {/* {student.financialInfo?.currentBalance.toFixed(2) ?? "0.00"} FCFA */}
            3000 000 FCFA
          </Text>
        </View>

        <View style={styles.balanceDivider} />

        <View style={styles.balanceItem}>
          <Text style={styles.balanceLabel}>Last Transaction</Text>
          <Text style={styles.balanceDate}>
            {/* {student.financialInfo?.lastTransactionDate ?? "N/A"} */}
            Jun 30, 2023
          </Text>
        </View>
      </View>

      <Text style={styles.transactionsTitle}>Recent Transactions</Text>

      {transactions && transactions.length > 0 ? (
        <FlatList
          data={transactions}
          renderItem={renderTransactionItem}
          keyExtractor={(item, index) => `transaction-${index}`}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.transactionsList}
        />
      ) : (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>
            No transaction history available
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginRight: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2.5,
    elevation: 2,
  },
  searchPlaceholder: {
    marginLeft: 8,
    color: "#94a3b8",
    fontSize: 14,
  },
  dateFilter: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2.5,
    elevation: 2,
  },
  dateFilterText: {
    marginLeft: 6,
    color: "#4361ee",
    fontWeight: "500",
    fontSize: 14,
  },
  balanceSummary: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2.5,
    elevation: 2,
  },
  balanceItem: {
    flex: 1,
    alignItems: "center",
  },
  balanceLabel: {
    fontSize: 12,
    color: "#64748b",
    marginBottom: 4,
  },
  balanceValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1e293b",
  },
  balanceDate: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1e293b",
  },
  balanceDivider: {
    width: 1,
    backgroundColor: "#e2e8f0",
    marginHorizontal: 16,
  },
  transactionsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 12,
  },
  transactionsList: {
    paddingBottom: 20,
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2.5,
    elevation: 2,
  },
  transactionIcon: {
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 2,
  },
  transactionDescription: {
    fontSize: 12,
    color: "#64748b",
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 11,
    color: "#94a3b8",
  },
  transactionAmount: {
    alignItems: "flex-end",
  },
  amountText: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 2,
  },
  creditAmount: {
    color: "#10b981",
  },
  debitAmount: {
    color: "#ef4444",
  },
  transactionCategory: {
    fontSize: 11,
    color: "#64748b",
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  noDataContainer: {
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    borderRadius: 12,
  },
  noDataText: {
    fontSize: 16,
    color: "#94a3b8",
  },
});
