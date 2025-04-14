import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';

const LoggerContext = createContext();
const host = process.env.EXPO_PUBLIC_API_HOST;

// Функция для извлечения имени компонента из stack trace
const extractComponentName = (stack) => {
    if (!stack) return 'UnknownComponent';

    const match = stack.match(/pages[\\/]([^\\/]+)\.bundle/);
    return match ? match[1] : 'UnknownComponent';
};

export const useLogger = () => {
    return useContext(LoggerContext);
};

export const LoggerProvider = ({ children }) => {

    const sendLog = useCallback(async (level, componentName, message, metadata = {}) => {
        // Разделяем технические и пользовательские метаданные
        const {
            error_type = 'UnknownError',
            stack_trace = null,
            ...userMetadata
        } = metadata;

        const logData = {
            component_name: componentName || 'UnknownComponent',
            log_level: level.toUpperCase(),
            log_message: message,
            log_data: {
                error_type,
                environment: process.env.NODE_ENV,
                device_info: {
                    os: Platform.OS,
                    version: Platform.Version,
                    is_emulator: Platform.isTesting,
                },
                stack_trace // Теперь stack сохраняется в корне объекта
            },
            metadata: userMetadata, // Только пользовательские метаданные
        };

        if (process.env.NODE_ENV === 'development') {
            console[level]('Log payload:', { component_name: logData.component_name, handleName: userMetadata.handleName, log_message: logData.log_message, stack_trace });
        }

        try {
            const response = await fetch(`${host}api/logs`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(logData),
            });

            if (!response.ok) {
                console.error('Logger failed:', await response.text());
            }
        } catch (error) {
            console.error('Logger network error:', error);
        }
    }, []);

    const logError = useCallback((componentName, error, metadata = {}) => {
        const message = error instanceof Error ? error.message : String(error);
        const stack = error instanceof Error ? error.stack : null;

        sendLog('error', componentName, message, {
            ...metadata, // Пользовательские метаданные
            error_type: error?.name || 'UnknownError',
            stack_trace: stack, // Гарантированное сохранение stack
        });
    }, [sendLog]);

    const logWarning = useCallback((message, metadata = {}) => {
        const componentName = extractComponentName(new Error().stack);
        sendLog('warn', componentName, message, metadata);
    }, [sendLog]);

    const logInfo = useCallback((message, metadata = {}) => {
        const componentName = extractComponentName(new Error().stack);
        sendLog('info', componentName, message, metadata);
    }, [sendLog]);

    return (
        <LoggerContext.Provider value={{
            logError,
            logWarning,
            logInfo,
            sendLog // Экспортируем для кастомного использования
        }}>
            {children}
        </LoggerContext.Provider>
    );
};