import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import TasksPage from './pages/TasksPage';
import TokensPage from './pages/TokensPage';
import ProfilePage from './pages/ProfilePage';

function App() {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<TasksPage />} />
                    <Route path="/tasks" element={<TasksPage />} />
                    <Route path="/tokens" element={<TokensPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                </Routes>
            </Layout>
        </Router>
    );
}

export default App;
