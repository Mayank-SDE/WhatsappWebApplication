import './App.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Messenger from './components/Messenger';
import AccountProvider from './context/AccountProvider';
function App() {
  const clientId =
    '773822965695-ft2asfuau32eeb67e72jjjv5v7hcfp9n.apps.googleusercontent.com';
  return (
    <>
      <GoogleOAuthProvider clientId={clientId}>
        <AccountProvider>
          <Messenger />
        </AccountProvider>
      </GoogleOAuthProvider>
    </>
  );
}

export default App;
