import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
   container: {
    flex: 1,
    backgroundColor: '#261f46ff',
    padding: 20,
  },
  header: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center', // center title
  position: 'relative',      // optional, for layering if needed
},
sideIcon: {
  width: 40,                 // reserve same space for back arrow & circle
  alignItems: 'center',
},


circle: {
  width: 40,
  height: 40,
  borderRadius: 20,
  backgroundColor: 'white',
  justifyContent: 'center',
  alignItems: 'center',
  marginLeft: -10, // pushes it right
},

});
