import { ThemedView } from '@/components/ThemedView';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ArrowUDownLeftIcon, ArrowUDownRightIcon } from 'phosphor-react-native';
import { useEffect, useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Song, useAudio } from '../../components/AudioContext';
import styles from '../../components/Play.style';





export default function PlayScreen() {
  const {
    songs,
    currentSong,
    isPlaying,
    positionMillis,
    durationMillis,
    togglePlayPause,
    playNext,
    playPrevious,
    toggleShuffle,
    isShuffle,
    toggleLoop,
    isLooping,
    setCurrentIndex,
    favorites,
    toggleFavorite,
    skipBackward,
    skipForward
  } = useAudio();

  const [song, setSong] = useState<Song>(songs[0]); // default to first song

  const [progressBarWidth, setProgressBarWidth] = useState(0);

  // Load current song or last played song
  useEffect(() => {
    const loadSong = async () => {
      if (currentSong) {
        setSong(currentSong);
        return;
      }

      const lastPlayingJSON = await AsyncStorage.getItem('@last_playing');
      if (lastPlayingJSON) {
        const lastSongId = JSON.parse(lastPlayingJSON) as string;
        const lastSong = songs.find(s => s.id === lastSongId);
        if (lastSong) setSong(lastSong);
      }
    };
    loadSong();
  }, [songs, currentSong]);

  const formatMillis = (millis: number) => {
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handlePlayPress = async () => {
    if (!song.sound) {
      const index = songs.findIndex(s => s.id === song.id);
      if (index !== -1) await setCurrentIndex(index);
      return;
    }
    togglePlayPause();
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 50 }}>
        {/* Playlist info */}
        <Text style={{ fontSize: 16, fontWeight: '100', color: '#fff', marginTop: 10, alignSelf: 'center' }}>Playlist</Text>
        <Text style={{ fontSize: 23, fontWeight: 'bold', color: '#fff', marginTop: 5, alignSelf: 'center' }}>{song.playlist}</Text>

        {/* Song Image */}
        <Image source={song.image} style={{ width: 300, height: 300, borderRadius: 200, marginTop: 20, alignSelf: 'center' }} />

        {/* Song Title and Artist */}
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#fff', marginTop: 10, alignSelf: 'center' }}>{song.title}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
          <View style={{ width: 26 }} />
          <Text style={{ flex: 1, textAlign: 'center', fontSize: 16, fontWeight: '100', color: '#fff' }}>{song.artist}</Text>
          <Ionicons
            name={favorites.includes(song.id) ? "heart" : "heart-outline"}
            size={26}
            color={favorites.includes(song.id) ? "#6a00ffff" : "#fff"}
            onPress={() => toggleFavorite(song.id)}
          />
        </View>

        {/* Progress Bar */}
        <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', alignSelf: 'center', marginTop: 20 }}>
          <Text style={{ color: '#fff', fontSize: 12 }}>{formatMillis(positionMillis)}</Text>
          <TouchableOpacity
            style={{ flex: 1, height: 5, backgroundColor: '#9a5bff2c', borderRadius: 5, marginHorizontal: 10 }}
            activeOpacity={1}
            onLayout={event => setProgressBarWidth(event.nativeEvent.layout.width)}
          >
            <View style={{ height: '100%', width: durationMillis ? `${(positionMillis / durationMillis) * 100}%` : '0%', backgroundColor: '#8967edd9', borderRadius: 2 }} />
          </TouchableOpacity>
          <Text style={{ color: '#fff', fontSize: 12 }}>{formatMillis(durationMillis)}</Text>
        </View>

        {/* Main Controls */}
        <View style={{ alignSelf: 'center', marginTop: 20, flexDirection: 'row', alignItems: 'center', gap: 30 }}>
          <Ionicons name="play-skip-back" size={50} color="#fff" onPress={playPrevious} />
          <Ionicons name={isPlaying ? 'pause' : 'play'} size={50} color="#fff" onPress={handlePlayPress} />
          <Ionicons name="play-skip-forward" size={50} color="#fff" onPress={playNext} />
        </View>

        {/* Bottom Controls */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 20, paddingHorizontal: 20 }}>
          <Ionicons name="shuffle" size={28} color={isShuffle ? '#8967edd9' : '#fff'} onPress={toggleShuffle} />
          <TouchableOpacity onPress={skipBackward}>
            <ArrowUDownRightIcon size={28} color="#fff" weight="bold" style={{ transform: [{ rotate: '180deg' }] }} />
          </TouchableOpacity>
          <TouchableOpacity onPress={skipForward}>
            <ArrowUDownLeftIcon size={28} color="#fff" weight="bold" style={{ transform: [{ rotate: '180deg' }] }} />
          </TouchableOpacity>
          <Ionicons name="repeat" size={28} color={isLooping ? '#8967edd9' : '#fff'} onPress={toggleLoop} />
        </View>
      </ScrollView>
    </ThemedView>
  );
}
