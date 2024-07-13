import Chat from "./components/chat/Chat";
import Detail from "./components/detail/Detail";
import List from "./components/list/List";
import Notifications from "./components/notifications/notifications";

const App = () => {

const user = true

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