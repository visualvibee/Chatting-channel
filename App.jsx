import { onAuthStateChanged } from "firebase/auth";
import Chat from "./components/chat/Chat";
import Detail from "./components/detail/Detail";
import List from "./components/list/List";
import Notifications from "./components/notifications/notifications";

const App = () => {

const user = false;

useEffect(()=>{
  const unSub = onAuthStateChanged(auth,(user)=>{
    console.log(user);
  });

  return () => {
    unSub();
  };
},[]);

  return (
    <div className='container'>
      {
        user ? (
        <>          
          <List/>
          <Chat/>
          <Detail/>
        </>
      ) : (
        <Login/>
      )}
      <Notifications/>
    </div>
  );
};

export default App
