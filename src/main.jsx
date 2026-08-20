import React from 'react'
import ReactDOM from 'react-dom/client'
import AppWithProvider from './features/auth/auth.context' // <-- THIS LINE IS CRUCIAL
import "./style.scss"
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppWithProvider /> 
  </React.StrictMode>,
)