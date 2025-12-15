import "expo-router/entry";

import { createServer, Response, Server } from "miragejs";

declare global {
    interface Window {
        server: Server;
    }
}

if(__DEV__){
    if( window.server ){
        window.server.shutdown();
    }
}

window.server = createServer({
    routes() {
        this.post("/login", (schema, request) => {
            const { username, password } = JSON.parse(request.requestBody);

            if( username === "devtoprod" && password === "1234" ){
                return {
                    accessToken: "access-token",
                    refreshToken: "refresh-token",
                    user: {
                        id: "devtoprod",
                        name: "devtoproduction",
                        description: "은둔형 개발자",
                        profileImageUrl: "https://avatars.githubusercontent.com/u/58979877?u=7850603ed60100479b98b2a5ec1cfc9d3e092a03&v=4"
                    }
                }
            } else {
                return new Response(401, {}, { message: "Invalid credentials" });
            }
        })
    },
})