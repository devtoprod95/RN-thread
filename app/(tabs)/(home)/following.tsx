import Post, { type Post as PostType } from "@/components/Post";
import { FlashList } from "@shopify/flash-list";
import { usePathname, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    StyleSheet,
    useColorScheme,
    View
} from "react-native";
export default function Following() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const pathname = usePathname();
  const [posts, setPosts] = useState<PostType[]>([]);

  useEffect(() => {
    fetch(`/posts?type=following`)
    .then((res) => res.json())
    .then((data) => {
      setPosts(data.posts);
    });
  }, []);

  const onEndReached = () => {
    console.log(`${pathname} onEndReached`);
    if( posts.length > 0 ){
      fetch(`/posts?type=following&cursor=${posts.at(-1)?.id}`)
      .then((res) => res.json())
      .then((data) => {
        if( data.posts.length > 0 ){
          setPosts((prev) => [...prev, ...data.posts]);
        }
      })
    }
  }

  return (
    <View
      style={[
        styles.container,
        colorScheme === "dark" ? styles.containerDark : styles.containerLight,
      ]}
    >
      <FlashList
        data={posts}
        renderItem={({ item }) => <Post item={item} />}
        onEndReached={onEndReached}
        onEndReachedThreshold={2}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerLight: {
    backgroundColor: "white",
  },
  containerDark: {
    backgroundColor: "#101010",
  },
  textLight: {
    color: "black",
  },
  textDark: {
    color: "white",
  },
});