// App.js
import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { initDB } from './src/db/database';
import HomeScreen from './src/screens/HomeScreen';
import AddBillScreen from './src/screens/AddBillScreen';
import UpdateBillScreen from './src/screens/UpdateBillScreen';
import UnpaidScreen from './src/screens/UnpaidScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Stack cho nhánh Home (Home -> AddBill / UpdateBill)
function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#6200ee' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddBill"
        component={AddBillScreen}
        options={{ title: 'Add New Bill' }}
      />
      <Stack.Screen
        name="UpdateBill"
        component={UpdateBillScreen}
        options={{ title: 'Update Bill' }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  useEffect(() => {
    initDB(); // Khởi tạo bảng SQLite ngay khi mở ứng dụng
  }, []);

  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: '#6200ee',
          tabBarInactiveTintColor: '#888',
          tabBarStyle: { height: 60, paddingBottom: 8, paddingTop: 4 },
          tabBarIcon: ({ color, size }) => {
            if (route.name === 'Home') {
              return <Ionicons name="home" size={size} color={color} />;
            }
            return <Ionicons name="alert-circle" size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeStack} />
        <Tab.Screen name="Unpaid" component={UnpaidScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}