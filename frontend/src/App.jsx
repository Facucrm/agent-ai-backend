import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import TasksPage from './pages/TasksPage';
import TokensPage from './pages/TokensPage';
import ProfilePage from './pages/ProfilePage';
import SyncPage from './pages/SyncPage';
import LoginPage from './pages/LoginPage';
import NotificationsPage from './pages/NotificationsPage';
import SplashScreen from './components/SplashScreen';
import { useUser } from './context/UserContext';

function App() {
    const { user, loading } = useUser();
    const [hasInitialSplashFinished, setHasInitialSplashFinished] = useState(false);

    // Si Firebase está cargando el estado inicial, mostramos el Splash
    if (loading && !hasInitialSplashFinished) {
        return <SplashScreen onFinish={() => setHasInitialSplashFinished(true)} />;
    }

    // Si no hay usuario, mostramos el login directamente (el login tiene su propio diseño premium)
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

    // Si el usuario acaba de loguearse y aún no hemos mostrado el splash de "entrada", opcionalmente lo mostramos una vez
    // o simplemente entramos al Layout. Para mayor velocidad, entraremos directo.
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/tasks" element={<TasksPage />} />
                    <Route path="/tokens" element={<TokensPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/notifications" element={<NotificationsPage />} />
                    <Route path="/sync" element={<SyncPage />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Layout>
        </Router>
    );
}

export default App;
