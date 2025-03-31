import MultiSlider from '@ptomasroos/react-native-multi-slider';
import React, { useState } from 'react';
import { Dimensions, StyleSheet, Text, TextInput, View } from 'react-native';

const { width } = Dimensions.get('window');

const RangeSlider = ({
    rangeRef,           // ref, например, useRef([minValue, maxValue])
    onSliderChange,     // callback, вызывается при изменении значений
    title,              // заголовок (например, "Цена:" или "Площадь дома:")
    unit = '',          // единицы измерения (например, "₽" или "м²")
    min = 0,            // минимальное значение
    max = 100,          // максимальное значение
    step = 1,           // шаг
    sliderLength = width - 64, // длина слайдера
}) => {
    // Инициализируем локальное состояние значениями из rangeRef.current
    const [values, setValues] = useState(rangeRef.current);

    const handleValuesChange = (newValues) => {
        setValues(newValues);
        rangeRef.current = newValues;
        if (onSliderChange) {
            onSliderChange(newValues);
        }
    };

    const handleInputChange = (index, value) => {
        const newValues = [...values];
        const parsedValue = isNaN(parseInt(value)) ? 0 : parseInt(value);

        if (index === 0)
            newValues[index] = Math.min(parsedValue, values[1], max);
        else {
            newValues[index] = Math.max(parsedValue, values[0], min);
            newValues[index] = Math.min(newValues[index], max);
        }

        setValues(newValues);
        rangeRef.current = newValues;
        if (onSliderChange) onSliderChange(newValues);
    };

    return (
        <View style={styles.container}>
            {title && <Text style={styles.title}>{title}</Text>}
            <MultiSlider
                values={values}
                sliderLength={sliderLength}
                onValuesChange={handleValuesChange}
                min={min}
                max={max}
                step={step}
                selectedStyle={{ backgroundColor: '#007AFF' }}
                unselectedStyle={{ backgroundColor: '#ddd' }}
                trackStyle={{ height: 6 }}
                markerStyle={{ height: 24, width: 24, backgroundColor: '#007AFF' }}
            />
            <View style={styles.labelContainer}>
                <View style={styles.labelBlock}>
                    <Text style={styles.labelText}>От:</Text>
                    <TextInput
                        style={styles.input}
                        value={values[0].toString()}
                        onChangeText={(value) => handleInputChange(0, value)}
                        keyboardType="numeric"
                    />
                    <Text style={styles.unitText}>{unit}</Text>
                </View>
                <View style={styles.labelBlock}>
                    <Text style={styles.labelText}>До:</Text>
                    <TextInput
                        style={styles.input}
                        value={values[1].toString()}
                        onChangeText={(value) => handleInputChange(1, value)}
                        keyboardType="numeric"
                    />
                    <Text style={styles.unitText}>{unit}</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: width,
        alignItems: 'flex-start',
    },
    title: {
        fontSize: 20,
        lineHeight: 25,
        letterSpacing: -0.45,
        fontWeight: '500',
        marginBottom: 16,
        textAlign: 'center',
    },
    labelContainer: {
        width: width - 64,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
        columnGap: 16
    },
    labelBlock: {
        flexDirection: 'row',
        alignItems: 'baseline',
        columnGap: 8
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        padding: 8,
        fontSize: 14,
        lineHeight: 18,
        letterSpacing: -0.43,
        fontWeight: '400',
        fontFamily: "Sora500",
        textAlign: 'center',
    },
    unitText: {
        fontSize: 17,
        fontFamily: "Sora400",
        lineHeight: 22,
        letterSpacing: -0.43,
        fontWeight: '400',
    },
    labelText: {
        fontSize: 17,
        lineHeight: 22,
        letterSpacing: -0.43,
        fontWeight: '400',
    },
});

export default RangeSlider;