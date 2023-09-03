import {getApp,getApps,initializeApp} from 'firebase/app'
import {getFirestore} from 'firebase/firestore'
import { getStorage} from 'firebase/storage'


const firebaseConfig = {
  apiKey: "AIzaSyDD_hlhMNewSXyQuDgPfvetrFQwBGbC08k",
  authDomain: "thefoodzone-b1905.firebaseapp.com",
  projectId: "thefoodzone-b1905",
  storageBucket: "thefoodzone-b1905.appspot.com",
  messagingSenderId: "785141280457",
  appId: "1:785141280457:web:2f10faa76fcc84f5346718"
};
  const app=getApps.length > 0 ? getApp() : initializeApp(firebaseConfig);
  const firestore=getFirestore(app);
  const storage =getStorage(app);

  export { app,firestore,storage};

  