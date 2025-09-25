import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { FlatList, Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAudio } from '../../components/AudioContext';
import { styles } from '../../components/MusicLibrary.styles';

export default function MusicLibrary() {
  const { songs, currentSong, isPlaying, togglePlayPause, setCurrentIndex } = useAudio();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  // Handle song press
  const handleSongPress = async (songItem: typeof songs[0]) => {
    const index = songs.findIndex(s => s.id === songItem.id);
    if (index === -1) return;

    // Toggle play/pause if same song
    if (currentSong && currentSong.id === songItem.id) {
      togglePlayPause();
      return;
    }

    // Load and play new song
    const sound = await setCurrentIndex(index);
    if (sound) await sound.playAsync();
  };

  // Filter songs based on search query
  const filteredSongs = songs.filter(
    song =>
      song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', paddingHorizontal: 20, marginBottom: 20 }}>


        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          {showSearch ? (
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search songs..."
              placeholderTextColor="#aaa"
              style={{
                width: '100%',
                backgroundColor: '#3b2f6b',
                color: 'white',
                borderRadius: 10,
                paddingHorizontal: 15,
                height: 40,
                marginTop: 0,
              }}
            />
          ) : (
            <Text
              style={{
                fontSize: 30,
                color: 'white',
                fontFamily: 'Inter-Bold',
                marginTop: 30,
                textAlign: 'center',
              }}
            >
              Your Library
            </Text>
          )}
        </View>

        <TouchableOpacity onPress={() => setShowSearch(prev => !prev)}>
          <Ionicons name="search" size={28} color="white" style={{ marginRight: -5, marginTop: 0 }} />
        </TouchableOpacity>
      </View>

      {/* Song List */}
      <FlatList
        style={{ marginBottom: 65 }}
        showsVerticalScrollIndicator={false}
        data={filteredSongs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleSongPress(item)} style={styles.songRow}>
            <Ionicons
              name={currentSong && currentSong.id === item.id && isPlaying ? 'pause-circle' : 'play-circle'}
              size={32}
              color="white"
              style={{ marginRight: 12 }}
            />
            <Image source={item.image} style={styles.songImage} />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.songTitle}>{item.title}</Text>
              <Text style={styles.artist}>{item.artist}</Text>
            </View>
            <Text style={{ color: '#ffffffff', fontSize: 13, fontWeight: 'bold' }}>{item.duration}</Text>
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
        ListFooterComponent={<View style={{ height: 50 }} />}
      />
    </SafeAreaView>
  );
}
