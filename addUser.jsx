import "./addUser.css";
import { db } from "../../../../lib/firebase";
import {
    arrayUnion,
    collection,
    query,
    where,
    getDocs,
    setDoc,
    updateDoc,
    doc,
    serverTimestamp
} from "firebase/firestore";
import { useState } from "react";
import { useUserStore } from "../../../../lib/userStore";

const AddUser = () => {
    const [user, setUser] = useState(null);
    const { currentUser } = useUserStore();

    const handleSearch = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const username = formData.get("username");

        const registerUser = async (username, otherUserData) => {
            try {
                const userRef = collection(db, "users");
                const q = query(userRef, where("username", "==", username));
                const querySnapShot = await getDocs(q); // Use getDocs instead of getDoc for queries

                if (!querySnapShot.empty) {
                    throw new Error("Username already exists.");
                }

                // Proceed with user creation if username is unique
                const newUserRef = doc(userRef); // Get a new document reference
                await setDoc(newUserRef, {
                    username,
                    ...otherUserData,
                });

                // Retrieve the newly created user document
                const newUserQuery = query(userRef, where("username", "==", username));
                const newUserSnapShot = await getDocs(newUserQuery);

                if (!newUserSnapShot.empty) {
                    setUser(newUserSnapShot.docs[0].data());
                }

            } catch (err) {
                console.error("Error registering user:", err);
            }
        };

        // Example call to registerUser, you can replace otherUserData with actual data
        await registerUser(username, { email: "example@example.com" });
    };

    const handleAdd = async () => {
        const chatRef = collection(db, "chats");
        const userChatsRef = collection(db, "userchats");

        try {
            const newChatRef = doc(chatRef);

            await setDoc(newChatRef, {
                createdAt: serverTimestamp(),
                messages: [],
            });

            await updateDoc(doc(userChatsRef, user.id), {
                chats: arrayUnion({
                    chatId: newChatRef.id,
                    lastMessage: "",
                    recieverId: currentUser.id,
                    updatedAt: Date.now(),
                }),
            });

            await updateDoc(doc(userChatsRef, currentUser.id), {
                chats: arrayUnion({
                    chatId: newChatRef.id,
                    lastMessage: "",
                    recieverId: user.id,
                    updatedAt: Date.now(),
                }),
            });

        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className='addUser'>
            <form onSubmit={handleSearch}>
                <input type="text" placeholder="Username" name="username" />
                <button>Search</button>
            </form>
            {user && <div className="user">
                <div className="detail">
                    <img src={user.avatar || "./avatar.png"} alt="" />
                    <span>{user.username}</span>
                </div>
                <button onClick={handleAdd}>Add User</button>
            </div>}
        </div>
    );
};

export default AddUser;
