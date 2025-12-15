import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { createContext, useEffect, useState } from "react";
import { Alert } from "react-native";

interface User {
  id: string;
  name: string;
  profileImageUrl: string;
  description: string;
}

export const AuthContext = createContext<{
  user?: User|null;
  login?: () => Promise<any>;
  logout?: () => Promise<any>;
}>({});

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
  const logout = async() => {
    setUser(null);
    await Promise.all([
      SecureStore.deleteItemAsync('accessToken'),
      SecureStore.deleteItemAsync('refreshToken'),
      AsyncStorage.removeItem('user'),
    ]);
  };

  useEffect(() => {
    AsyncStorage.getItem("user").then((user) => {
      setUser(user ? JSON.parse(user) : null);
    });
    // todo: access token 유효성 체크
  }, []);

  return (
    <AuthContext value={{ user, login, logout }} >
      <Stack 
        screenOptions={{ 
          headerShown: false,
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="modal" options={{ presentation: "modal" }} />
      </Stack>
    </AuthContext>
  );
}
