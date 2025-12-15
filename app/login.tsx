import { Redirect, useRouter } from "expo-router";
import { useContext } from 'react';
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AuthContext } from './_layout';

export default function Login() {
    const insets = useSafeAreaInsets();
    const { user, login, logout } = useContext(AuthContext);

    const isLoggedIn = !!user;
    if(isLoggedIn) {
        return <Redirect href="/(tabs)" />;
    }
    const router = useRouter();

    return (
        <View style={{ paddingTop: insets.top }}>
            <Pressable
                onPress={() => router.back()}
            >
                <Text>Back</Text>
            </Pressable>
            <Pressable
                onPress={login}
                style={styles.loginButton}
            >
                <Text style={styles.loginButtonText}>Login</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    loginButton: {
        backgroundColor: "blue",
        padding: 10,
        borderRadius: 5,
        width: 100,
        alignItems: "center"
    },
    loginButtonText: {
        color: "white"
    }
})