import ReactDOM from 'react-dom/client'
import { createHashRouter, RouterProvider } from 'react-router-dom'
import App from './App'
import './samples/node-api'
import VaultManager from './VaultManager'
import VaultManagerCreateVault from './VaultManagerCreateVault'

const router = createHashRouter([
  {
    path: '/',
    element: <App />
  },
  {
    path: '/vault-manager',
    element: <VaultManager />,
  },
  {
    path: '/vault-manager/create-vault',
    element: <VaultManagerCreateVault />,
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
    <RouterProvider router={router} />
  // {/* </React.StrictMode> */}
)

postMessage({ payload: 'removeLoading' }, '*')
