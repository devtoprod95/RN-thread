import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { createContext, useState } from "react";
import { Alert } from "react-native";

export const AuthContext = createContext<{
  user?: object | null;
  login?: () => Promise<void>;
  logout?: () => Promise<void>;
}>({});

export default function RootLayout() {
  const [user, setUser] = useState(null);

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

    console.log(response, status);

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
