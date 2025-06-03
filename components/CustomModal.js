import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    Modal,
    PanResponder,
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text,
    View
} from 'react-native';

const { height } = Dimensions.get('window');
export default function CustomModal({ isVisible, onClose, buttonLeft, buttonRight, children, customHeight = "100%", title }) {
    const translateY = useRef(new Animated.Value(height)).current;
    const [visible, setVisible] = useState(isVisible);

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,

            onPanResponderMove: Animated.event(
                [null, { dy: translateY }],
                {
                    useNativeDriver: false,
                    listener: (evt, gestureState) => {
                        const { dy } = gestureState;
                        if (dy < 0) {
                            translateY.setValue(0);
                        }
                    }
                }
            ),

            onPanResponderRelease: (evt, gestureState) => {
                const { dy, vy } = gestureState;
                if (dy > 100 || vy > 1) {
                    closeModal();
                } else {
                    Animated.spring(translateY, {
                        toValue: 0,
                        useNativeDriver: false,
                    }).start();
                }
            },
        })
    ).current;

    const openModal = () => {
        setVisible(true);
        translateY.setValue(height);
        Animated.spring(translateY, {
            toValue: 0,
            bounciness: 5,
            useNativeDriver: false,
        }).start();
    };

    const closeModal = () => {
        Animated.timing(translateY, {
            toValue: height,
            duration: 200,
            useNativeDriver: false,
        }).start(() => {
            setVisible(false);
            onClose?.();
        });
    };

    useEffect(() => {
        if (isVisible) {
            openModal();
        } else {
            closeModal();
        }
    }, [isVisible]);

    if (!visible) return null;

    return (
        <Modal transparent={true}>
            <SafeAreaView style={styles.overlay}>
                <Pressable style={styles.backdrop} onPress={closeModal} />
                <Animated.View
                    style={[
                        styles.modalContainer,
                        {
                            transform: [{ translateY }],
                            height: customHeight
                        },
                    ]}
                >
                    <View style={styles.handleContainer} {...panResponder.panHandlers}>
                        <View style={styles.handleItem}>
                            <Pressable onPress={closeModal}>{buttonLeft}</Pressable>
                        </View>
                        <View style={[styles.handleItem, { justifyContent: "center" }]}>
                            {title ? <Text>{title}</Text> :
                                <View style={styles.handle} />
                            }
                        </View>
                        <View style={[styles.handleItem, { justifyContent: "flex-end" }]}>
                            {buttonRight}
                        </View>
                    </View>
                    {children}
                </Animated.View>
            </SafeAreaView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.2)"
    },
    backdrop: {
        flex: 1,
    },
    modalContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 888,
        backgroundColor: '#fff',
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        overflow: 'hidden',
    },
    handleContainer: {
        alignItems: 'center',
        flexDirection: "row",
        justifyContent: 'center',
        padding: 16,
        backgroundColor: '#F2F2F7',
        // borderBottomWidth: 1,
    },
    handleItem: {
        flex: 1,
        flexDirection: "row",
    },
    handle: {
        width: 40,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#808080',
    },
});