import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useState } from "react";
import {
  Alert, ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { auth } from "../components/firebaseConfig";

export default function SignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);

  const handleSignUp = async () => {
  try {
    // 1. Create the user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    // 2. Get the user object
    const user = userCredential.user;

    // 3. Save the username to Firebase Auth profile
    await updateProfile(user, { displayName: username });

    Alert.alert("Success", "Account created successfully!");
    router.push("/LogIn");
  } catch (error) {
    if (error instanceof Error) {
      Alert.alert("Error", error.message);
    } else {
      Alert.alert("Error", String(error));
    }
  }
};


  return (
    <LinearGradient
      colors={["#6b21a8", "#2a2486ff", "#000"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 2, y: 1 }}
      style={styles.container}
    >
      <Ionicons
        name="headset"
        style={{
          color: "white",
          fontSize: 70,
          alignSelf: "center",
          position: "absolute",
          top: 70,
        }}
      />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.card}>
          <Text style={styles.title}>Create An Account</Text>

          {/* Username */}
          <View style={styles.inputContainer}>
            <Ionicons name="person-circle" style={{ color: "#a78bfa", fontSize: 20 }} />
            <TextInput
              placeholder="Username"
              placeholderTextColor="#ccc"
              value={username}
              onChangeText={setUsername}
              style={styles.input}
              autoCapitalize="none"
            />
          </View>

          {/* Email */}
          <View style={styles.inputContainer}>
            <Ionicons name="mail" style={{ color: "#a78bfa", fontSize: 20 }} />
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
              <Ionicons name={showPwd ? "eye-off" : "eye"} size={20} color="#c4b5fd" />
            </TouchableOpacity>
          </View>

          {/* Sign Up Button */}
          <TouchableOpacity style={styles.button} onPress={handleSignUp}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>

          {/* Links */}
          <View style={styles.links}>
            <TouchableOpacity onPress={() => router.push("/LogIn")}>
              <Text style={styles.linkText}>Log in</Text>
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
