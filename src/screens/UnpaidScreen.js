// src/screens/UnpaidScreen.js
import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getUnpaidBills, formatVND } from '../db/database';

export default function UnpaidScreen() {
  const [unpaidBills, setUnpaidBills] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const data = getUnpaidBills();
      setUnpaidBills(data);
    }, [])
  );

  // Tính tổng số tiền chưa thanh toán
  const totalOutstanding = unpaidBills.reduce(
    (sum, item) => sum + Number(item.amount),
    0
  );

  const renderItem = ({ item }) => (
    <View style={styles.itemCard}>
      <View style={styles.leftRow}>
        <View style={styles.warnIcon}>
          <Ionicons name="alert-circle" size={22} color="#fff" />
        </View>
        <View>
          <Text style={styles.billName}>{item.bill_name}</Text>
          <Text style={styles.category}>{item.category}</Text>
        </View>
      </View>
      <Text style={styles.amount}>{formatVND(item.amount)}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Phần Header Unpaid Bills */}
      <View style={styles.headerBox}>
        <View style={styles.bigAlertCircle}>
          <Ionicons name="alert" size={32} color="#fff" />
        </View>
        <Text style={styles.headerTitle}>Unpaid Bills</Text>
        <Text style={styles.headerSub}>
          {unpaidBills.length} {unpaidBills.length === 1 ? 'bill' : 'bills'} unpaid
        </Text>
      </View>

      {/* Danh sách Unpaid Bills + Khung Tổng kết ở cuối danh sách */}
      <FlatList
        data={unpaidBills}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>All bills are paid!</Text>
        }
        ListFooterComponent={
          <View style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <Ionicons name="calculator" size={18} color="#6200ee" />
              <Text style={styles.summaryTitle}> Outstanding Summary</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Number of unpaid bills:</Text>
              <Text style={styles.summaryCount}>{unpaidBills.length}</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Outstanding:</Text>
              <Text style={styles.summaryTotal}>
                {formatVND(totalOutstanding)}
              </Text>
            </View>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F6FA' },
  headerBox: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  bigAlertCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFA000',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 6,
    borderColor: '#FFF3E0',
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#222' },
  headerSub: { fontSize: 13, color: '#888', marginTop: 4 },
  listContent: { padding: 14 },
  itemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 1,
  },
  leftRow: { flexDirection: 'row', alignItems: 'center' },
  warnIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FFA000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  billName: { fontSize: 14, fontWeight: 'bold', color: '#222' },
  category: { fontSize: 12, color: '#888', marginTop: 2 },
  amount: { fontSize: 14, fontWeight: 'bold', color: '#FFA000' },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    marginVertical: 20,
    fontSize: 14,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 16,
    marginTop: 10,
    borderWidth: 1.5,
    borderColor: '#FFE082',
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  summaryTitle: { fontSize: 15, fontWeight: 'bold', color: '#333' },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 6,
  },
  summaryLabel: { fontSize: 13, color: '#666' },
  summaryCount: { fontSize: 14, fontWeight: 'bold', color: '#333' },
  summaryTotal: { fontSize: 18, fontWeight: 'bold', color: '#FFA000' },
});