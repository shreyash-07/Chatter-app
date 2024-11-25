import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { createContext, useEffect, useState } from "react";
import { auth, db } from "../config/firebase";
import { useNavigate } from "react-router-dom";

// Named export for AppContext
export const AppContext = createContext();

// Default export for AppContextProvider
const AppContextProvider = ({ children }) => {

    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [chatData, setChatData] = useState(null);
    const [messagesId,setMessagesId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [chatUser,setChatUser] = useState(null);

    const loadUserData = async (uid) => {
        try {
            if (!uid) throw new Error("UID is not provided.");

            const userRef = doc(db, "users", uid);
            const userSnap = await getDoc(userRef);

           // console.log("Document snapshot:", userSnap);

            if (userSnap.exists()) {
                const userData = userSnap.data();
                // console.log("User data:", userData);
                setUserData(userData);
                if(userData.avatar && userData.name){
                    navigate("/chat");
                }
                else{
                    navigate("/profile");
                }

                await updateDoc(userRef, {
                    lastSeen: Date.now()
                });
                setInterval(async () => {
                    if(auth.chatUser){
                        await updateDoc(userRef, {
                            lastSeen: Date.now()
                        })
                    }
                }, 60000);
            } else {
                console.error("No document found for the given UID.");
            }
        } catch (error) {
            console.error("Error loading user data:", error.message, error.stack);
        }
    };

    useEffect(()=>{
        if(userData){
            const chatRef = doc(db, "chats", userData.id);
            const unSub = onSnapshot(chatRef, async (res) =>{
                const chatItems = res.data().chatsData;
                const tempData = [];
                for(const item of chatItems){
                    const userRef = doc(db, "users", item.rId);
                    const userSnap = await getDoc(userRef);
                    const userData = userSnap.data();
                    tempData.push({...item,userData})
                }
                setChatData(tempData.sort((a,b)=>b.updatedAt - a.updatedAt))
            })
            return () =>{
                unSub();
            }
        }
    },[userData])

    const value = {
        userData, setUserData,
        chatData, setChatData,
        loadUserData,
        messages, setMessages,
        messagesId, setMessagesId,
        chatUser, setChatUser
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
