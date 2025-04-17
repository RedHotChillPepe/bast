import React, { useState, useRef, useEffect } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ChevronRight from '../assets/svg/ChevronRight';

const AccordionList = ({ title, children, isExpanded = false }) => {
    const [expanded, setExpanded] = useState(isExpanded);
    const animation = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(animation, {
            toValue: expanded ? 1 : 0,
            duration: 200,
            useNativeDriver: true,
        }).start();
    }, [expanded]);

    const rotate = animation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '90deg'],
    });

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => setExpanded(!expanded)} style={styles.header}>
                <Text style={styles.title}>{title}</Text>
                <Animated.View style={{ transform: [{ rotate }] }}>
                    <ChevronRight />
                </Animated.View>
            </TouchableOpacity>

            {expanded && <View style={styles.content}>{children}</View>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F2F2F7',
        borderRadius: 12,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
        alignItems: 'center',
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#3E3E3E',
        fontFamily: 'Sora700',
    },
    content: {
        padding: 16,
        rowGap: 24
    },
});

export default AccordionList;
