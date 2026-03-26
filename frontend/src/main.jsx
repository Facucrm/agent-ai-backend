import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { UserProvider } from './context/UserContext'
import { TasksProvider } from './context/TasksContext'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <UserProvider>
            <TasksProvider>
                <App />
            </TasksProvider>
        </UserProvider>
    </React.StrictMode>,
)
