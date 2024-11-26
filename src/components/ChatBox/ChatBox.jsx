import React, { useContext, useEffect, useState } from "react";
import "./ChatBox.css";
import assets from "../../assets/assets";
import { AppContext } from "../../context/AppContext";
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import { toast } from "react-toastify";

const ChatBox = () => {
  const { userData, messagesId, chatUser, messages, setMessages, chatVisible, setChatVisible } =
    useContext(AppContext);
  const [input, setInput] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  const sendMessage = async () => {
    try {
      if ((input || selectedImage) && messagesId) {
        await updateDoc(doc(db, "messages", messagesId), {
          messages: arrayUnion({
            sId: userData.id,
            text: input || "",
            image: selectedImage || null,
            createdAt: new Date(),
          }),
        });

        const userIDs = [chatUser.rId, userData.id];

        userIDs.forEach(async (id) => {
          const userChatsRef = doc(db, "chats", id);
          const userChatsSnapshot = await getDoc(userChatsRef);

          if (userChatsSnapshot.exists()) {
            const userChatData = userChatsSnapshot.data();
            const chatIndex = userChatData.chatsData.findIndex(
              (c) => c.messageId === messagesId
            );
            userChatData.chatsData[chatIndex].lastMessage = selectedImage
              ? "📷 Image"
              : input.slice(0, 30);
            userChatData.chatsData[chatIndex].updatedAt = Date.now();
            if (userChatData.chatsData[chatIndex].rId === userData.id) {
              userChatData.chatsData[chatIndex].messageSeen = false;
            }
            await updateDoc(userChatsRef, {
              chatsData: userChatData.chatsData,
            });
          }
        });

        setInput("");
        setSelectedImage(null);
      }
    } catch (error) {
      toast.error("Failed to send message: " + error.message);
    }
  };

  const sendImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result); // Preview the image
      };
      reader.readAsDataURL(file); // Convert image to Base64
    } catch (error) {
      toast.error("Failed to load image: " + error.message);
    }
  };

  const convertTimestamp = (timestamp) => {
    let date = timestamp.toDate();
    const hour = date.getHours();
    let minute = date.getMinutes();
    if (minute < 10) minute = "0" + minute;
    if (hour > 12) {
      return hour - 12 + ":" + minute + " PM";
    } else {
      return hour + ":" + minute + " AM";
    }
  };

  useEffect(() => {
    if (messagesId) {
      const unSub = onSnapshot(doc(db, "messages", messagesId), (res) => {
        setMessages(res.data().messages.reverse());
      });
      return () => {
        unSub();
      };
    }
  }, [messagesId, setMessages]);

  return chatUser ? (
    <div className={`chat-box ${chatVisible ? "" : "hidden"}`}>
      <div className="chat-user">
        <img src={chatUser.userData.avatar} alt="" />
        <p>
          {chatUser.userData.name}{" "}
          {Date.now() - chatUser.userData.lastSeen <= 70000 ? (
            <img className="dot" src={assets.green_dot} alt="" />
          ) : null}
        </p>
        <img src={assets.help_icon} className="help" alt="" />
        <img onClick={()=>setChatVisible(false)} src={assets.arrow_icon} className="arrow" alt="" />
      </div>

      <div className="chat-msg">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={msg.sId === userData.id ? "s-msg" : "r-msg"}
          >
            {msg.image && (
              <img src={msg.image} alt="Sent" className="msg-img" />
            )}
            {msg.text && <p className="msg">{msg.text}</p>}
            <div>
              <img
                src={
                  msg.sId === userData.id
                    ? userData.avatar
                    : chatUser.userData.avatar
                }
                alt=""
              />
              <p>{convertTimestamp(msg.createdAt)}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="chat-input">
        {selectedImage && (
          <div className="image-preview">
            <img src={selectedImage} alt="Preview" />
            <button onClick={() => setSelectedImage(null)}>Remove</button>
          </div>
        )}
        <input
          onChange={(e) => setInput(e.target.value)}
          value={input}
          type="text"
          placeholder="Send a message"
        />
        <input
          onChange={sendImage}
          type="file"
          id="image"
          accept="image/png, image/jpeg"
          hidden
        />
        <label htmlFor="image">
          <img src={assets.gallery_icon} alt="Upload" />
        </label>
        <img onClick={sendMessage} src={assets.send_button} alt="Send" />
      </div>
    </div>
  ) : (
    <div className={`chat-welcome ${chatVisible ? "" : "hidden"}`}>
      <img src={assets.logo_icon} alt="" />
      <p>Chat Anytime, Anywhere</p>
    </div>
  );
};

export default ChatBox;
