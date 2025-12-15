import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  const router = useRouter();

  return (
    <View>
      <View>
        <TouchableOpacity onPress={() => router.push(`/@test/post/1`)} >
          <Text>게시글1</Text>
        </TouchableOpacity>
      </View>
      <View>
        <TouchableOpacity onPress={() => router.push(`/@test/post/2`)} >
          <Text>게시글2</Text>
        </TouchableOpacity>
      </View>
      <View>
        <TouchableOpacity onPress={() => router.push(`/@test/post/3`)} >
          <Text>게시글3</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
