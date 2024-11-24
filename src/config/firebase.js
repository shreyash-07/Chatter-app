import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";

const firebaseConfig = {
  apiKey: "AIzaSyBF-rvTgdov3xbUdG5Z5mOYgIIGuh1Yk-M",
  authDomain: "chatter-app-4d160.firebaseapp.com",
  projectId: "chatter-app-4d160",
  storageBucket: "chatter-app-4d160.firebasestorage.app",
  messagingSenderId: "823190420917",
  appId: "1:823190420917:web:bb5580877f320c83f32dfc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);  
const auth = getAuth(app);
const db= getFirestore(app);

const signup = async(username, email, password)=>{
    try{
        const res= await createUserWithEmailAndPassword(auth, email, password);
        const user = res.user;
        await setDoc(doc(db, "users",user.uid),{
            id: user.uid,
            username:username.toLowerCase(),
            email,
            name: "",
            avatar: "",
            bio: "Hey, There I am using chatter-app",
            lastSeen: Date.now()
        })
        await setDoc(doc(db, "chats",user.uid),{
            chatData:[]
        })
    } catch(error){
        console.log(error)
        toast.error(error.code.split('/')[1].split('-').join(" "));
    }
}

const login = async (email,password)=>{
    try{
        const userCredential=await signInWithEmailAndPassword(auth,email,password);
        console.log("Login successful:", userCredential.user);
        toast.success("Login successful!");
    } catch (error) {
        console.error("Login failed:", error.message);
        toast.error(error.code.split('/')[1].split('-').join(" "));
    }
}

const logout = async()=>{
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Logout failed:", error.message);
        toast.error(error.code.split('/')[1].split('-').join(" "));
    }
}

export {signup, login, logout, auth, db}