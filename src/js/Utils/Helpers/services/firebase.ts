import * as firebase from 'firebase';
import { firebaseConfig } from '../../constants/firebase';

// Optional import the services that you want to use
// If you enabled Analytics in your project, add the Firebase SDK for Analytics
// import 'firebase/analytics';
// Add the Firebase products that you want to use
// import '@firebase/auth';
// import 'firebase/firestore';

export default !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();
