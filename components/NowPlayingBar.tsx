import { Ionicons } from '@expo/vector-icons';
import { Image, Text, View } from 'react-native';
import { useAudio } from './AudioContext';

export default function NowPlayingBar() {
  const { currentSong, isPlaying, togglePlayPause, playNext, playPrevious, stop } = useAudio();

  if (!currentSong) {
    console.log('NowPlayingBar: no current song, returning null');
    return null;
  }

  return (
    <View
      style={{
        marginHorizontal: 10,
        marginVertical: 5,
        borderRadius: 30,
        backgroundColor: '#1e1e2e',
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 10 }}>
        {/* Song Image */}
        <Image
          source={currentSong.image}
          style={{ width: 50, height: 50, borderRadius: 8, marginRight: 12, resizeMode: 'cover' }}
        />

        {/* Song Info */}
        <View style={{ flex: 1 }}>
          <Text style={{ color: 'white', fontWeight: '600', fontSize: 13 }} numberOfLines={1}>
            {currentSong.title}
          </Text>
          <Text style={{ color: 'gray', fontSize: 12 }} numberOfLines={1}>
            {currentSong.artist}
          </Text>
        </View>

        {/* Playback Controls */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Ionicons
            name="play-skip-back"
            size={23}
            color="white"
            onPress={() => playPrevious()}
          />
          <Ionicons
            name={isPlaying ? 'pause' : 'play'}
            size={23}
            color="white"
            onPress={() => togglePlayPause()}
          />
          <Ionicons
            name="play-skip-forward"
            size={23}
            color="white"
            onPress={() => playNext()}
          />
        </View>

        {/* Stop / Close Button */}
        <Ionicons
          name="close"
          size={18}
          color="white"
          onPress={() => stop()}
          style={{ marginLeft: 12 }}
        />
      </View>
    </View>
  );
}
