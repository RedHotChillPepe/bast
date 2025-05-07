import React, { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
    const [favorites, setFavorites,] = useState([]);

    useEffect(() => {
        const loadFavorites = async () => {
            const stored = await SecureStore.getItemAsync('favs');
            if (stored) setFavorites(JSON.parse(stored));
        };
        loadFavorites();
    }, []);

    const toggleFavorite = async (id) => {
        const updated = favorites.includes(id) ? favorites.filter(favId => favId !== id) : [...favorites, id];
        setFavorites(updated);
        await SecureStore.setItemAsync('favs', JSON.stringify(updated));
    };

    const isFavorite = (id) => favorites.includes(id);

    return (
        <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
            {children}
        </FavoritesContext.Provider>
    );
};

export const useFavorites = () => useContext(FavoritesContext);
