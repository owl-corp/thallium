interface Theme {
    backgroundColor: string;
    textColor: string;
    borderColor: string;
    linkColor: string;
    cardBackgroundColor: string;
    cardShadow: string;
}

interface ThemesStore {
    light: Theme;
    dark: Theme;
}

const themes: ThemesStore = {
    light: {
        backgroundColor: '#f0f0f0',
        textColor: '#000',
        borderColor: '#ccc',
        linkColor: '#7272ff',
        cardBackgroundColor: '#ebebeb',
        cardShadow: '#d0d0d0',
    },
    dark: {
        backgroundColor: '#333',
        textColor: '#fff',
        borderColor: '#949494',
        linkColor: '#8f8fff',
        cardBackgroundColor: '#2c2c2c',
        cardShadow: '#242323',
    },
};

export default themes;

export type { Theme, ThemesStore };
