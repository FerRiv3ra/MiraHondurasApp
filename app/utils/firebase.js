import firebase from 'firebase/app';

const firebaseConfig = {
    apiKey: "AIzaSyAqr95UcljCi3yW_YfCCTTd32D5kKwyRpM",
    authDomain: "mirahonduras-58024.firebaseapp.com",
    databaseURL: "https://mirahonduras-58024.firebaseio.com",
    projectId: "mirahonduras-58024",
    storageBucket: "mirahonduras-58024.appspot.com",
    messagingSenderId: "799936283135",
    appId: "1:799936283135:web:607a79620efae9c6dde7ca"
};

export const firebaseApp = firebase.initializeApp(firebaseConfig);