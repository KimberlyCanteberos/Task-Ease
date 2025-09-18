import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Pressable } from "react-native";
import { router } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseConfig";

const Home = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace("/auth/login");
      } else {
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#F4A9C7" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Task Ease</Text>
      <Text style={styles.subtitle}>Organize your tasks with ease</Text>

      <Pressable style={styles.button} onPress={() => router.push("/goals")}>
        <Text style={styles.buttonText}>View Your Tasks</Text>
      </Pressable>

      <Pressable style={styles.button} onPress={() => router.push("/goals/create")}>
        <Text style={styles.buttonText}>Add a New Task</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F9E3D6", 
    padding: 20,
  },
  title: {
    marginBottom: 10,
    fontSize: 32,
    fontWeight: "bold",
    color: "#563066",
  },
  subtitle: {
    fontSize: 16,
    color: "#7A5799",
    marginBottom: 40,
  },
  button: {
    marginVertical: 12,
    paddingVertical: 14,
    paddingHorizontal: 30,
    backgroundColor: "#A385C0",
    borderRadius: 20,
    shadowColor: "#563066",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Home;
