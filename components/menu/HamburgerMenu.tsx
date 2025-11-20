import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Animated,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export const HamburgerMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const { effectiveTheme } = useTheme();
  const router = useRouter();
  const [fadeAnim] = useState(new Animated.Value(0));
  const isDark = effectiveTheme === 'dark';

  const openMenu = () => {
    setIsOpen(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const closeMenu = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setIsOpen(false));
  };

  const handleNavigation = (route: string) => {
    closeMenu();
    setTimeout(() => {
      router.push(route as any);
    }, 250);
  };

  return (
    <>
      <TouchableOpacity onPress={openMenu} style={styles.hamburgerButton}>
        <View style={[styles.line, isDark && styles.lineDark]} />
        <View style={[styles.line, isDark && styles.lineDark]} />
        <View style={[styles.line, isDark && styles.lineDark]} />
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="none"
        onRequestClose={closeMenu}
      >
        <Pressable style={styles.overlay} onPress={closeMenu}>
          <Animated.View
            style={[
              styles.menuContainer,
              isDark && styles.menuContainerDark,
              {
                opacity: fadeAnim,
                transform: [
                  {
                    translateX: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-250, 0],
                    }),
                  },
                ],
              },
            ]}
            onStartShouldSetResponder={() => true}
          >
            <View style={[styles.menuHeader, isDark && styles.menuHeaderDark]}>
              <Text style={[styles.menuTitle, isDark && styles.menuTitleDark]}>Museo Digital</Text>
              {isAuthenticated && user && (
                <Text style={[styles.userText, isDark && styles.userTextDark]}>Hola, {user.nombre}</Text>
              )}
            </View>

            <View style={styles.menuItems}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => handleNavigation('/')}
              >
                <View style={styles.menuItemContent}>
                  <View style={[styles.iconCircle, { backgroundColor: '#4A90E2' }]}>
                    <Ionicons name="home-outline" size={18} color="#ffffff" />
                  </View>
                  <Text style={[styles.menuItemText, isDark && styles.menuItemTextDark]}>Inicio</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => handleNavigation('/galeria')}
              >
                <View style={styles.menuItemContent}>
                  <View style={[styles.iconCircle, { backgroundColor: '#9B59B6' }]}>
                    <Ionicons name="images-outline" size={18} color="#ffffff" />
                  </View>
                  <Text style={[styles.menuItemText, isDark && styles.menuItemTextDark]}>Explorar Galería</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => handleNavigation('/qrScanner')}
              >
                <View style={styles.menuItemContent}>
                  <View style={[styles.iconCircle, { backgroundColor: '#3498DB' }]}>
                    <MaterialIcons name="qr-code-scanner" size={18} color="#ffffff" />
                  </View>
                  <Text style={[styles.menuItemText, isDark && styles.menuItemTextDark]}>Escanear QR</Text>
                </View>
              </TouchableOpacity>

              {isAuthenticated ? (
                <>
                  <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => handleNavigation('/subir')}
                  >
                    <View style={styles.menuItemContent}>
                      <View style={[styles.iconCircle, { backgroundColor: '#27AE60' }]}>
                        <Ionicons name="cloud-upload-outline" size={18} color="#ffffff" />
                      </View>
                      <Text style={[styles.menuItemText, isDark && styles.menuItemTextDark]}>Subir Imagen</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => handleNavigation('/perfil')}
                  >
                    <View style={styles.menuItemContent}>
                      <View style={[styles.iconCircle, { backgroundColor: '#E67E22' }]}>
                        <Ionicons name="person-outline" size={18} color="#ffffff" />
                      </View>
                      <Text style={[styles.menuItemText, isDark && styles.menuItemTextDark]}>Mi Perfil</Text>
                    </View>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => handleNavigation('/login')}
                >
                  <View style={styles.menuItemContent}>
                    <View style={[styles.iconCircle, { backgroundColor: '#E74C3C' }]}>
                      <MaterialIcons name="login" size={18} color="#ffffff" />
                    </View>
                    <Text style={[styles.menuItemText, isDark && styles.menuItemTextDark]}>Ingresar</Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>

            <TouchableOpacity style={[styles.closeButton, isDark && styles.closeButtonDark]} onPress={closeMenu}>
              <Ionicons name="close" size={16} color={isDark ? '#666' : '#999'} style={{ marginRight: 8 }} />
              <Text style={[styles.closeButtonText, isDark && styles.closeButtonTextDark]}>Cerrar</Text>
            </TouchableOpacity>
          </Animated.View>
        </Pressable>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  hamburgerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  line: {
    width: 22,
    height: 2,
    backgroundColor: '#1a1a1a',
    marginVertical: 3,
    borderRadius: 1,
  },
  lineDark: {
    backgroundColor: '#e5e5e5',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-start',
  },
  menuContainer: {
    width: 280,
    height: '100%',
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 0,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  menuContainerDark: {
    backgroundColor: '#1a1a1a',
  },
  menuHeader: {
    padding: 32,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#ffffff',
  },
  menuHeaderDark: {
    backgroundColor: '#1a1a1a',
    borderBottomColor: '#2a2a2a',
  },
  menuTitle: {
    fontSize: 22,
    fontWeight: '300',
    color: '#1a1a1a',
    marginBottom: 8,
    letterSpacing: 1,
  },
  menuTitleDark: {
    color: '#e5e5e5',
  },
  userText: {
    fontSize: 13,
    color: '#757575',
    fontWeight: '300',
  },
  userTextDark: {
    color: '#999',
  },
  menuItems: {
    flex: 1,
    paddingTop: 8,
  },
  menuItem: {
    paddingVertical: 18,
    paddingHorizontal: 32,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
  menuItemText: {
    fontSize: 15,
    color: '#1a1a1a',
    fontWeight: '300',
    letterSpacing: 0.3,
  },
  menuItemTextDark: {
    color: '#e5e5e5',
  },
  closeButton: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  closeButtonDark: {
    borderTopColor: '#2a2a2a',
  },
  closeButtonText: {
    fontSize: 14,
    color: '#999',
    fontWeight: '300',
  },
  closeButtonTextDark: {
    color: '#666',
  },
});
