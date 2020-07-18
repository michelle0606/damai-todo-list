import firebase from 'firebase'

var firebaseConfig = {
  apiKey: 'AIzaSyC12V1Xz88AqTjbnyO-vlJhdr_9kk1xWCo',
  authDomain: 'todo-list-ef6ff.firebaseapp.com',
  databaseURL: 'https://todo-list-ef6ff.firebaseio.com',
  projectId: 'todo-list-ef6ff',
  storageBucket: 'todo-list-ef6ff.appspot.com',
  messagingSenderId: '149334994068',
  appId: '1:149334994068:web:77997a5bf4568f4f819881',
  measurementId: 'G-HMB62X283E',
}

export default firebase.initializeApp(firebaseConfig)
