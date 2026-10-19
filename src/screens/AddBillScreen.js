// src/screens/AddBillScreen.js
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
import { addBill } from '../db/database';

const CATEGORIES = ['Utilities', 'Subscription', 'Rent', 'Finance', 'Health'];
const STATUSES = ['Unpaid', 'Paid'];

export default function AddBillScreen({ navigation }) {
  const [billName, setBillName] = useState('');
  const [category, setCategory] = useState('Utilities');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState('Unpaid'); // Mặc định là Unpaid

  const [catModalVisible, setCatModalVisible] = useState(false);
  const [statusModalVisible, setStatusModalVisible] = useState(false);

  const handleSave = () => {
    // Validate dữ liệu đầu vào (Requirements 5 - Figure 2)
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

    addBill(billName.trim(), category, amount.trim(), status, dueDate.trim());
    Alert.alert('Success', 'Bill added successfully', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Bill Name */}
      <Text style={styles.label}>Bill Name *</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Electricity - September"
        value={billName}
        onChangeText={setBillName}
      />

      {/* Category Dropdown */}
      <Text style={styles.label}>Category *</Text>
      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setCatModalVisible(true)}
      >
        <Text style={styles.dropdownText}>{category}</Text>
        <Ionicons name="caret-down" size={16} color="#555" />
      </TouchableOpacity>

      {/* Amount */}
      <Text style={styles.label}>Amount (VND) *</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. 850000"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      {/* Due Date */}
      <Text style={styles.label}>Due Date (YYYY-MM-DD) *</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. 2025-10-30"
        value={dueDate}
        onChangeText={setDueDate}
      />

      {/* Status Dropdown */}
      <Text style={styles.label}>Status</Text>
      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setStatusModalVisible(true)}
      >
        <Text style={styles.dropdownText}>{status}</Text>
        <Ionicons name="caret-down" size={16} color="#555" />
      </TouchableOpacity>

      {/* Buttons: Save & Back */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.btn, styles.saveBtn]}
          onPress={handleSave}
        >
          <Ionicons name="checkmark-circle" size={18} color="#fff" />
          <Text style={styles.btnText}> Save</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, styles.backBtn]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back-circle" size={18} color="#fff" />
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
    gap: 12,
  },
  btn: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 12,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveBtn: { backgroundColor: '#4CAF50' },
  backBtn: { backgroundColor: '#757575' },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
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