import { useLocalSearchParams, useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  const router = useRouter();
  const { username } = useLocalSearchParams();

  return (
    <View
      style={{
        justifyContent: "center",
        flex: 1,
        alignItems: "center",
      }}
    >
      <View>
        <TouchableOpacity onPress={() => router.push(`/${username}`)} >
          <Text>Threads</Text>
        </TouchableOpacity>
      </View>
      <View>
        <TouchableOpacity onPress={() => router.push(`/${username}/replies`)} >
          <Text>replies</Text>
        </TouchableOpacity>
      </View>
      <View>
        <TouchableOpacity onPress={() => router.push(`/${username}/reposts`)} >
          <Text>reposts</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
