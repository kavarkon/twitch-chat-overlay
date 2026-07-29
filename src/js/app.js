import { getAccessToken, login } from "./auth";
import { startChat } from "./twitch";

const accessToken = getAccessToken();

if (!accessToken) {
    login();
} else {
    startChat(accessToken);
}
