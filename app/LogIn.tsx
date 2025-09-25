import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Alert } from 'react-native';
import { auth } from "../components/firebaseConfig"; // adjust path if needed


import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);


  const handleLogin = async () => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    Alert.alert("Logged in successfully!");
    router.push("/Discover"); // or wherever user wants to go
  } catch (error) {
    // TypeScript-safe error handling
    if (error instanceof Error) {
      Alert.alert(error.message);
    } else {
      Alert.alert("An unknown error occurred.");
    }
  }
};


  return (
    <LinearGradient
      colors={["#6b21a8", "#4f46e5", "#000"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
          <Ionicons name="headset" style={{ color: "white", fontSize: 70, alignSelf: "center", position: "absolute", top: 70, }} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.card}>
          <Text style={styles.title}>Welcome Back</Text>

          {/* Email */}
          <View style={styles.inputContainer}>
            <Ionicons name= "mail" style={{ color: "#a78bfa", fontSize: 20 }} />
            <TextInput
              placeholder="Email"
              placeholderTextColor="#ccc"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Password */}
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed" style={{ color: "#a78bfa", fontSize: 20 }} />
            <TextInput
              placeholder="Password"
              placeholderTextColor="#ccc"
              value={password}
              onChangeText={setPassword}
              style={styles.input}
              secureTextEntry={!showPwd}
            />
            <TouchableOpacity onPress={() => setShowPwd(!showPwd)}>
              <Text style={styles.showPwd}>{showPwd ? <Ionicons name="eye-off" /> : <Ionicons name="eye" />}</Text>
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Log In</Text>
          </TouchableOpacity>

          {/* Links */}
          <View style={styles.links}>
            <TouchableOpacity onPress={() =>router.push('/SignUp')}>
              <Text style={styles.linkText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(167,139,250,0.4)",
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(167,139,250,0.3)",
  },
  input: {
    flex: 1,
    color: "#fff",
    marginLeft: 8,
  },
  showPwd: {
    color: "#c4b5fd",
    marginLeft: 8,
  },
  button: {
    flexDirection: "row",
    backgroundColor: "#8b5cf6",
    paddingVertical: 12,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
    gap: 8,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  links: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  linkText: {
    color: "#c4b5fd",
    fontSize: 12,
  },
});
