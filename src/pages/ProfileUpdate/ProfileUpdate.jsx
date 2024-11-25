import React, { useContext, useEffect, useState } from "react";
import "./ProfileUpdate.css";
import assets from "../../assets/assets";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../config/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";

const ProfileUpdate = () => {
  const navigate = useNavigate();

  const [image, setImage] = useState(null); 
  const [name, setName] = useState(""); 
  const [bio, setBio] = useState(""); 
  const [uid, setUid] = useState(""); 
  const [prevImage, setPrevImage] = useState(""); 
  const {setUserData} = useContext(AppContext);

  /**
   * Convert image file to Base64
   * @param {File} file - The selected image file
   * @returns {Promise<string>} - Base64 encoded image string
   */
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  /**
   * Handle profile update form submission
   * @param {Event} event - Form submission event
   */
  const profileUpdate = async (event) => {
    event.preventDefault();

    try {
      
      if (!prevImage && !image) {
        toast.error("Please upload a profile picture");
        return;
      }

      const docRef = doc(db, "users", uid);

      // Update user data in Firestore
      if (image) {
        const base64Image = await convertToBase64(image); // Convert selected image to Base64
        await updateDoc(docRef, {
          avatar: base64Image,
          bio: bio,
          name: name,
        });
        setPrevImage(base64Image); 
      } else {
        await updateDoc(docRef, {
          bio: bio,
          name: name,
        });
      }

      toast.success("Profile updated successfully!");

      const snap = await getDoc(docRef);
      setUserData(snap.data());
      navigate("/chat");

    } catch (error) {
      console.error("Error updating profile:", error.message);
      toast.error("Failed to update profile.");
    }
  };

  // Fetch user data on component mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUid(user.uid);
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setName(data.name || "");
          setBio(data.bio || "");
          setPrevImage(data.avatar || ""); // Load existing avatar
        }
      } else {
        navigate("/"); 
      }
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, [navigate]);

  return (
    <div className="profile">
      <div className="profile-container">
        <form onSubmit={profileUpdate}>
          <h3>Profile Details</h3>
          <label htmlFor="avatar">
            <input
              onChange={(e) => setImage(e.target.files[0])} 
              type="file"
              id="avatar"
              accept=".png, .jpg, .jpeg"
              hidden
            />
            <img
              src={image ? URL.createObjectURL(image) : prevImage || assets.avatar_icon}
              alt="Profile"
              className="profile-image-preview"
            />
            Upload Profile Image
          </label>
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <textarea
            placeholder="Write profile bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            required
          ></textarea>
          <button type="submit">Save</button>
        </form>
        <img className="profile-pic" src={image? URL.createObjectURL(image) : prevImage ? prevImage : assets.logo_icon} alt="" />
      </div>
    </div>
  );
};

export default ProfileUpdate;
