import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { router } from "expo-router";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#A385C0"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#A385C0"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Pressable style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </Pressable>

      <Pressable
        style={styles.linkButton}
        onPress={() => router.push("/auth/signup")}
      >
        <Text style={styles.linkText}>Don’t have an account? Sign up</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9E3D6", // soft girly base
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    textAlign: "center",
    marginBottom: 30,
    fontWeight: "bold",
    color: "#563066",
  },
  input: {
    borderWidth: 1,
    borderColor: "#A385C0",
    padding: 12,
    marginBottom: 15,
    borderRadius: 10,
    backgroundColor: "white",
    color: "#563066",
  },
  button: {
    backgroundColor: "#F4A9C7", // pink button
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  linkButton: {
    marginTop: 15,
    alignItems: "center",
  },
  linkText: {
    color: "#7A5799",
    fontSize: 14,
  },
  error: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
});
