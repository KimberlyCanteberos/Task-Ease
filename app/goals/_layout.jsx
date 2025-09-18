import { Tabs } from 'expo-router';
import { Ionicons } from "@expo/vector-icons";
import { GoalsProvider } from '../../contexts/GoalsContext';
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { useRouter } from "expo-router";
import { View, ActivityIndicator } from "react-native";

export default function GoalsLayout() {
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace("/auth/login");
      }
      setChecking(false);
    });
    return unsub;
  }, []);

  if (checking) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: '#F9E3D6' }}>
        <ActivityIndicator size="large" color="#563066" />
      </View>
    );
  }

  return (
    <GoalsProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#563066', // app theme color
          tabBarInactiveTintColor: 'grey',
          tabBarStyle: { backgroundColor: '#F9E3D6', borderTopWidth: 0 },
        }}
      >
        {/* Your Goals Tab */}
        <Tabs.Screen
          name="index"
          options={{
            title: 'Your Task',
            tabBarIcon: ({ focused }) => (
              <Ionicons
                size={24}
                name={focused ? 'home' : 'home-outline'}
                color={focused ? '#563066' : 'grey'}
              />
            ),
          }}
        />

        {/* Create Goal Tab */}
        <Tabs.Screen
          name="create"
          options={{
            title: 'Add Task',
            tabBarIcon: ({ focused }) => (
              <Ionicons
                size={24}
                name={focused ? 'create' : 'create-outline'}
                color={focused ? '#563066' : 'grey'}
              />
            ),
          }}
        />

            <Tabs.Screen name="edit/[id]" 
            options={{ href: null, }} />
      </Tabs>
    </GoalsProvider>
  );
}
