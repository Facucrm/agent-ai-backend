import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

const UserContext = createContext();

export const ROLES = {
    GUEST: 'Guest',
    FREE: 'Free_User',
    PREMIUM: 'Premium_User'
};

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Verificar si Firebase está configurado correctamente
        const isFirebaseConfigured = auth && import.meta.env.VITE_FIREBASE_API_KEY && import.meta.env.VITE_FIREBASE_API_KEY !== 'TU_API_KEY';

        if (!isFirebaseConfigured) {
            console.warn("⚠️ Firebase no está configurado (faltan claves en .env). Entrando en modo LocalStorage (Demo).");

            // Lógica de recuperación de sesión local (como antes de Firebase)
            const savedUser = JSON.parse(localStorage.getItem('planit_user_local'));
            if (savedUser) {
                setUser(savedUser);
            }
            setLoading(false);
            return;
        }

        // Carga inmediata desde caché local para acceso instantáneo (Persistencia Instantánea)
        const cachedUser = localStorage.getItem('planit_user_auth_cache');
        if (cachedUser) {
            try {
                setUser(JSON.parse(cachedUser));
                setLoading(false); // Entramos directo a la app, Firebase verificará en segundo plano
            } catch (e) {
                console.error("Error parsing cached user", e);
            }
        }

        // Timer de seguridad para evitar pantalla en blanco infinita
        const safetyTimer = setTimeout(() => {
            if (loading) {
                console.warn("⏱️ El inicio de Firebase está tardando demasiado. Verificando estado local...");
                setLoading(false);
            }
        }, 3500);

        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // Sincronizar con Firestore
                try {
                    const userDocRef = doc(db, 'users', firebaseUser.uid);
                    const userDoc = await getDoc(userDocRef);

                    let metaData;
                    if (userDoc.exists()) {
                        metaData = userDoc.data();
                    } else {
                        // Crear documento inicial si no existe
                        metaData = {
                            role: ROLES.FREE,
                            referrals: 0,
                            referralCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
                            calendarUrl: '',
                            premiumUntil: null,
                            createdAt: new Date().toISOString()
                        };
                        await setDoc(userDocRef, metaData);
                    }

                    // Verificación de cuenta Administrador/VIP solicitada por el usuario
                    const isVipUser = firebaseUser.email === 'facucrm62@gmail.com' || firebaseUser.email === 'facucrm62gmail.com';

                    const userData = {
                        uid: firebaseUser.uid,
                        email: firebaseUser.email,
                        name: firebaseUser.displayName || 'Estudiante Planit',
                        photo: firebaseUser.photoURL,
                        ...metaData,
                        role: isVipUser ? ROLES.PREMIUM : (metaData.role || ROLES.FREE)
                    };

                    setUser(userData);
                    // Guardar en caché para acceso instantáneo en el próximo inicio
                    localStorage.setItem('planit_user_auth_cache', JSON.stringify(userData));
                } catch (error) {
                    console.error("Error al cargar datos de Firestore:", error);
                    // Fallback a localStorage si Firestore falla
                    const savedMeta = JSON.parse(localStorage.getItem(`planit_meta_${firebaseUser.uid}`)) || {
                        role: ROLES.FREE,
                        referrals: 0,
                        referralCode: Math.random().toString(36).substring(2, 8).toUpperCase()
                    };
                    setUser({
                        uid: firebaseUser.uid,
                        email: firebaseUser.email,
                        name: firebaseUser.displayName || 'Estudiante Planit',
                        photo: firebaseUser.photoURL,
                        ...savedMeta
                    });
                }
            } else {
                setUser(null);
                localStorage.removeItem('planit_user_auth_cache');
            }
            setLoading(false);
            clearTimeout(safetyTimer);
        });

        return () => {
            unsubscribe();
            clearTimeout(safetyTimer);
        };
    }, []);

    // Persistir cambios en Firestore cuando cambie localmente (rol, referidos, url)
    useEffect(() => {
        const updateRemoteData = async () => {
            if (user && user.uid) {
                try {
                    const userDocRef = doc(db, 'users', user.uid);
                    await updateDoc(userDocRef, {
                        role: user.role,
                        referrals: user.referrals,
                        premiumUntil: user.premiumUntil,
                        calendarUrl: user.calendarUrl || ''
                    });
                } catch (e) {
                    // Si el documento no existe o falla, lo guardamos localmente como backup
                    const meta = {
                        role: user.role,
                        referrals: user.referrals,
                        referralCode: user.referralCode,
                        premiumUntil: user.premiumUntil,
                        calendarUrl: user.calendarUrl || ''
                    };
                    localStorage.setItem(`planit_meta_${user.uid}`, JSON.stringify(meta));
                }

                // Lógica de desbloqueo por referidos
                if (user.referrals >= 3 && user.role !== ROLES.PREMIUM) {
                    upgradeToPremium(30);
                    triggerConfetti();
                }
            } else if (user && !user.uid) {
                // Modo Demo
                localStorage.setItem('planit_user_local', JSON.stringify(user));
            }
        };

        updateRemoteData();
    }, [user]);

    const logout = () => {
        if (auth && user && user.uid) {
            signOut(auth);
        } else {
            setUser(null);
            localStorage.removeItem('planit_user_local');
        }
    };

    const loginAsDemo = () => {
        const premiumDate = new Date();
        premiumDate.setFullYear(premiumDate.getFullYear() + 1);

        const demoUser = {
            name: 'Demo User (Premium)',
            email: 'demo@planit.uma.es',
            role: ROLES.PREMIUM,
            referrals: 3,
            referralCode: 'DEMO-VIP',
            premiumUntil: premiumDate.toISOString(),
            calendarUrl: ''
        };
        setUser(demoUser);
        localStorage.setItem('planit_user_local', JSON.stringify(demoUser));
    };

    const addReferral = () => {
        if (user && user.referrals < 3) {
            setUser(prev => ({ ...prev, referrals: prev.referrals + 1 }));
        }
    };

    const upgradeToPremium = (days = 30) => {
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + days);

        setUser(prev => ({
            ...prev,
            role: ROLES.PREMIUM,
            premiumUntil: expiryDate.toISOString()
        }));
    };

    const setCalendarUrl = (url) => {
        setUser(prev => ({ ...prev, calendarUrl: url }));
    };

    const triggerConfetti = () => {
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#3b82f6', '#8b5cf6', '#ffffff']
        });
    };

    return (
        <UserContext.Provider value={{
            user,
            loading,
            logout,
            loginAsDemo,
            addReferral,
            upgradeToPremium,
            setCalendarUrl,
            isPremium: user?.role === ROLES.PREMIUM,
            triggerConfetti
        }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser debe usarse dentro de un UserProvider');
    }
    return context;
};
