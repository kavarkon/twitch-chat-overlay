const chat = document.querySelector(".chat");

const MAX_MESSAGES = 7;

function addMessage(nickname, text) {
    const message = document.createElement("div");
    const nicknameElement = document.createElement("span");
    const textElement = document.createElement("span");

    message.classList.add("message");
    nicknameElement.classList.add("message__nickname");
    textElement.classList.add("message__text");

    nicknameElement.textContent = nickname;
    textElement.textContent = text;

    message.append(nicknameElement);
    message.append(textElement);

    chat.append(message);

    if (chat.children.length > MAX_MESSAGES) {
        chat.firstElementChild.remove();
    }
}

export { addMessage };
