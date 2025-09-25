import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#261f46ff',
    padding: 20,
  },
  songRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
   
  },
  songImage: {
    width: 65,
    height: 65,
    borderRadius: 5,
    marginRight: 10,
    fontWeight: 200
  },
  songTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 0,
    marginTop:-15
  },
  artist: {
    fontSize: 12,
    color: '#aaa',
     marginLeft: 0,
     marginTop: 0
  },
});
