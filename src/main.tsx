import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import styles from "./css/app.module.css"

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div className={styles.container}>
      <App />
    </div>
  </React.StrictMode>
)
