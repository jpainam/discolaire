import {
  CircleAlert as AlertCircle,
  Calendar,
  CircleCheck as CheckCircle,
  ChevronDown,
  ChevronUp,
  DollarSign,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import type { Student } from "~/types/student";

interface StudentFeesTabProps {
  student: Student;
}

export default function StudentFeesTab({ student }: StudentFeesTabProps) {
  const [expandedFee, setExpandedFee] = useState<string | null>(null);

  const toggleFeeExpansion = (feeId: string) => {
    if (expandedFee === feeId) {
      setExpandedFee(null);
    } else {
      setExpandedFee(feeId);
    }
  };

  // Calculate total paid and balance
  const calculateSummary = () => {
    let totalAmount = 0;
    let totalPaid = 0;

    student.fees.forEach((fee) => {
      totalAmount += fee.amount;
      totalPaid += fee.amountPaid;
    });

    const balance = totalAmount - totalPaid;
    const percentPaid = totalAmount > 0 ? (totalPaid / totalAmount) * 100 : 0;

    return {
      totalAmount,
      totalPaid,
      balance,
      percentPaid,
    };
  };

  const summary = calculateSummary();

  const renderPaymentItem = ({
    item,
    index,
  }: {
    item: { reference: string; date: string; method: string; amount: number };
    index: number;
  }) => (
    <View key={`${index}-item`} style={styles.paymentItem}>
      <View style={styles.paymentDetails}>
        <Text style={styles.paymentReference}>Receipt #{item.reference}</Text>
        <Text style={styles.paymentDate}>{item.date}</Text>
        <Text style={styles.paymentMethod}>{item.method}</Text>
      </View>
      <Text style={styles.paymentAmount}>${item.amount.toFixed(2)}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Fees Summary</Text>

        <View style={styles.summaryGrid}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total Fees</Text>
            <Text style={styles.summaryValue}>
              ${summary.totalAmount.toFixed(2)}
            </Text>
          </View>

          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Amount Paid</Text>
            <Text style={[styles.summaryValue, styles.paidValue]}>
              ${summary.totalPaid.toFixed(2)}
            </Text>
          </View>

          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Balance</Text>
            <Text
              style={[
                styles.summaryValue,
                summary.balance > 0 ? styles.balanceValue : styles.paidValue,
              ]}
            >
              ${summary.balance.toFixed(2)}
            </Text>
          </View>

          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Payment Status</Text>
            <View style={styles.statusContainer}>
              {summary.percentPaid >= 100 ? (
                <CheckCircle
                  size={16}
                  color="#10b981"
                  style={styles.statusIcon}
                />
              ) : (
                <AlertCircle
                  size={16}
                  color={summary.percentPaid > 0 ? "#f97316" : "#ef4444"}
                  style={styles.statusIcon}
                />
              )}
              <Text
                style={[
                  styles.statusText,
                  summary.percentPaid >= 100
                    ? styles.paidStatus
                    : summary.percentPaid > 0
                      ? styles.partialStatus
                      : styles.unpaidStatus,
                ]}
              >
                {summary.percentPaid >= 100
                  ? "Paid"
                  : summary.percentPaid > 0
                    ? "Partial"
                    : "Unpaid"}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBackground}>
            <View
              style={[
                styles.progressFill,
                { width: `${Math.min(summary.percentPaid, 100)}%` },
                summary.percentPaid >= 100
                  ? styles.progressFillComplete
                  : styles.progressFillPartial,
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {summary.percentPaid.toFixed(0)}% paid
          </Text>
        </View>
      </View>

      <Text style={styles.feesListTitle}>Fees Breakdown</Text>

      {student.fees.map((fee) => (
        <View key={fee.id} style={styles.feeCard}>
          <TouchableOpacity
            style={styles.feeHeader}
            onPress={() => toggleFeeExpansion(fee.id)}
            activeOpacity={0.7}
          >
            <View style={styles.feeType}>
              <DollarSign size={16} color="#4361ee" />
              <View style={styles.feeInfo}>
                <Text style={styles.feeName}>{fee.name}</Text>
                <Text style={styles.feePeriod}>{fee.period}</Text>
              </View>
            </View>

            <View style={styles.feeHeaderRight}>
              <View style={styles.feeAmounts}>
                <Text style={styles.feeAmountPaid}>
                  ${fee.amountPaid.toFixed(2)}
                </Text>
                <Text style={styles.feeAmount}>/${fee.amount.toFixed(2)}</Text>
              </View>

              {expandedFee === fee.id ? (
                <ChevronUp size={20} color="#64748b" />
              ) : (
                <ChevronDown size={20} color="#64748b" />
              )}
            </View>
          </TouchableOpacity>

          {expandedFee === fee.id && (
            <View style={styles.feeDetails}>
              <View style={styles.feeDueContainer}>
                <View style={styles.feeDueInfo}>
                  <Calendar size={16} color="#64748b" />
                  <Text style={styles.feeDueLabel}>Due Date</Text>
                </View>
                <Text style={styles.feeDueDate}>{fee.dueDate}</Text>
              </View>

              <View style={styles.divider} />

              <Text style={styles.paymentsTitle}>Payment History</Text>

              {fee.payments.length > 0 ? (
                <FlatList
                  data={fee.payments}
                  renderItem={renderPaymentItem}
                  keyExtractor={(item, index) => `${fee.id}-payment-${index}`}
                  scrollEnabled={false}
                />
              ) : (
                <View style={styles.noPaymentsContainer}>
                  <Text style={styles.noPaymentsText}>
                    No payments recorded
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
      ))}

      {student.fees.length === 0 && (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>No fees information available</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  summaryCard: {
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
  summaryTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 16,
  },
  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  summaryItem: {
    width: "50%",
    marginBottom: 16,
  },
  summaryLabel: {
    fontSize: 12,
    color: "#64748b",
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
  },
  paidValue: {
    color: "#10b981",
  },
  balanceValue: {
    color: "#ef4444",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusIcon: {
    marginRight: 4,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "600",
  },
  paidStatus: {
    color: "#10b981",
  },
  partialStatus: {
    color: "#f97316",
  },
  unpaidStatus: {
    color: "#ef4444",
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBackground: {
    height: 8,
    backgroundColor: "#e2e8f0",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 4,
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  progressFillComplete: {
    backgroundColor: "#10b981",
  },
  progressFillPartial: {
    backgroundColor: "#4361ee",
  },
  progressText: {
    fontSize: 12,
    color: "#64748b",
    textAlign: "right",
  },
  feesListTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 12,
  },
  feeCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2.5,
    elevation: 2,
  },
  feeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  feeType: {
    flexDirection: "row",
    alignItems: "center",
  },
  feeInfo: {
    marginLeft: 12,
  },
  feeName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1e293b",
  },
  feePeriod: {
    fontSize: 12,
    color: "#64748b",
  },
  feeHeaderRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  feeAmounts: {
    flexDirection: "row",
    alignItems: "baseline",
    marginRight: 16,
  },
  feeAmountPaid: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
  },
  feeAmount: {
    fontSize: 14,
    color: "#94a3b8",
  },
  feeDetails: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    backgroundColor: "#f8fafc",
  },
  feeDueContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  feeDueInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  feeDueLabel: {
    fontSize: 14,
    color: "#64748b",
    marginLeft: 8,
  },
  feeDueDate: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1e293b",
  },
  divider: {
    height: 1,
    backgroundColor: "#e2e8f0",
    marginBottom: 16,
  },
  paymentsTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1e293b",
    marginBottom: 12,
  },
  paymentItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  paymentDetails: {
    flex: 1,
  },
  paymentReference: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1e293b",
    marginBottom: 2,
  },
  paymentDate: {
    fontSize: 12,
    color: "#64748b",
  },
  paymentMethod: {
    fontSize: 12,
    color: "#94a3b8",
  },
  paymentAmount: {
    fontSize: 14,
    fontWeight: "600",
    color: "#10b981",
  },
  noPaymentsContainer: {
    padding: 16,
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 8,
  },
  noPaymentsText: {
    fontSize: 14,
    color: "#94a3b8",
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
