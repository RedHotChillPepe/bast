import React, { createContext, useContext, useState } from 'react';
import { useColorScheme } from 'react-native';

// Базовые стили
const baseStyles = (colors) => {

    const spacing = {
        small: 8,
        medium: 16,
        large: 24,
        xLarge: 32,
    };

    return {
        typography: {
            title1: {
                fontFamily: 'Sora700',
                fontSize: 28,
                lineHeight: 35.312,
                letterSpacing: -0.84,
                textAlign: 'center',
                color: colors.text
            },
            title2: {
                fontFamily: 'Sora700',
                fontSize: 20,
                lineHeight: 25.223,
                letterSpacing: -0.6,
                textAlign: 'center',
                color: colors.text
            },
            title3: (type = "text", textAlign = "center") => {
                return {
                    fontFamily: 'Sora700',
                    fontSize: 16,
                    lineHeight: 20.178,
                    letterSpacing: -0.48,
                    textAlign,
                    color: colors[type]
                }
            },
            regular: (type = "text", sora = 400, align = "center") => {
                return {
                    fontFamily: `Sora${sora}`,
                    fontSize: 14,
                    lineHeight: 17.656,
                    letterSpacing: -0.42,
                    textAlign: align,
                    color: colors[type]
                }
            },
            regularBold: {
                fontFamily: 'Sora700',
                fontSize: 14,
                lineHeight: 17.656,
                letterSpacing: -0.42,
                textAlign: 'center',
                color: colors.text
            },
            caption: {
                fontFamily: 'Sora400',
                fontSize: 12,
                lineHeight: 16,
                letterSpacing: -0.36,
                textAlign: 'center',
                color: colors.caption
            },
            captionBold: {
                fontFamily: 'Sora500',
                fontSize: 12,
                lineHeight: 16,
                letterSpacing: -0.36,
                textAlign: 'center',
                color: colors.block
            },
            buttonTextXL: {
                color: colors.block,
                fontSize: 16,
                fontWeight: 600,
                lineHeight: 20.17,
                letterSpacing: -0.48,
                fontFamily: "Sora700",
            },
            buttonTextMedium: {
                // color: colors.block,
                // fontSize: 14,
                // fontFamily: 'Sora400'
            },
            buttonTextSmall: {
                color: colors.block,
                fontSize: 14,
                fontFamily: 'Sora400',
                lineHeight: 17.656,
                letterSpacing: -0.42,
                textAlign: "center"
            },
            tabBarText: {
                fontFamily: 'Sora400',
                fontSize: 10,
                lineHeight: 12.611,
                letterSpacing: -0.3,
                textAlign: 'center',
            },
            statusText: {
                fontFamily: 'Sora400',
                fontSize: 12,
                lineHeight: 16,
                letterSpacing: -0.36,
                textAlign: 'center',
            },
            customText: (font = 400, fontSize = 10, color = colors.text) => {
                return {
                    fontFamily: `Sora${font}`,
                    fontSize,
                    lineHeight: 12.611,
                    letterSpacing: -0.3,
                    textAlign: 'center',
                    color
                }
            },
            errorText: {
                color: colors.error,
                fontSize: 14,
                lineHeight: 17.6,
                letterSpacing: -0.42,
                fontWeight: 400,
                fontFamily: "Sora400",
            },
        },
        buttons: {
            buttonCustom: (vertical = 12, horizontal = 12, color = "#2C88EC") => {
                return {
                    backgroundColor: color,
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 12,
                    paddingHorizontal: horizontal,
                    paddingVertical: vertical
                }
            },
            classisButton: {
                padding: 12,
                backgroundColor: colors.accent,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 12,
            }
        },
        container: {
            backgroundColor: colors.background,
            padding: spacing.medium,
            flex: 1,
        },
        spacing,
    }
};

const colorSchemes = {
    light: {
        block: '#F2F2F7',
        background: '#E5E5EA',
        text: '#3E3E3E',
        accent: '#2C88EC',
        accentLight: 'rgba(44, 136, 236, 0.40)',
        caption: '#808080',
        placeholder: '#A1A1A1',
        black: '#000',
        white: '#FFF',
        error: "red",
        success: "#4CAF50",
        warn: "#FFC107"
    },
    dark: {
        block: '#1C1C1E',
        background: '#000000',
        text: '#E5E5EA',
        accent: '#0A84FF',
        accentLight: 'rgba(10, 132, 255, 0.40)',
        caption: '#8E8E93',
        placeholder: '#636366',
        black: '#000',
        white: '#FFF',
        error: "red",
        success: "#4CAF50",
        warn: "#FFC107"
    }
};

// Создание тем
const createTheme = (colors) => ({
    ...baseStyles(colors), // Передаём цвета в baseStyles
    colors, // Сохраняем также отдельно доступ к цветам
});

const themes = {
    light: createTheme(colorSchemes.light),
    dark: createTheme(colorSchemes.dark),
};

const ThemeContext = createContext({
    theme: themes.light,
    toggleTheme: () => { },
    isDark: false,
});

export const ThemeProvider = ({ children }) => {
    const colorScheme = useColorScheme();
    const [isDark, setIsDark] = useState(colorScheme === 'dark');

    const toggleTheme = () => setIsDark(!isDark);
    const theme = isDark ? themes.dark : themes.light;

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, isDark }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);