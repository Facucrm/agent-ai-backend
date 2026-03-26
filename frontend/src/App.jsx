import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import TasksPage from './pages/TasksPage';
import TokensPage from './pages/TokensPage';
import ProfilePage from './pages/ProfilePage';
import SyncPage from './pages/SyncPage';
import LoginPage from './pages/LoginPage';
import SplashScreen from './components/SplashScreen';
import { useUser } from './context/UserContext';

function App() {
    const { user, loading } = useUser();
    const [isAppReady, setIsAppReady] = useState(false);

    if (loading) {
        return <SplashScreen onFinish={() => { }} />;
    }

    if (!user) {
        return (
            <Router>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            </Router>
        );
    }

    return (
        <>
            <SplashScreen onFinish={() => setIsAppReady(true)} />
            <Router>
                <Layout>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/tasks" element={<TasksPage />} />
                        <Route path="/tokens" element={<TokensPage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/sync" element={<SyncPage />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </Layout>
            </Router>
        </>
    );
}

export default App;
