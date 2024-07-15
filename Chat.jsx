import React, { useState, useRef, useEffect } from 'react';
import { arrayUnion, updateDoc } from "firebase/firestore";
import './chat.css';
import EmojiPicker from 'emoji-picker-react';
import { getFirestore, collection, query, orderBy, onSnapshot } from "firebase/firestore";
import {
   doc,
   onSnapshot,
} from "firebase/firestore";
import { db } from '../../lib/firebase';

const Chat = () => {
  const [chat, setChat] = useState();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [img, setImg] = useState({
    file: null,
    url: "",
  });
  const [messages, setMessages] = useState([]);

  const { currentUser } = useUserStore();
  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked } = useChatStore();


  const endRef = useRef(null);

  useEffect(() => {
    const q = query(collection(db, "chats"), orderBy("timestamp"));
    const unSub = onSnapshot(q, (querySnapshot) => {
      const msgs = [];
      querySnapshot.forEach((doc) => {
        msgs.push(doc.data());
      });
      setMessages(msgs);
    });

    // Clean up the subscription on unmount
    return () => unSub();
  }, [chatId]);

console.log(chat)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleEmoji = (emojiObject) => {
    setText((prev) => prev + emojiObject.emoji);
    setOpen(false);
  };

  const handleImg = e =>{
    if(e.target.files(0)){
    setImg({
        file:e.target.files(0),
        url: URL.createObjectURL(e.target.files(0))
    });
  }
};

  const handleSend = async ()=>{
    if(text === "") return;

    let imgUrl = null

    try{

      if(img.file){
        imgUrl = await upload(img.file);
      }

      await updateDoc(doc(db, "chats", chatId),{
        messages: arrayUnion({
          senderId: currentUser.id,
          text,
          createdAt: new Date(),
          ...(imgUrl && { img: imgUrl }), 
        }),
      }); 

      const userIDs = [currentUser.id, user.id]

      userIDs.forEach(async (id)=>{

      const userChatsRef = doc(db,"userChats", id);
      const userChatsSnapshot = await getDoc(userChatsRef);


      if(userChatsSnapshot.data()){
        const userChatsData = userChatsSnapshot.data();

        const chatIndex = userChatsData.chats.findIndex(
          c=> c.chatId === chatId
        );  

        userChatsData.chats[chatIndex].lastMessage = text;
        userChatsData.chats[chatIndex].isSeen = 
        id === currentUser.id ? true : false;
        userChatsData.chats[chatIndex].updatedAt = Date.now();

        await updateDoc(userChatsRef, {
          chats: userChatsData.chats,
        });

      }
    });
    }catch(err){
      console.log(err);
    }

    setImg ({
      file: null,
      url:"",
    })

    setText("");
  };

  return (
    <div className="chat">
      <div className="top">
        <div className="user">
          <img src="https://i.pinimg.com/236x/59/a2/7f/59a27ff804863f64634360cd3c769e40.jpg" alt="" />
          <div className="texts">
            <span>user.username</span>
            <p>My friend</p>
          </div>
        </div>
        <div className="icons">
          <img src="https://i.pinimg.com/236x/c9/80/7b/c9807b94064757148d96222b663faa36.jpg" alt="call" />
          <img src="https://i.pinimg.com/236x/44/be/b3/44beb3c457a01f0a4a4f0d9ede6af2f4.jpg" alt="video call" />
          <img src="https://i.pinimg.com/564x/5b/1a/1f/5b1a1fe80409c15862ab918fc49e0854.jpg" alt="i" />
        </div>
      </div>
      <div className="center">
        {chat?.messages?.map((msg, index) => (
          <div className={`message ${msg.isOwn ? 'own' : ''}`} key={index}>
            {message.img && <img
             src={msg.img} 
             alt=""
              />}
            <div className="texts">
              <p>{msg.text}</p>
             {/* <span>{message}</span> */}
            </div>
          </div>
        ))}
        {img.url && (
          <div className="message own">
          <div className="texts">
            <img src={img.url} alt="" />
          </div>
        </div>
        )}
        <div ref={endRef}></div>
      </div>
      <div className="bottom">
        <div className="icons">
          <label htmlFor="file">
          <img src="./image.png" alt="" />
          </label>
          <input type="file" id="file" style={{display:"none"}} onChange={handleImg} />
          <img src="./camera.png" alt="" />
          <img src="./mic.png" alt="" />
        </div>
        <input
          type="text"
          placeholder={(isCurrentUserBlocked || isReceiverBlocked) ? "You cannot send a message" : "Type a message..."}
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isCurrentUserBlocked || isReceiverBlocked}
        />
        <div className="emoji">
          <img src="./emoji.png" alt="" onClick={() => setOpen((prev) => !prev)} />
          {open && <EmojiPicker onEmojiClick={handleEmoji} />}
        </div>
        <button className="sendButton" onClick = {handleSend} disabled={isCurrentUserBlocked || isReceiverBlocked}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
