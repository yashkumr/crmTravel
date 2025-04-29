import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/Auth.jsx'
import "../src/assets/css/vkStyle.css";
import { persistor, store } from './redux/store.js'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { FlightDealsProvider } from './context/FlightDealsContext.jsx'

createRoot(document.getElementById('root')).render(



  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <AuthProvider>
        <FlightDealsProvider>
          <BrowserRouter>
            <StrictMode>
              <App />
            </StrictMode>
          </BrowserRouter>
        </FlightDealsProvider>
      </AuthProvider>

    </PersistGate>
  </Provider>




)
