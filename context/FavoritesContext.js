import React, { createContext, useContext, useEffect, useState } from "react";
import { useApi } from "./ApiContext";

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getFavorites, addFavorites, removeFavorites } = useApi();

  // Загрузка избранного с сервера
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const response = await getFavorites();
        if (response.success !== false) {
          const ids = response.map((item) => item.postId);
          setFavorites(ids);
        }
      } catch (error) {
        console.error("Ошибка при загрузке избранного:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, []);

  const toggleFavorite = async (postId) => {
    try {
      if (favorites.includes(postId)) {
        const response = await removeFavorites(postId);
        if (response.success === false) throw new Error(response.message);
        setFavorites((prev) => prev.filter((id) => id !== postId));
      } else {
        const response = await addFavorites(postId);
        if (response.success === false) throw new Error(response.message);
        setFavorites((prev) => [...prev, postId]);
      }
    } catch (error) {
      console.error("Ошибка при переключении избранного:", error);
    }
  };

  const isFavorite = (id) => favorites.includes(id);

  return (
    <FavoritesContext.Provider
      value={{ favorites, toggleFavorite, isFavorite, loading }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);
