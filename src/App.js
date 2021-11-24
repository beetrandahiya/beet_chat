import React, {useRef , useState} from "react";
import ReactDOM from "react-dom";
import "./App.css";

import firebase from "firebase";
import 'firebase/firestore';
import 'firebase/auth';

import {useAuthState} from 'react-firebase-hooks/auth';
import {useCollectionData} from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyC_zNXXzyNCHe70yYo997tiDx2UsJa1RN0",
  authDomain: "beetchat-2102f.firebaseapp.com",
  projectId: "beetchat-2102f",
  storageBucket: "beetchat-2102f.appspot.com",
  messagingSenderId: "740901659583",
  appId: "1:740901659583:web:f75d8061253115cb76b70a",
  measurementId: "G-2SLVDQX6Y5"


});

const auth = firebase.auth();
const firestore = firebase.firestore();



function App() {
  const [user] = useAuthState(auth);

  return (
    <div className="App">

      <main>
        {user ? <ChatRoom /> : <Login />}
      </main>
    </div>
  );
}

function Login() {
  /*const addUser = async (e) => {

    const email =auth.currentUser.email;
    const user = firestore.collection('users').doc(email);
    await user.set({
      email: email,
      name: '',
      avatar: '',
      status: '',
      last_seen: new Date()
    });
  }*/

  return (
    <main className="Signinmain">
    <h2>Sign In</h2>
    <button className="signinbtn" onClick={() => auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())/* ,addUser*/ }> <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" /> <span>Google</span></button>
    </main>
  )
      };



function SignOut() {
  return auth.currentUser && (
    <button onClick={() => auth.signOut()} className="signoutbtn"> <i class="fa fa-sign-out" aria-hidden="true"></i> Sign out</button>
  )
      };


function ChatRoom() {

  const dummy =useRef();
  const messageRef = firestore.collection('messages');
  const query = messageRef.orderBy('createdAt').limit(105);
  const [messages] = useCollectionData(query, {idField: 'id'});
  const [formValue, setFormValue] = useState('');


  const sendMessage = async (e) => {
  e.preventDefault();
  const {uid, photoURL} = auth.currentUser;

  await messageRef.add({
    text: urlify(formValue),
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    uid,
    photoURL
  })
  setFormValue('');
   dummy.current.scrollIntoView({behavior: 'smooth'});
  
  }

  


  return(
    <>
    <div className="header"> <SignOut /> </div>
    <div className="messageblock">
      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

          <div ref={dummy}></div>
    
    </div>

<form  className="sendform" onSubmit={sendMessage}>
  <input className="sendInput" value={formValue} onChange={(e)=> setFormValue(e.target.value)} type="text" placeholder="Type a message..." />
  <button disabled={!formValue} className="sendbtn">➔</button>
</form>
</>

  )
}

function ChatMessage(props) {
  const {text,uid,photoURL} = props.message;
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'recieved';
  const messageRef = firestore.collection('messages');

  const deleteMessage = async (e) => {
    e.preventDefault();
    const {uid, photoURL} = auth.currentUser;
     messageRef.doc(e.target.id).delete();
    
  }

  return (
    <div className={`message${messageClass}`}>
   <span> <img className="profilepicmsg" src={photoURL} alt=""/> </span>
     <div className="messagewrap">
     
    <div className="msgtext">  <p>{textq}</p> </div>
    <span>  <button className="deletemsg" id={props.message.id} onClick={deleteMessage}>-</button></span>
    </div></div>
  )
} 

/*
function Dashboard() {
  return (
    <main className="Dashboard">
      <h2>Dashboard</h2>
        <div className="profile">
          <img className="profilepic" src={photoURL} alt=""/>
        </div>
        <div className="info"></div>
    </main>


  )};
*/

function urlify(text) {
  var urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(urlRegex, function(url) {
    return '<a href="' + url + '">' + url + '</a>';
  })
  // or alternatively
  // return text.replace(urlRegex, '<a href="$1">$1</a>')
}






export default App;
