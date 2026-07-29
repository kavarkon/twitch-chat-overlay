import { addMessage } from "./chat";

const WEBSOCKET_URL = "wss://irc-ws.chat.twitch.tv:443";

const BOT_USERNAME = "kavarkon";
const CHANNEL_NAME = "kavarkon";

const OAUTH_TOKEN = "g7t8hdrpmlm59mrs8674ubu4uap1gp"

const RECONNECT_DELAY = 5000;

const DISPLAY_NAME_PATTERN = /display-name=([^;]*)/;
const PRIVATE_MESSAGE_PATTERN = /PRIVMSG #[^ ]+ :(.*)$/;

let socket = null;

function connect() {
  if (socket && socket.readyState !== WebSocket.CLOSED) {
    return;
  }

  socket = new WebSocket(WEBSOCKET_URL);

  socket.addEventListener("open", handleOpen);
  socket.addEventListener("message", handleMessage);
  socket.addEventListener("close", handleClose);
  socket.addEventListener("error", handleError);
}

function authenticate() {
  socket.send(
    "CAP REQ :twitch.tv/tags twitch.tv/commands"
  );
  socket.send(`PASS oauth:${OAUTH_TOKEN}`);
  socket.send(`NICK ${BOT_USERNAME}`);
  socket.send(`JOIN #${CHANNEL_NAME}`);
}

function handleOpen() {
  authenticate();
}

function handleMessage(event) {
  console.log(event.data);
  const messages = event.data
    .split("\r\n")
    .filter(Boolean);

  for (const message of messages) {
    handleIrcMessage(message);
  }
}

function handleIrcMessage(message) {
  console.log(message);
  if (message.startsWith("PING")) {
    socket.send("PONG :tmi.twitch.tv");
    return;
  }

  const privateMessageMatch = message.match(PRIVATE_MESSAGE_PATTERN);

  if (!privateMessageMatch) {
    return;
  }

  parsePrivateMessage(
    message,
    privateMessageMatch
  );
}

function parsePrivateMessage(message, privateMessageMatch) {
  const nicknameMatch = message.match(DISPLAY_NAME_PATTERN);

  if (!nicknameMatch) {
    return;
  }

  addMessage(
    nicknameMatch[1],
    privateMessageMatch[1]
  );
}

function handleClose() {
  console.log("Disconnected from Twitch.");

  socket = null;

  setTimeout(connect, RECONNECT_DELAY);
}

function handleError(error) {
  console.error(error);
}

function startChat() {
  connect();
}

export { startChat };
