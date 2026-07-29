const CLIENT_ID = "5qyti7nv3ed7yqsstpthzcia1ve0la";

const REDIRECT_URI =
    "https://kavarkon.github.io/twitch-chat-overlay/";

const SCOPES = [
    "chat:read",
    "chat:edit"
];

function getAccessToken() {
    const hash = new URLSearchParams(
        window.location.hash.slice(1)
    );

    const accessToken = hash.get("access_token");

    if (accessToken) {
        localStorage.setItem(
            "twitch_access_token",
            accessToken
        );

        window.history.replaceState(
            {},
            document.title,
            window.location.pathname
        );

        return accessToken;
    }

    return localStorage.getItem(
        "twitch_access_token"
    );
}

function login() {
    const url = new URL(
        "https://id.twitch.tv/oauth2/authorize"
    );

    url.searchParams.set("client_id", CLIENT_ID);
    url.searchParams.set("redirect_uri", REDIRECT_URI);
    url.searchParams.set("response_type", "token");
    url.searchParams.set("scope", SCOPES.join(" "));

    window.location.href = url.toString();
}

export {
    getAccessToken,
    login
};
