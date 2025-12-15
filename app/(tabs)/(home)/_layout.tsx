import { AuthContext } from "@/app/_layout";
import SideMenu from "@/components/SideMenu";
import { Ionicons } from "@expo/vector-icons";
import { Slot, useRouter } from "expo-router";
import { useContext, useState } from "react";
import { Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialTopTabs } from "../[username]/_layout";

export default function TabLayout() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
    const { user } = useContext(AuthContext);
    const isLoggedIn = !!user;

    return (
        <View
        style={[
            styles.container,
            { paddingTop: insets.top, paddingBottom: insets.bottom },
        ]}
        >
        <View style={styles.header}>
            {isLoggedIn && (
            <Pressable
                style={styles.menuButton}
                onPress={() => {
                setIsSideMenuOpen(true);
                }}
            >
                <Ionicons name="menu" size={24} color="black" />
            </Pressable>
            )}
            <SideMenu
            isVisible={isSideMenuOpen}
            onClose={() => setIsSideMenuOpen(false)}
            />
            <Image style={styles.headerLogo} source={require("@/assets/images/react-logo.png")} />
            {!isLoggedIn && (
            <TouchableOpacity
                onPress={() => router.navigate('/login')}
                style={styles.loginButton}
            >
                <Text style={styles.loginButtonText}>로그인</Text>
            </TouchableOpacity>
            )}
        </View>
        {isLoggedIn ? (
            <MaterialTopTabs
                screenOptions={{
                lazy: true,
                tabBarStyle: {
                    backgroundColor: "white",
                    shadowColor: "transparent",
                    position: "relative",
                },
                tabBarPressColor: "transparent",
                tabBarActiveTintColor: "#555",
                tabBarIndicatorStyle: {
                    backgroundColor: "black",
                    height: 1,
                },
                tabBarIndicatorContainerStyle: {
                    backgroundColor: "#aaa",
                    position: "absolute",
                    top: 48,
                    height: 1,
                },
                }}
            >
                <MaterialTopTabs.Screen name="index" options={{ title: "Threads" }} />
                <MaterialTopTabs.Screen name="replies" options={{ title: "Replies" }} />
            </MaterialTopTabs>
        ) : (
            <Slot/>
        )}
        </View>
    );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  headerLogo: {
    width: 42,
    height: 42
  },
  loginButton: {
    position: "absolute",
    right: 20,
    top: 0,
    backgroundColor: "black",
    borderWidth: 1,
    borderColor: "black",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  loginButtonText: {
    color: "white"
  },
  menuButton: {
    position: "absolute",
    left: 20,
    top: 10
  },
});