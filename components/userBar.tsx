import { DrawerContentComponentProps } from "@react-navigation/drawer";
import { CommonActions } from "@react-navigation/native";
import { getAuth, onAuthStateChanged, signOut, User } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAudio } from "../components/AudioContext";
import { db } from "./firebaseConfig";

const presetAvatars = [
  require('../assets/images/avatar1.jpg'),
  require('../assets/images/avatar2.jpg'),
  require('../assets/images/avatar3.jpg'),
  require('../assets/images/avatar4.jpg'),
  require('../assets/images/avatar5.jpg'),
];

export default function UserBar(props: DrawerContentComponentProps) {
  const { clearMemory } = useAudio();
  const auth = getAuth();

  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [avatar, setAvatar] = useState<number>(presetAvatars[0]);

  // Listen to auth state changes to ensure user is loaded
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return unsubscribe;
  }, []);

  const userName = user?.displayName || user?.email?.split("@")[0] || "User";

  // Load avatar from Firestore once user is ready
  useEffect(() => {
    const loadAvatar = async () => {
      if (!user) return;
      try {
        const userDocRef = doc(db, "users", user.uid);
        const snapshot = await getDoc(userDocRef);
        if (snapshot.exists()) {
          const data = snapshot.data();
          if (data.avatarIndex !== undefined) {
            setAvatar(presetAvatars[data.avatarIndex]);
            console.log("Loaded avatar index:", data.avatarIndex);
          }
        } else {
          // Create user doc with default avatar
          await setDoc(userDocRef, { avatarIndex: 0, createdAt: new Date() });
          console.log("Created user doc for", user.uid);
        }
      } catch (err) {
        console.error("Failed to load avatar from Firestore", err);
      }
    };
    loadAvatar();
  }, [user]);

  const handleLogout = async () => {
    try {
      setLoading(true);
      await signOut(auth);
      clearMemory();
      props.navigation.dispatch(
        CommonActions.reset({ index: 0, routes: [{ name: "LogIn" }] })
      );
    } catch (err) {
      Alert.alert("Error", "Failed to log out. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const selectPresetAvatar = async (item: number, index: number) => {
    if (!user) {
      Alert.alert("Error", "User not loaded yet.");
      return;
    }

    setAvatar(item);
    setModalVisible(false);

    try {
      console.log("Saving avatar index:", index, "for user:", user.uid);
      await setDoc(doc(db, "users", user.uid), { avatarIndex: index }, { merge: true });
      console.log("Avatar saved successfully!");
    } catch (err) {
      console.error("Failed to save avatar in Firestore", err);
      Alert.alert("Error", "Failed to set avatar. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Image source={avatar} style={styles.avatar} />
          <Text style={styles.editText}>Edit Avatar</Text>
        </TouchableOpacity>

        <Text style={styles.greeting}>Hello, {userName}</Text>
        <Text style={styles.subtitle}>Welcome back to your music space</Text>
      </View>

      <View style={{ flex: 1 }} />

      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.7 }]}
        onPress={handleLogout}
        disabled={loading}
        activeOpacity={0.85}
      >
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Log Out</Text>}
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choose an Avatar</Text>

            <FlatList
              data={presetAvatars}
              horizontal
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item, index }) => (
                <TouchableOpacity onPress={() => selectPresetAvatar(item, index)}>
                  <Image source={item} style={styles.presetAvatar} />
                </TouchableOpacity>
              )}
              style={{ marginBottom: 20 }}
            />

            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1a0b2e", padding: 24 },
  header: { alignItems: "center", marginTop: 50 },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 10, borderWidth: 3, borderColor: "#9d4edd" },
  editText: { color: "#cbb9ff", fontSize: 12, textAlign: "center", marginBottom: 12 },
  greeting: { fontSize: 22, fontWeight: "700", color: "#fff", marginBottom: 4 },
  subtitle: { fontSize: 14, color: "#cbb9ff", textAlign: "center", marginBottom: 30 },
  button: { paddingVertical: 14, paddingHorizontal: 20, backgroundColor: "#9d4edd", borderRadius: 16, marginBottom: 30, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  modalBackground: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "center", alignItems: "center" },
  modalContent: { width: "85%", backgroundColor: "#2a0b47", borderRadius: 20, padding: 20, alignItems: "center" },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 16, color: "#fff" },
  presetAvatar: { width: 80, height: 80, borderRadius: 50, marginHorizontal: 8, borderWidth: 2, borderColor: "#9d4edd" },
  closeButton: { padding: 8 },
  closeText: { color: "#cbb9ff", fontWeight: "600" },
});
