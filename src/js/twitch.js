import { addMessage } from "./chat";

const WEBSOCKET_URL = "wss://irc-ws.chat.twitch.tv:443";

const BOT_USERNAME = "";
const OAUTH_TOKEN = "";
const CHANNEL_NAME = "";

function connect() {
    return new WebSocket(WEBSOCKET_URL);
}

function authenticate(socket) {
    socket.send(`PASS oauth:${OAUTH_TOKEN}`);
    socket.send(`NICK ${BOT_USERNAME}`);
    socket.send(`JOIN #${CHANNEL_NAME}`);
}

function handleOpen(socket) {
    authenticate(socket);
}

function handleClose() {
    console.log("Disconnected from Twitch.");
}

function handleError(error) {
    console.error(error);
}

function handleMessage(event, socket) {
    const message = event.data;

    if (message.startsWith("PING")) {
        socket.send("PONG :tmi.twitch.tv");
        return;
    }

    if (!message.includes("PRIVMSG")) {
        return;
    }

    const parsedMessage = parseMessage(message);

    if (!parsedMessage) {
        return;
    }

    addMessage(
        parsedMessage.nickname,
        parsedMessage.text
    );
}

function parseMessage(message) {
    const nicknameMatch = message.match(/display-name=([^;]*)/);

    const textMatch = message.match(/PRIVMSG #[^ ]+ :(.*)$/);

    if (!nicknameMatch || !textMatch) {
        return null;
    }

    return {
        nickname: nicknameMatch[1],
        text: textMatch[1]
    };
}

function startChat() {
    const socket = connect();

    socket.addEventListener("open", () => {
        handleOpen(socket);
    });

    socket.addEventListener("message", (event) => {
        handleMessage(event, socket);
    });

    socket.addEventListener("close", handleClose);

    socket.addEventListener("error", handleError);
}

export { startChat };
