// src/screens/UpdateBillScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { updateBill, deleteBill } from '../db/database';

const CATEGORIES = ['Utilities', 'Subscription', 'Rent', 'Finance', 'Health'];
const STATUSES = ['Unpaid', 'Paid'];

export default function UpdateBillScreen({ route, navigation }) {
  const { bill } = route.params;

  const [billName, setBillName] = useState(bill.bill_name);
  const [category, setCategory] = useState(bill.category);
  const [amount, setAmount] = useState(bill.amount.toString());
  const [dueDate, setDueDate] = useState(bill.due_date);
  const [status, setStatus] = useState(bill.status);

  const [catModalVisible, setCatModalVisible] = useState(false);
  const [statusModalVisible, setStatusModalVisible] = useState(false);

  const handleUpdate = () => {
    if (!billName.trim()) {
      Alert.alert('Validation', 'Please enter bill name');
      return;
    }
    if (!amount.trim() || isNaN(Number(amount)) || Number(amount) <= 0) {
      Alert.alert('Validation', 'Please enter a valid amount');
      return;
    }
    if (!dueDate.trim()) {
      Alert.alert('Validation', 'Please enter due date (YYYY-MM-DD)');
      return;
    }

    updateBill(
      bill.id,
      billName.trim(),
      category,
      amount.trim(),
      status,
      dueDate.trim()
    );
    Alert.alert('Success', 'Bill updated successfully', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  const handleDelete = () => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this bill?',
      [
        { text: 'CANCEL', style: 'cancel' },
        {
          text: 'DELETE',
          style: 'destructive',
          onPress: () => {
            deleteBill(bill.id);
            Alert.alert('Success', 'Bill deleted', [
              { text: 'OK', onPress: () => navigation.goBack() },
            ]);
          },
        },
      ]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Bill Name *</Text>
      <TextInput
        style={styles.input}
        value={billName}
        onChangeText={setBillName}
      />

      <Text style={styles.label}>Category *</Text>
      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setCatModalVisible(true)}
      >
        <Text style={styles.dropdownText}>{category}</Text>
        <Ionicons name="caret-down" size={16} color="#555" />
      </TouchableOpacity>

      <Text style={styles.label}>Amount (VND) *</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      <Text style={styles.label}>Due Date (YYYY-MM-DD) *</Text>
      <TextInput
        style={styles.input}
        value={dueDate}
        onChangeText={setDueDate}
      />

      <Text style={styles.label}>Status *</Text>
      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setStatusModalVisible(true)}
      >
        <Text style={styles.dropdownText}>{status}</Text>
        <Ionicons name="caret-down" size={16} color="#555" />
      </TouchableOpacity>

      {/* Ba nút nằm trên cùng một hàng: Update - Delete - Back */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.btn, styles.updateBtn]}
          onPress={handleUpdate}
        >
          <Ionicons name="save-outline" size={16} color="#fff" />
          <Text style={styles.btnText}> Update</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, styles.deleteBtn]}
          onPress={handleDelete}
        >
          <Ionicons name="trash-outline" size={16} color="#fff" />
          <Text style={styles.btnText}> Delete</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, styles.backBtn]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={16} color="#fff" />
          <Text style={styles.btnText}> Back</Text>
        </TouchableOpacity>
      </View>

      {/* Modal chọn Category */}
      <Modal visible={catModalVisible} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setCatModalVisible(false)}
        >
          <View style={styles.modalBox}>
            {CATEGORIES.map((item) => (
              <TouchableOpacity
                key={item}
                style={styles.modalItem}
                onPress={() => {
                  setCategory(item);
                  setCatModalVisible(false);
                }}
              >
                <Text style={styles.modalItemText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Modal chọn Status */}
      <Modal visible={statusModalVisible} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setStatusModalVisible(false)}
        >
          <View style={styles.modalBox}>
            {STATUSES.map((item) => (
              <TouchableOpacity
                key={item}
                style={styles.modalItem}
                onPress={() => {
                  setStatus(item);
                  setStatusModalVisible(false);
                }}
              >
                <Text style={styles.modalItemText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff', flexGrow: 1 },
  label: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 14,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    backgroundColor: '#FAFAFA',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#FAFAFA',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: { fontSize: 14, color: '#333' },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 28,
    gap: 8,
  },
  btn: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 12,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  updateBtn: { backgroundColor: '#4CAF50' },
  deleteBtn: { backgroundColor: '#D32F2F' },
  backBtn: { backgroundColor: '#757575' },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 30,
  },
  modalBox: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 8,
  },
  modalItem: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: '#eee',
  },
  modalItemText: { fontSize: 15, color: '#333' },
});