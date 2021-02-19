import * as firebase from 'firebase';
import { firebaseConfig } from '../../constants/firebase';

export default !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();
