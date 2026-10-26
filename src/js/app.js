import { getAccessToken, login } from "./auth"
import { startChat } from "./twitch"

const accessToken = getAccessToken()

if (accessToken) {
    startChat(accessToken)
} else {
    login()
}
