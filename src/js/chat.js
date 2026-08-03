import notificationSoundFile from "/sounds/message.ogg";

const chat = document.querySelector(".chat");

const notificationSound = new Audio(notificationSoundFile);

const MAX_MESSAGES = 7;
const MESSAGE_LIFETIME = 180000;

function addMessage(nickname, text, emotes) {
    const message = document.createElement("div");
    const nicknameElement = document.createElement("span");
    const textElement = document.createElement("span");

    message.classList.add("message");
    nicknameElement.classList.add("message__nickname");
    textElement.classList.add("message__text");

    nicknameElement.textContent = `${nickname}: `;

    appendMessageContent(
        textElement,
        text,
        emotes
    );

    message.append(nicknameElement);
    message.append(textElement);

    chat.append(message);

    notificationSound.currentTime = 0;

    notificationSound.play().catch(() => {
    });

    setTimeout(() => {
        message.remove();
    }, MESSAGE_LIFETIME);

    if (chat.children.length > MAX_MESSAGES) {
        chat.firstElementChild.remove();
    }
}

function appendMessageContent(
    container,
    text,
    emotes
) {
    if (!emotes) {
        container.textContent = text;
        return;
    }

    const emoteRanges = [];

    for (const emote of emotes.split("/")) {
        const [id, positions] = emote.split(":");

        for (const position of positions.split(",")) {
            const [start, end] = position
                .split("-")
                .map(Number);

            emoteRanges.push({
                id,
                start,
                end
            });
        }
    }

    emoteRanges.sort((a, b) => a.start - b.start);

    let currentIndex = 0;

    for (const emote of emoteRanges) {
        if (currentIndex < emote.start) {
            container.append(
                text.slice(
                    currentIndex,
                    emote.start
                )
            );
        }

        const image = document.createElement("img");

        image.src =
            `https://static-cdn.jtvnw.net/emoticons/v2/${emote.id}/default/light/3.0`;

        image.alt = text.slice(
            emote.start,
            emote.end + 1
        );

        image.classList.add(
            "message__emote"
        );

        container.append(image);

        currentIndex = emote.end + 1;
    }

    if (currentIndex < text.length) {
        container.append(
            text.slice(currentIndex)
        );
    }
}

export { addMessage };
