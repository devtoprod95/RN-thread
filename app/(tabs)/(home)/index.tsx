import Post, { type Post as PostType } from "@/components/Post";
import { FlashList } from "@shopify/flash-list";
import * as Haptics from "expo-haptics";
import { usePathname, useRouter } from "expo-router";
import { useContext, useEffect, useRef, useState } from "react";
import {
  PanResponder,
  StyleSheet,
  useColorScheme,
  View
} from "react-native";
import Animated, { useAnimatedScrollHandler, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { AnimationContext } from "./_layout";

const AnimatedFlashList = Animated.createAnimatedComponent(FlashList<PostType>);

export default function Index() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const pathname = usePathname();
  const [posts, setPosts] = useState<PostType[]>([]);
  const scrollPosition = useSharedValue(0);
  const isReadyToRefresh = useSharedValue(false);
  const { pullDownPosition } = useContext(AnimationContext);

  useEffect(() => {
    fetch(`/posts`)
    .then((res) => res.json())
    .then((data) => {
      setPosts(data.posts);
    });
  }, []);

  const onEndReached = () => {
    console.log(`${pathname} onEndReached`);
    fetch(`/posts?cursor=${posts.at(-1)?.id}`)
    .then((res) => res.json())
    .then((data) => {
      if( data.posts.length > 0 ){
        setPosts((prev) => [...prev, ...data.posts]);
      }
    })
  };

  const onRefresh = (done: () => void) => {
    setPosts([]);
    // 진동
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    fetch(`/posts`)
    .then((res) => res.json())
    .then((data) => {
      setPosts(data.posts);
    })
    .finally(() => {
      done();
    })
  }

  const onPanRelease = () => {
    pullDownPosition.value = withTiming(isReadyToRefresh.value ? 60 : 0, { duration: 180 });
    if( isReadyToRefresh.value ){
      onRefresh(() => {
        pullDownPosition.value = withTiming(0, { duration: 180 });
      });
    }
  }
  
  const panResponderRef = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gestureState) => {
        const max = 120;
        pullDownPosition.value = Math.max(Math.min(gestureState.dy, max), 0);
        console.log("pull", pullDownPosition.value);

        if( pullDownPosition.value >= max / 2 && isReadyToRefresh.value === false ){
          isReadyToRefresh.value = true;
        }
        if( pullDownPosition.value < max / 2 && isReadyToRefresh.value === true ){
          isReadyToRefresh.value = false;
        }
      },
      onPanResponderRelease: onPanRelease,
      onPanResponderTerminate: onPanRelease,
    })
  )

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      'worklet';
      console.log('onScroll', event.contentOffset.y);
      scrollPosition.value = event.contentOffset.y;
    },
  });

  const pullDownStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: pullDownPosition.value }]
    }
  });

  return (
    <Animated.View
      style={[
        styles.container,
        colorScheme === "dark" ? styles.containerDark : styles.containerLight,
        pullDownStyle
      ]}
      {...panResponderRef.current.panHandlers}
    >
      <AnimatedFlashList
        refreshControl={<View />}
        data={posts}
        nestedScrollEnabled={true}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        renderItem={({ item }) => <Post item={item} />}
        onEndReached={onEndReached}
        onEndReachedThreshold={2}
        ListEmptyComponent={() => <View style={{ height: 1 }} />}
      />
    </Animated.View>
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