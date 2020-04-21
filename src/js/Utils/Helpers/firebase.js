import * as firebase from 'firebase';
import { firebaseConfig } from '../../Utils/constants/firebase';

export default !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();
