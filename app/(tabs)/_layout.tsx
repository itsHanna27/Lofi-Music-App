import { Ionicons } from '@expo/vector-icons';
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Tabs, useSegments } from 'expo-router';
import { StatusBar, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAudio } from '@/components/AudioContext';
import { HapticTab } from '@/components/HapticTab';
import NowPlayingBar from '@/components/NowPlayingBar';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { useColorScheme } from '@/hooks/useColorScheme';
import UserBar from "../../components/userBar";

import { auth } from '../../components/firebaseConfig';

const TAB_BAR_HEIGHT = 70;
const NOW_PLAYING_HEIGHT = 60;

const TabsLayout = () => {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const segments = useSegments() as readonly string[];
  const { currentSong } = useAudio();
  const userEmail = auth.currentUser?.email || "Unknown";
  const hideNowPlayingOn = ['Play'];
  const isHidden = segments.some(segment => hideNowPlayingOn.includes(segment));

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" backgroundColor="#261f46ff" />

      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarActiveTintColor: '#6a00ffff',
          tabBarInactiveTintColor: 'white',
          tabBarStyle: {
            position: 'absolute',
            bottom: insets.bottom,
            left: 0,
            right: 0,
            height: TAB_BAR_HEIGHT,
            backgroundColor: '#261f46ff',
            borderTopWidth: 0,
            elevation: 0,
            paddingTop: 0,
          },
        }}
      >
        <Tabs.Screen
          name="Discover"
          options={{
            title: 'Discover',
            tabBarIcon: ({ color }) => <Ionicons name="compass" size={28} color={color} />,
          }}
        />
        <Tabs.Screen
          name="Play"
          options={{
            title: 'Music',
            tabBarIcon: ({ color }) => <Ionicons name="play-circle" size={28} color={color} />,
          }}
        />
        <Tabs.Screen
          name="MusicLibrary"
          options={{
            title: 'Library',
            tabBarIcon: ({ color }) => <Ionicons name="musical-notes" size={28} color={color} />,
          }}
        />
      </Tabs>

      {!isHidden && currentSong && (
        <View style={[styles.nowPlaying, { bottom: insets.bottom + TAB_BAR_HEIGHT + 15 }]}>
          <NowPlayingBar />
        </View>
      )}
    </View>
  );
};

const Drawer = createDrawerNavigator();

export default function RootLayout() {
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerPosition: "right",
        headerShown: false,
      }}
      drawerContent={(props) => <UserBar {...props} />} 
    >
      <Drawer.Screen name="Tabs" component={TabsLayout} />
    </Drawer.Navigator>
  );
}


const styles = StyleSheet.create({
  nowPlaying: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: NOW_PLAYING_HEIGHT,
    zIndex: 10,
  },
});
