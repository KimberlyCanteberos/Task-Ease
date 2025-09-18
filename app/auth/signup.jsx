import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { router } from "expo-router";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.replace("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

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

      <Pressable style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </Pressable>

      <Pressable
        style={styles.linkButton}
        onPress={() => router.push("/auth/login")}
      >
        <Text style={styles.linkText}>Already have an account? Login</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9E3D6",
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
    backgroundColor: "#F4A9C7",
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
