import { useTheme } from '@/contexts/ThemeContext';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function QRScannerScreen() {
    const router = useRouter();
    const { effectiveTheme } = useTheme();
    const isDark = effectiveTheme === 'dark';
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        // Timeout de 1 minuto
        timeoutRef.current = setTimeout(() => {
            Alert.alert(
                'Tiempo agotado',
                'No se pudo leer el código QR. Intenta nuevamente.',
                [
                    {
                        text: 'OK',
                        onPress: () => router.back(),
                    },
                ]
            );
        }, 60000); // 60 segundos

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [router]);

    const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
        if (scanned) return;

        setScanned(true);
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        try {
            // El QR contiene el JSON completo de la obra
            const obraData = JSON.parse(data);

            if (!obraData.id || !obraData.titulo) {
                throw new Error('JSON incompleto');
            }

            // Codificar el JSON para pasarlo como parámetro
            const encodedData = encodeURIComponent(JSON.stringify(obraData));
            router.push(`/obra-detalle?data=${encodedData}`);
        } catch (error) {
            console.error('Error parsing QR:', error);
            Alert.alert('Error', 'Código QR inválido o incompleto', [
                {
                    text: 'OK',
                    onPress: () => router.back(),
                },
            ]);
        }
    };

    if (!permission) {
        return (
            <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
                <View style={styles.centerContent}>
                    <Text style={[styles.message, isDark && styles.messageDark]}>
                        Solicitando permisos de cámara...
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    if (!permission.granted) {
        return (
            <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
                <View style={styles.centerContent}>
                    <Text style={[styles.message, isDark && styles.messageDark]}>
                        Necesitamos tu permiso para usar la cámara
                    </Text>
                    <TouchableOpacity
                        style={[styles.button, isDark && styles.buttonDark]}
                        onPress={requestPermission}
                    >
                        <Text style={[styles.buttonText, isDark && styles.buttonTextDark]}>
                            Conceder permiso
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.buttonSecondary, isDark && styles.buttonSecondaryDark]}
                        onPress={() => router.back()}
                    >
                        <Text style={[styles.buttonSecondaryText, isDark && styles.buttonSecondaryTextDark]}>
                            Volver
                        </Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={styles.backButton}
                >
                    <Text style={[styles.backButtonText, isDark && styles.backButtonTextDark]}>
                        ← Volver
                    </Text>
                </TouchableOpacity>
                <Text style={[styles.headerTitle, isDark && styles.headerTitleDark]}>
                    Escanear QR
                </Text>
                <View style={styles.headerSpacer} />
            </View>

            <View style={styles.cameraContainer}>
                <CameraView
                    style={styles.camera}
                    facing="back"
                    onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                    barcodeScannerSettings={{
                        barcodeTypes: ['qr'],
                    }}
                />

                <View style={styles.overlay}>
                    <View style={styles.scanArea}>
                        <View style={[styles.corner, styles.topLeft]} />
                        <View style={[styles.corner, styles.topRight]} />
                        <View style={[styles.corner, styles.bottomLeft]} />
                        <View style={[styles.corner, styles.bottomRight]} />
                    </View>
                </View>

                <View style={styles.instructionsContainer}>
                    <Text style={styles.instructions}>
                        Apunta la cámara hacia el código QR de la obra
                    </Text>
                    <Text style={styles.subInstructions}>
                        Tiempo máximo: 1 minuto
                    </Text>
                </View>
            </View>

            {scanned && (
                <TouchableOpacity
                    style={[styles.scanAgainButton, isDark && styles.scanAgainButtonDark]}
                    onPress={() => setScanned(false)}
                >
                    <Text style={[styles.scanAgainText, isDark && styles.scanAgainTextDark]}>
                        Escanear nuevamente
                    </Text>
                </TouchableOpacity>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fafafa',
    },
    containerDark: {
        backgroundColor: '#0a0a0a',
    },
    centerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    backButton: {
        padding: 8,
    },
    backButtonText: {
        fontSize: 16,
        color: '#1a1a1a',
        fontWeight: '300',
    },
    backButtonTextDark: {
        color: '#e5e5e5',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '300',
        color: '#1a1a1a',
        letterSpacing: 0.5,
    },
    headerTitleDark: {
        color: '#e5e5e5',
    },
    headerSpacer: {
        width: 60,
    },
    message: {
        fontSize: 16,
        color: '#1a1a1a',
        textAlign: 'center',
        marginBottom: 24,
        fontWeight: '300',
    },
    messageDark: {
        color: '#e5e5e5',
    },
    button: {
        backgroundColor: '#1a1a1a',
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 8,
        marginBottom: 12,
    },
    buttonDark: {
        backgroundColor: '#e5e5e5',
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 15,
        fontWeight: '400',
        letterSpacing: 0.3,
    },
    buttonTextDark: {
        color: '#1a1a1a',
    },
    buttonSecondary: {
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#1a1a1a',
    },
    buttonSecondaryDark: {
        borderColor: '#e5e5e5',
    },
    buttonSecondaryText: {
        color: '#1a1a1a',
        fontSize: 15,
        fontWeight: '300',
    },
    buttonSecondaryTextDark: {
        color: '#e5e5e5',
    },
    cameraContainer: {
        flex: 1,
        position: 'relative',
    },
    camera: {
        flex: 1,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scanArea: {
        width: 250,
        height: 250,
        position: 'relative',
    },
    corner: {
        position: 'absolute',
        width: 40,
        height: 40,
        borderColor: '#ffffff',
    },
    topLeft: {
        top: 0,
        left: 0,
        borderTopWidth: 4,
        borderLeftWidth: 4,
    },
    topRight: {
        top: 0,
        right: 0,
        borderTopWidth: 4,
        borderRightWidth: 4,
    },
    bottomLeft: {
        bottom: 0,
        left: 0,
        borderBottomWidth: 4,
        borderLeftWidth: 4,
    },
    bottomRight: {
        bottom: 0,
        right: 0,
        borderBottomWidth: 4,
        borderRightWidth: 4,
    },
    instructionsContainer: {
        position: 'absolute',
        bottom: 80,
        left: 0,
        right: 0,
        alignItems: 'center',
        paddingHorizontal: 32,
    },
    instructions: {
        fontSize: 16,
        color: '#ffffff',
        textAlign: 'center',
        fontWeight: '400',
        marginBottom: 8,
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
    },
    subInstructions: {
        fontSize: 13,
        color: '#e5e5e5',
        textAlign: 'center',
        fontWeight: '300',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
    },
    scanAgainButton: {
        margin: 20,
        backgroundColor: '#1a1a1a',
        paddingVertical: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    scanAgainButtonDark: {
        backgroundColor: '#e5e5e5',
    },
    scanAgainText: {
        color: '#ffffff',
        fontSize: 15,
        fontWeight: '400',
    },
    scanAgainTextDark: {
        color: '#1a1a1a',
    },
});
