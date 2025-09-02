"use client";

import type { Recipe } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

interface User {
  name: string;
  isLoggedIn: boolean;
  isPremium: boolean;
}

interface AuthContextType {
  user: User | null;
  favorites: string[];
  allRecipes: Recipe[];
  login: (name: string) => void;
  logout: () => void;
  register: (name: string) => void;
  upgradePremium: () => void;
  toggleFavorite: (recipe: Recipe) => void;
  addRecipes: (newRecipes: Recipe[]) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const safeJSONParse = (item: string | null) => {
  if (!item) return null;
  try {
    return JSON.parse(item);
  } catch (e) {
    return null;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const storedUser = safeJSONParse(localStorage.getItem("recipeUser"));
    if (storedUser) {
      setUser(storedUser);
    }
    const storedFavorites = safeJSONParse(localStorage.getItem("recipeFavorites"));
    if (storedFavorites) {
      setFavorites(storedFavorites);
    }
    const storedAllRecipes = safeJSONParse(localStorage.getItem("recipeAllRecipes"));
    if (storedAllRecipes) {
      setAllRecipes(storedAllRecipes);
    }
  }, []);

  const persistUser = (userData: User | null) => {
    setUser(userData);
    localStorage.setItem("recipeUser", JSON.stringify(userData));
  };

  const persistFavorites = (favs: string[]) => {
    setFavorites(favs);
    localStorage.setItem("recipeFavorites", JSON.stringify(favs));
  };

  const persistAllRecipes = useCallback((recipes: Recipe[]) => {
    setAllRecipes(recipes);
    localStorage.setItem("recipeAllRecipes", JSON.stringify(recipes));
  }, []);

  const login = (name: string) => {
    const existingUser = safeJSONParse(localStorage.getItem("recipeUser"));
    persistUser({ name, isLoggedIn: true, isPremium: existingUser?.isPremium || false });
    toast({ title: "Welcome back!", description: "You are now logged in." });
    router.push("/");
  };

  const logout = () => {
    persistUser(null);
    persistFavorites([]);
    // We keep allRecipes so guest-generated recipes are still there if they log back in
    toast({ title: "Logged out", description: "You have been successfully logged out." });
    router.push("/");
  };
  
  const register = (name: string) => {
    persistUser({ name, isLoggedIn: true, isPremium: false });
    toast({ title: "Account created!", description: "Welcome to AI Recipe Curator." });
    router.push("/");
  };

  const upgradePremium = () => {
    if (user) {
      persistUser({ ...user, isPremium: true });
      toast({
        title: "Congratulations!",
        description: "You are now a premium member.",
        variant: "default",
        className: "bg-primary text-primary-foreground",
      });
      router.push("/");
    }
  };

  const toggleFavorite = (recipe: Recipe) => {
    const isFavorite = favorites.includes(recipe.title);
    if (isFavorite) {
      persistFavorites(favorites.filter((fav) => fav !== recipe.title));
      toast({ title: "Removed from favorites." });
    } else {
      persistFavorites([...favorites, recipe.title]);
      toast({ title: "Added to favorites!" });
    }
  };
  
  const addRecipes = useCallback((newRecipes: Recipe[]) => {
    const currentTitles = new Set(allRecipes.map(r => r.title));
    const uniqueNewRecipes = newRecipes.filter(r => !currentTitles.has(r.title));
    if (uniqueNewRecipes.length > 0) {
      persistAllRecipes([...allRecipes, ...uniqueNewRecipes]);
    }
  }, [allRecipes, persistAllRecipes]);

  return (
    <AuthContext.Provider
      value={{ user, favorites, allRecipes, login, logout, register, upgradePremium, toggleFavorite, addRecipes }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
