import AsyncStorage from '@react-native-async-storage/async-storage';
import { Asset } from 'expo-asset';
import { Audio, AVPlaybackStatusSuccess } from 'expo-av';
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

export interface Song {
  id: string;
  title: string;
  artist: string;
  image: any;
  file: any;
  duration: string;
  sound?: Audio.Sound;
  playlist: string;
}

interface AudioContextType {
  songs: Song[];
  currentSong: Song | null;
  isPlaying: boolean;
  isShuffle: boolean;
  isLooping: boolean;
  recentlyPlayed: Song[];
  togglePlayPause: () => void;
  setCurrentIndex: (index: number) => Promise<Audio.Sound | null>;
  playNext: () => void;
  playPrevious: () => void;
  toggleShuffle: () => void;
  toggleLoop: () => void;
  positionMillis: number;
  durationMillis: number;
  favorites: string[];
  toggleFavorite: (songId: string) => void;
  stop: () => Promise<void>;
  clearMemory: () => void;
  skipForward: () => void;
  skipBackward: () => void;
  userId: string;
}

const AudioContext = createContext<AudioContextType>({} as AudioContextType);

// ✅ Always unique storage key per user (no guest fallback)
const makeKey = (userId: string, base: string) => `${base}_${userId}`;

export const AudioProvider: React.FC<{ children: React.ReactNode; userId: string }> = ({ children, userId }) => {
  const [songs] = useState<Song[]>([
    { id: '1', title: 'Lofi Chill Mix', artist: 'Settle', image: require('../assets/images/cover1.jpg'), duration: '28:29', file: require('../assets/audio/lofichill.m4a'), playlist: 'Lofi Mix' },
    { id: '2', title: 'Heavy Rain', artist: 'Pure Relaxing Vibes', image: require('../assets/images/cover2.jpg'), duration: '15:22', file: require('../assets/audio/thunderstorm.m4a'), playlist: 'Nature Sounds' },
    { id: '3', title: '1 A.M Study Session', artist: 'Lofi Girl', image: require('../assets/images/cover3.png'), duration: '35:40', file: require('../assets/audio/1amstudy.m4a'), playlist: 'Lofi Mix' },
    { id: '4', title: 'Ocean Waves', artist: 'Nature Ambience', image: require('../assets/images/cover4.jpg'), duration: '19:51', file: require('../assets/audio/oceanwaves.m4a'), playlist: 'Nature Sounds' },
    { id: '5', title: 'Peaceful Day', artist: 'Lofi Girl', image: require('../assets/images/cover5.jpg'), duration: '23:06', file: require('../assets/audio/peacefulday.m4a'), playlist: 'Piano Vibes' },
    { id: '6', title: 'Anime Lofi Mix', artist: 'Kijungo', image: require('../assets/images/cover6.jpg'), duration: '34:42', file: require('../assets/audio/AnimeLofiMix.m4a'), playlist: 'Lofi Mix' },
    { id: '7', title: 'Wind', artist: 'Kami Sabishi', image: require('../assets/images/cover7.jpg'), duration: '7:16', file: require('../assets/audio/wind.m4a'), playlist: 'Nature Sounds' },
    { id: '8', title: 'BTS Lofi Mix', artist: 'Lofi Dreamscape', image: require('../assets/images/cover8.jpg'), duration: '34:25', file: require('../assets/audio/btslofi.m4a'), playlist: 'Lofi Mix' },
    { id: '9', title: 'Relaxing Piano', artist: 'PianoDeuss', image: require('../assets/images/cover10.jpg'), duration: '32:08', file: require('../assets/audio/RelaxingPiano.m4a'), playlist: 'Piano Vibes' },
    { id: '10', title: 'Midnight Keys', artist: 'PianoDeuss', image: require('../assets/images/cover9.jpg'), duration: '27:32', file: require('../assets/audio/calmpiano.m4a'), playlist: 'Piano Vibes' },
  ]);

  const [currentIndex, setCurrentIndexState] = useState<number | null>(null);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [positionMillis, setPositionMillis] = useState(0);
  const [durationMillis, setDurationMillis] = useState(0);
  const [recentlyPlayed, setRecentlyPlayed] = useState<Song[]>(songs.slice(0, 4));
  const [favorites, setFavorites] = useState<string[]>([]);

  const soundRef = useRef<Audio.Sound | null>(null);
  const isLoadingRef = useRef(false);

  // ✅ Load per-user favorites + history when userId changes
  useEffect(() => {
    setFavorites([]);
    setRecentlyPlayed(songs.slice(0, 4));
    setCurrentSong(null);
    setCurrentIndexState(null);
    setIsPlaying(false);

    const loadData = async () => {
      try {
        const favJSON = await AsyncStorage.getItem(makeKey(userId, '@favorites'));
        setFavorites(favJSON ? JSON.parse(favJSON) : []);

        const recentJSON = await AsyncStorage.getItem(makeKey(userId, '@recently_played'));
        let mapped: Song[] = [];
        if (recentJSON) {
          const ids: string[] = JSON.parse(recentJSON);
          mapped = ids.map(id => songs.find(s => s.id === id)).filter(Boolean) as Song[];
        }
        const filled = [...mapped];
        for (let i = 0; filled.length < 4 && i < songs.length; i++) {
          if (!filled.find(s => s.id === songs[i].id)) filled.push(songs[i]);
        }
        setRecentlyPlayed(filled.slice(0, 4));

        const lastPlayingJSON = await AsyncStorage.getItem(makeKey(userId, '@last_playing'));
        if (lastPlayingJSON) {
          const lastSongId = JSON.parse(lastPlayingJSON) as string;
          const index = songs.findIndex(s => s.id === lastSongId);
          if (index !== -1) await loadSound(index);
        }
      } catch (err) {
        console.log('Error loading persisted data:', err);
      }
    };

    loadData();
  }, [userId]);

  const toggleFavorite = async (songId: string) => {
    setFavorites(prev => {
      const updated = prev.includes(songId)
        ? prev.filter(id => id !== songId)
        : [...prev, songId];
      AsyncStorage.setItem(makeKey(userId, '@favorites'), JSON.stringify(updated)).catch(console.log);
      return updated;
    });
  };

  const addToRecentlyPlayed = async (song: Song) => {
    setRecentlyPlayed(prev => {
      const filtered = prev.filter(s => s.id !== song.id);
      const updated = [song, ...filtered].slice(0, 4);
      AsyncStorage.setItem(makeKey(userId, '@recently_played'), JSON.stringify(updated.map(s => s.id))).catch(console.log);
      return updated;
    });
  };

  const loadSound = async (index: number): Promise<Audio.Sound | null> => {
    if (isLoadingRef.current) return null;
    isLoadingRef.current = true;

    const song = songs[index];
    if (!song) {
      isLoadingRef.current = false;
      return null;
    }

    if (soundRef.current) {
      try { await soundRef.current.stopAsync(); } catch {}
      await soundRef.current.unloadAsync();
      soundRef.current.setOnPlaybackStatusUpdate(null);
      soundRef.current = null;
    }

    const asset = Asset.fromModule(song.file);
    await asset.downloadAsync();
    const uri = asset.localUri!;

    const { sound } = await Audio.Sound.createAsync(
      { uri },
      { shouldPlay: false, isLooping },
      (status) => {
        if (!status.isLoaded) return;
        const s = status as AVPlaybackStatusSuccess;
        setPositionMillis(s.positionMillis);
        setDurationMillis(s.durationMillis ?? 0);
        setIsPlaying(s.isPlaying);
        if (s.didJustFinish) playNext();
      }
    );

    soundRef.current = sound;
    setCurrentSong({ ...song, sound });
    setCurrentIndexState(index);
    setIsPlaying(false);

    addToRecentlyPlayed(song);
    AsyncStorage.setItem(makeKey(userId, '@last_playing'), JSON.stringify(song.id)).catch(console.log);

    isLoadingRef.current = false;
    return sound;
  };

  const togglePlayPause = async () => {
    if (!soundRef.current) return;
    const status = await soundRef.current.getStatusAsync();
    if (!status.isLoaded) return;

    if (status.isPlaying) {
      await soundRef.current.pauseAsync();
      setIsPlaying(false);
    } else {
      await soundRef.current.playAsync();
      setIsPlaying(true);
    }
  };

  const playNext = async () => {
    if (!songs.length) return;
    let nextIndex: number;
    if (isShuffle) {
      do { nextIndex = Math.floor(Math.random() * songs.length); }
      while (nextIndex === currentIndex && songs.length > 1);
    } else {
      nextIndex = currentIndex !== null ? (currentIndex + 1) % songs.length : 0;
    }
    const sound = await loadSound(nextIndex);
    if (sound) await sound.playAsync();
  };

  const playPrevious = async () => {
    if (!songs.length) return;
    const prevIndex = currentIndex !== null ? (currentIndex - 1 + songs.length) % songs.length : 0;
    const sound = await loadSound(prevIndex);
    if (sound) await sound.playAsync();
  };

  const toggleShuffle = () => setIsShuffle(prev => !prev);

  const toggleLoop = async () => {
    setIsLooping(prev => {
      const newLoop = !prev;
      if (soundRef.current) soundRef.current.setIsLoopingAsync(newLoop);
      return newLoop;
    });
  };

  const stop = async () => {
    if (soundRef.current) {
      try {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
      } catch (err) {
        console.log("Error stopping sound:", err);
      }
      soundRef.current.setOnPlaybackStatusUpdate(null);
      soundRef.current = null;
    }
    setCurrentSong(null);
    setCurrentIndexState(null);
    setIsPlaying(false);
    AsyncStorage.removeItem(makeKey(userId, '@last_playing')).catch(console.log);
  };

  const skipForward = async () => {
    if (!soundRef.current) return;
    const status = await soundRef.current.getStatusAsync();
    if (!status.isLoaded) return;

    const newPosition = Math.min((status.positionMillis ?? 0) + 10000, status.durationMillis ?? 0);
    await soundRef.current.setPositionAsync(newPosition);
    setPositionMillis(newPosition);
  };

  const skipBackward = async () => {
    if (!soundRef.current) return;
    const status = await soundRef.current.getStatusAsync();
    if (!status.isLoaded) return;

    const newPosition = Math.max((status.positionMillis ?? 0) - 10000, 0);
    await soundRef.current.setPositionAsync(newPosition);
    setPositionMillis(newPosition);
  };

  // ✅ FIX: clear only in-memory state, not AsyncStorage
  const clearMemory = () => {
    try {
      if (soundRef.current) {
        soundRef.current.stopAsync().catch(() => {});
        soundRef.current.unloadAsync().catch(() => {});
        soundRef.current.setOnPlaybackStatusUpdate(null);
        soundRef.current = null;
      }
      setCurrentSong(null);
      setCurrentIndexState(null);
      setIsPlaying(false);
      setRecentlyPlayed(songs.slice(0, 4));
      setFavorites([]);
    } catch (err) {
      console.log('Error clearing memory:', err);
    }
  };

  useEffect(() => {
    return () => {
      soundRef.current?.unloadAsync().catch(err => console.log('Unload error', err));
    };
  }, []);

  return (
    <AudioContext.Provider
      value={{
        songs,
        currentSong,
        isPlaying,
        isShuffle,
        isLooping,
        recentlyPlayed,
        togglePlayPause,
        setCurrentIndex: loadSound,
        playNext,
        playPrevious,
        toggleShuffle,
        toggleLoop,
        positionMillis,
        durationMillis,
        favorites,
        toggleFavorite,
        stop,
        clearMemory,
        skipForward,
        skipBackward,
        userId,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => useContext(AudioContext);
