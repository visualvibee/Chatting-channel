import { useEffect, useState } from "react";
import "./chatList.css";
import AddUser from "./addUser/addUser";
import { useUserStore } from "../../../lib/userStore";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { useChatStore } from "../../../lib/chatStore";

const ChatList = () => {
    const[chats,setChats]= useState([]);
    const[addMode,setMode]= useState(false);
    const[input,setInput]= useState("");

    const {currentUser} = useUserStore();
    const {chatId, changeChat } = useChatStore();

    useEffect(() => {
       const unSub = onSnapshot(
         doc(db, "userchats", currentUser.id),
         async (res) => {
         const items = res.data().chats;

         const promises = items.map( async(item)=>{
           const userDocRef = doc(db, "users", item.recieverId);
           const userDocSnap = await getDoc(userDocRef);

           const user = userDocSnap.data();

           return { ...item, user };
         });

           const chatData = await Promise.all(promises)

           setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
         }
       );

       return ()=>{
        unSub();
       }
    }, [currentUser.id]);

    const handleSelect = async (chat)=>{
      const userChats = chats.map((item) => {
        const { user, ...rest } = item;
        return rest; 
      });

      const chatIndex = userChats.findIndex(
        item=>item.chatId === chat.chatId
      );

      userChats[chatIndex].isSeen = true;

      const userChatsRef = doc(db, "userchats", currentUser.id);

      try{

        await updateDoc(userchatsRef,{
          chats: userChats,
        });
        changeChat(chat.chatId,chat.user);
      }catch(err){
        console.log(err)
      }

    };

    const filteredChats = chats.filter(c=> c.user.username.toLowerCase().includes(input.toLowerCase()))

    return (
        <div className='chatList'>
            <div className="search">
                <div className="searchBar">
                    <img src="https://i.pinimg.com/236x/79/ce/10/79ce10e4c34077215b988139aec41dbe.jpg" alt="" />
                    <input type="text" placeholder="Search" onChange={(e)=>setInput(e.target.value)}/>
                </div>
                <img 
                  src={addMode ? "https://i.pinimg.com/564x/ef/62/4e/ef624e5d1f05df24926783de7ee477bf.jpg" : "https://i.pinimg.com/236x/ac/98/55/ac98554a4cd24ac2a97a76e07bb2bc26.jpg"} 
                  alt="" 
                  className="add"
                  onClick={() => setAddMode((prev) => !prev)}
                />
            </div>
            {filteredChats.map(chat=>(
            <div className="item" key={chat.chatId} onClick={()=>handleSelect(chat)}
              style={{
                backgroundColor: chat?.isSeen ? "transparent" : "#5183fe",
              }}
              >
                <img src={chat.user.blocked.includes(currentUser.id) ? "https://i.pinimg.com/236x/59/a2/7f/59a27ff804863f64634360cd3c769e40.jpg" : chat.user.avatar || "https://i.pinimg.com/236x/59/a2/7f/59a27ff804863f64634360cd3c769e40.jpg"} alt="" />
                <div className="texts">
                    <span>{chat.user.blocked.includes(currentUser.id) ? "User" : chat.user.username}</span>
                    <p>{chat.lastMessage}</p>
                </div>
            </div>
            ))}
            {addMode && <AddUser/>}
        </div>
    )
}

export default ChatList
