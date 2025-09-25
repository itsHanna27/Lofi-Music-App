import { Ionicons } from '@expo/vector-icons';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Song, useAudio } from '../../components/AudioContext';
import { styles } from '../../components/MusicLibrary.styles';


type DrawerParamList = {
  Tabs: undefined;
  User: undefined;
};

const DiscoverScreen: React.FC = () => {
  const { recentlyPlayed, setCurrentIndex, togglePlayPause, currentSong, isPlaying, songs } = useAudio();
  const router = useRouter();

  // Drawer navigation
  const navigation = useNavigation<DrawerNavigationProp<DrawerParamList>>();

  // Play/pause logic
  const handleSongPress = async (song: Song) => {
    const index = songs.findIndex((s) => s.id === song.id);
    if (index === -1) return;

    if (currentSong && currentSong.id === songs[index].id) {
      togglePlayPause();
      return;
    }

    const sound = await setCurrentIndex(index);
    if (sound) await sound.playAsync();
  };

  const playlists = [
    { id: '1', title: 'Lofi Mix', image: require('../../assets/images/album1.jpg') },
    { id: '2', title: 'Favorites', image: require('../../assets/images/album2.jpg') },
    { id: '3', title: 'Nature Sounds', image: require('../../assets/images/album3.jpg') },
    { id: '4', title: 'Piano Vibes', image: require('../../assets/images/album4.jpg') },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#261f46ff', padding: 20 }}>
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          paddingHorizontal: 20,
          marginBottom: 20,
        }}
      >
        <Text
          style={{
            fontSize: 30,
            color: 'white',
            fontFamily: 'Inter-Bold',
            marginTop: 30,
            justifyContent: 'center',
            alignItems: 'center',
            marginLeft: 60,
          }}
        >
          Discover
        </Text>

        {/* Drawer button */}
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: 'white',
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: -20,
            }}
          >
            <Ionicons name="person" size={24} color="black" />
          </View>
        </TouchableOpacity>
      </View>

      {/* Playlists */}
      <Text style={{ color: 'white', paddingBottom: 10, fontSize: 16 }}>Playlists</Text>
      <View style={{ marginHorizontal: -20 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={{ flexDirection: 'row', gap: 30 }}>
            {playlists.map((pl, index) => (
              <TouchableOpacity
                key={pl.id}
                style={{ alignItems: 'center', marginLeft: index === 0 ? 20 : 0 }}
                onPress={() => {
                  switch (pl.title) {
                    case 'Nature Sounds':
                      router.push({ pathname: '/NatureSound', params: { title: pl.title } });
                      break;
                    case 'Lofi Mix':
                      router.push({ pathname: '/LofiMix', params: { title: pl.title } });
                      break;
                    case 'Piano Vibes':
                      router.push({ pathname: '/PianoVibes', params: { title: pl.title } });
                      break;
                    case 'Favorites':
                      router.push({ pathname: '/Favorites', params: { title: pl.title } });
                      break;
                  }
                }}
              >
                <Image source={pl.image} style={{ width: 210, height: 210, borderRadius: 35 }} />
                <Text style={{ color: 'white', fontSize: 18, marginTop: 5, fontWeight: 'bold' }}>
                  {pl.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Recently Played */}
      <Text style={{ color: 'white', paddingTop: 20, paddingBottom: 20, fontSize: 16 }}>Recently Played</Text>
      <FlatList
        style={{ marginBottom: 65 }}
        showsVerticalScrollIndicator={false}
        data={recentlyPlayed}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.songRow} onPress={() => handleSongPress(item)}>
            <Ionicons
              name={currentSong?.id === item.id && isPlaying ? 'pause-circle' : 'play-circle'}
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
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        ListFooterComponent={<View style={{ height: 50 }} />}
      />
    </SafeAreaView>
  );
};

export default DiscoverScreen;
