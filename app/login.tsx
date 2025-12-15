import { Redirect, useRouter } from "expo-router";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Login() {
    const insets = useSafeAreaInsets();
    const isLoggedIn = false;
    if(isLoggedIn) {
        return <Redirect href="/(tabs)" />;
    }
    const router = useRouter();

    const onLogin = async() => {
        const apiFetch = await fetch("/login", {
            method: "POST",
            body: JSON.stringify({
                username: "devtoprod",
                password: "12345"
            })
        });
        const status = apiFetch.status;
        const response = await apiFetch.json();

        console.log(response);

        if( status !== 200 ){
            return Alert.alert("Login Error", response?.message);
        }

    }

    return (
        <View style={{ paddingTop: insets.top }}>
            <Pressable
                onPress={() => router.back()}
            >
                <Text>Back</Text>
            </Pressable>
            <Pressable
                onPress={onLogin}
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