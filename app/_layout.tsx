import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { StatusBar } from "expo-status-bar";
import { createContext, useEffect, useState } from "react";
import { Alert } from "react-native";

export interface User {
  id: string;
  name: string;
  profileImageUrl: string;
  description: string;
  link?: string;
  showInstagramBadge?: boolean;
  isPrivate?: boolean;
}

export const AuthContext = createContext<{
  user: User | null;
  login?: () => Promise<any>;
  logout?: () => Promise<any>;
  updateUser?: (user: User) => void;
}>({
  user: null,
});

export default function RootLayout() {
  const [user, setUser] = useState<User | null>(null);

  const login = async() => {
    const apiFetch = await fetch("/login", {
      method: "POST",
      body: JSON.stringify({
          username: "devtoprod",
          password: "1234"
      })
    });
    const status = apiFetch.status;
    const response = await apiFetch.json();

    if( status >= 400 ){
      return Alert.alert("Login Error", response?.message);
    }

    setUser(response.user);
    await Promise.all([
      SecureStore.setItemAsync('accessToken', response.accessToken),
      SecureStore.setItemAsync('refreshToken', response.refreshToken),
      AsyncStorage.setItem('user', JSON.stringify(response.user)),
    ])
    .catch((error) => {
      console.log(error);
    });
  };

  const logout = async () => {
    setUser(null);
    await Promise.all([
      SecureStore.deleteItemAsync("accessToken"),
      SecureStore.deleteItemAsync("refreshToken"),
      AsyncStorage.removeItem("user"),
    ]);
  };

  const updateUser = (user: User) => {
    setUser(user);
    AsyncStorage.setItem("user", JSON.stringify(user));
  };

  useEffect(() => {
    AsyncStorage.getItem("user").then((user) => {
      setUser(user ? JSON.parse(user) : null);
    });
    // TODO: validating access token
  }, []);

  return (
    <AuthContext value={{ user, login, logout, updateUser }}>
      <StatusBar style="auto" animated />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="modal" options={{ presentation: "modal" }} />
      </Stack>
    </AuthContext>
  );
}