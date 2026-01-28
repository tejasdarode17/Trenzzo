import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Toaster } from 'sonner'
import { Provider } from 'react-redux'
import store from './redux/Store'


createRoot(document.getElementById('root')).render(
  <>
    <Provider store={store}>
      <Toaster richColors />
      <App />
    </Provider>
  </>

)
