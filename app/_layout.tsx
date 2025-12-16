import AsyncStorage from "@react-native-async-storage/async-storage";
import { Asset } from "expo-asset";
import Constants from "expo-constants";
import { Stack } from "expo-router";
import * as SecureStore from "expo-secure-store";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Alert, Animated, StyleSheet, View } from "react-native";

// expo에서 기본 splash를 자동으로 숨기기 때문에 그걸 막음
SplashScreen.preventAutoHideAsync().catch(() => {
})

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

export function AnimatedAppLoader({ children, image }: { children: React.ReactNode, image: number }) {
  const [user, setUser] = useState<User | null>(null);
  const [isSplashReady, setSplashReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      await Asset.loadAsync(image);
      setSplashReady(true);
    }

    prepare();
  }, [image]);

  useEffect(() => {

  }, []);

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

  const updateUser = (user: User | null) => {
    setUser(user);
    if( user ){
      AsyncStorage.setItem("user", JSON.stringify(user));
    } else {
      AsyncStorage.removeItem("user");
    }
  };
  
  if(!isSplashReady){
    return null;
  }

  return (
    <AuthContext value={{ user, login, logout, updateUser }}>
      <AnimatedSplashScreen image={image}>
        { children }
      </AnimatedSplashScreen>
    </AuthContext>
  )
}

function AnimatedSplashScreen({ children, image }: { children: React.ReactNode, image: number}) {
  const [isAppReady, setAppReady] = useState(false);
  const [isSplashAnimationComplete, setAnimationComplete] = useState(false);
  const animation = useRef(new Animated.Value(1)).current;
  const {updateUser} = useContext(AuthContext);

  useEffect(() => {
    if( isAppReady ){
      Animated.timing(animation, {
        toValue: 0,
        duration: 2000,
        useNativeDriver: true,
      }).start(() => setAnimationComplete(true));
    }
  }, [isAppReady]);

  const onimageLoaded = async () => {
    try {
      // 데이터 준비
      // TODO: validating access token
      await Promise.all([
        AsyncStorage.getItem("user").then((user) => {
          updateUser?.(user ? JSON.parse(user) : null);
        }),
      ]);

      // 기본 스플래시를 숨기고 custom한 스플래시를 보인다
      await SplashScreen.hideAsync();
    } catch (error) {
      console.error(error);
    } finally {
      setAppReady(true);
    }
  }

  const rotateValue = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"]
  })

  return (
    <View style={{flex: 1}}>
      {isAppReady && children}
      {!isSplashAnimationComplete && (
        <Animated.View pointerEvents="none" style={[{
          ...StyleSheet.absoluteFillObject,
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: Constants.expoConfig?.splash?.backgroundColor || '#ffffff',
          opacity: animation
        }]}>
          <Animated.Image 
            source={image}
            style={{
              resizeMode: Constants.expoConfig?.splash?.resizeMode || "contain",
              width: Constants.expoConfig?.splash?.imageWidth || 200,
              transform: [
                { scale: animation },
                { rotate: rotateValue }
              ]
            }}
            onLoadEnd={onimageLoaded}
            fadeDuration={0}
          />
        </Animated.View>
      )}
    </View>
  )
}

export default function RootLayout() {
  return (
    <AnimatedAppLoader image={require("@/assets/images/react-logo.png")}>
      <StatusBar style="auto" animated />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="modal" options={{ presentation: "modal" }} />
      </Stack>
    </AnimatedAppLoader>
  );
}