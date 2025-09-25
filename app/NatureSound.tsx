import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useAudio } from "../components/AudioContext";
import NowPlayingBar from "../components/NowPlayingBar";

const NOW_PLAYING_HEIGHT = 60;

export default function NatureSoundsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    songs,
    currentSong,
    isPlaying,
    togglePlayPause,
    setCurrentIndex,
  } = useAudio() || {};
  const [loadingSong, setLoadingSong] = useState(false);

  const natureSongIds = ["2", "4"]; // Only Nature Sounds songs

  const handleSongPress = async (songId: string) => {
    if (loadingSong) return;
    setLoadingSong(true);

    const index = songs.findIndex((s) => s.id === songId);
    if (index === -1) {
      setLoadingSong(false);
      return;
    }

    const song = songs[index];

    if (currentSong?.id === song.id) {
      togglePlayPause();
      setLoadingSong(false);
      return;
    }

    await setCurrentIndex(index);

    if (!isPlaying) togglePlayPause();

    setLoadingSong(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#261f46ff" }}>
      <StatusBar barStyle="light-content" backgroundColor="#261f46ff" />

      {/* Header */}
      <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingVertical: 15 }}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 15 }}>
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
      </View>

      {/* Scrollable content */}
      <ScrollView
        contentContainerStyle={{
          paddingBottom: currentSong ? NOW_PLAYING_HEIGHT + insets.bottom + 0 : 0,
        }}
      >
        {/* Album Art & Info */}
        <View style={{ alignItems: "center", marginBottom: 30 }}>
          <Image
            source={require("../assets/images/album3.jpg")}
            style={{ width: 250, height: 250, borderRadius: 20 }}
          />
          <Text style={{ color: "white", fontWeight: "700", fontSize: 24, marginTop: 12 }}>
            Nature Sounds
          </Text>
          <Text
            style={{
              color: "gray",
              fontSize: 16,
              marginTop: 4,
              textAlign: "center",
              maxWidth: 300,
            }}
          >
            Gentle waves, rain, and forest sounds for deep focus and relaxation.
          </Text>
        </View>

        {/* Song List */}
        {songs
          .filter((song) => natureSongIds.includes(song.id))
          .map((song) => (
            <TouchableOpacity
              key={song.id}
              onPress={() => handleSongPress(song.id)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                borderRadius: 12,
                paddingVertical: 10,
                paddingHorizontal: 12,
                marginBottom: 18,
              }}
            >
              <Ionicons
                name={currentSong?.id === song.id && isPlaying ? "pause-circle" : "play-circle"}
                size={36}
                color="white"
                style={{ marginRight: 14 }}
              />
              <Image source={song.image} style={{ width: 75, height: 75, borderRadius: 12 }} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={{ color: "white", fontWeight: "600", fontSize: 16 }}>{song.title}</Text>
                <Text style={{ color: "gray", fontSize: 14 }}>{song.artist}</Text>
              </View>
              <Text style={{ color: "white", fontSize: 14, fontWeight: "bold" }}>{song.duration}</Text>
            </TouchableOpacity>
          ))}
      </ScrollView>

      {/* Now Playing Bar */}
      {currentSong && (
        <View style={[styles.nowPlaying, { bottom: insets.bottom + 20 }]}>
          <NowPlayingBar />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  nowPlaying: {
    position: "absolute",
    left: 0,
    right: 0,
    height: NOW_PLAYING_HEIGHT,
    zIndex: 10,
  },
});

export function NatureSounds() {
  return <Stack.Screen name="index" options={{ headerShown: false }} />;
}
