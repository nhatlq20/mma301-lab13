// src/screens/HomeScreen.js
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { getAllBills, formatVND } from '../db/database';

export default function HomeScreen({ navigation }) {
  const [bills, setBills] = useState([]);

  // Tự động tải lại danh sách mỗi khi quay về màn hình Home
  useFocusEffect(
    useCallback(() => {
      const data = getAllBills();
      setBills(data);
    }, [])
  );

  // Chọn icon tương ứng với Category
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Utilities':
        return <Ionicons name="flash" size={22} color="#6200ee" />;
      case 'Rent':
        return <Ionicons name="home" size={22} color="#6200ee" />;
      case 'Subscription':
        return <Ionicons name="wifi" size={22} color="#6200ee" />;
      case 'Finance':
        return <Ionicons name="card" size={22} color="#6200ee" />;
      case 'Health':
        return <Ionicons name="medkit" size={22} color="#6200ee" />;
      default:
        return <Ionicons name="receipt" size={22} color="#6200ee" />;
    }
  };

  const renderItem = ({ item }) => {
    const isPaid = item.status === 'Paid';
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('UpdateBill', { bill: item })}
      >
        <View style={styles.cardLeft}>
          <View style={styles.iconBox}>{getCategoryIcon(item.category)}</View>
          <View>
            <Text style={styles.billName}>{item.bill_name}</Text>
            <Text style={styles.category}>{item.category}</Text>
            <View style={styles.dateRow}>
              <Ionicons name="calendar-outline" size={13} color="#777" />
              <Text style={styles.dueDate}> Due: {item.due_date}</Text>
            </View>
          </View>
        </View>

        <View style={styles.cardRight}>
          <Text style={styles.amount}>{formatVND(item.amount)}</Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: isPaid ? '#4CAF50' : '#FFA000' },
            ]}
          >
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Banner ở đầu trang */}
      <ImageBackground
        source={{
          uri: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80',
        }}
        style={styles.banner}
      >
        <View style={styles.bannerOverlay}>
          <Text style={styles.bannerMainTitle}>RECURRING BILLS MANAGER</Text>
          <Text style={styles.bannerSubTitle}>Recurring Bills</Text>
        </View>
      </ImageBackground>

      {/* Danh sách Bills hoặc Trạng thái rỗng */}
      {bills.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons
            name="receipt-text-outline"
            size={64}
            color="#888"
          />
          <Text style={styles.emptyTitle}>No bills yet</Text>
          <Text style={styles.emptySub}>
            Press "+" button to add your recurring bills
          </Text>
        </View>
      ) : (
        <FlatList
          data={bills}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />
      )}

      {/* Nút Floating Action Button (+) */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddBill')}
      >
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F6FA' },
  banner: { width: '100%', height: 150, justifyContent: 'flex-end' },
  bannerOverlay: {
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  bannerMainTitle: {
    color: '#FFD54F',
    fontSize: 13,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  bannerSubTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 2,
  },
  listContent: { padding: 14, paddingBottom: 80 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  cardLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#EDE7F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  billName: { fontSize: 15, fontWeight: 'bold', color: '#222' },
  category: { fontSize: 12, color: '#888', marginVertical: 2 },
  dateRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  dueDate: { fontSize: 12, color: '#666' },
  cardRight: { alignItems: 'flex-end' },
  amount: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#6200ee',
    marginBottom: 6,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  statusText: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  emptyTitle: { fontSize: 16, fontWeight: '600', color: '#555', marginTop: 12 },
  emptySub: {
    fontSize: 13,
    color: '#888',
    textAlign: 'center',
    marginTop: 4,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#6200ee',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
});