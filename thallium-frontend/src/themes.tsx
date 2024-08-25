/* eslint-disable react-refresh/only-export-components */

interface Theme {
    selectedTheme: "light" | "dark";
    backgroundColor: string;
    textColor: string;
    borderColor: string;
    linkColor: string;
    cardBackgroundColor: string;
    cardShadow: string;
    accent: string;
    inputBackgroundColor: string;
    inputPlaceholderColor: string;
}

interface ThemesStore {
    light: Theme;
    dark: Theme;
}

const commonTheme = {
    accent: "#7e5da3",
};

const themes: ThemesStore = {
    light: {
        selectedTheme: "light",
        backgroundColor: "#f0f0f0",
        textColor: "#000",
        borderColor: "#838383",
        linkColor: "#7272ff",
        cardBackgroundColor: "#dbdbdb",
        cardShadow: "#d0d0d0",
        inputBackgroundColor: "#fff",
        inputPlaceholderColor: "#949494",
        ...commonTheme,
    },
    dark: {
        selectedTheme: "dark",
        backgroundColor: "#333",
        textColor: "#fff",
        borderColor: "#949494",
        linkColor: "#8f8fff",
        cardBackgroundColor: "#2c2c2c",
        cardShadow: "#242323",
        inputBackgroundColor: "#444",
        inputPlaceholderColor: "#acacac",
        ...commonTheme,
    },
};

export default themes;

export type { Theme, ThemesStore };
