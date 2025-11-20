import { HamburgerMenu } from '@/components/menu/HamburgerMenu';
import { ThemeToggle } from '@/components/menu/ThemeToggle';
import { config } from '@/config/env';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

interface Imagen {
  id: number;
  titulo: string;
  url: string;
  autor: string;
}

export default function HomeScreen() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const { effectiveTheme } = useTheme();
  const isDark = effectiveTheme === 'dark';

  const [images, setImages] = useState<Imagen[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchImages();
  }, []);

  useEffect(() => {
    if (images.length > 0) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }, 4000); // Cambia cada 4 segundos

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [images.length]);

  const fetchImages = async () => {
    try {
      const response = await fetch(`${config.API_BASE_URL}/api/imagenes`);
      const data = await response.json();

      if (data && Array.isArray(data)) {
        // Reemplazar localhost con la IP en las URLs
        const imagesWithFixedUrls = data.map((img: Imagen) => ({
          ...img,
          url: img.url.replace('localhost', '192.168.1.230'),
        }));
        setImages(imagesWithFixedUrls);
      }
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  return (
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
      <View style={[styles.header, isDark && styles.headerDark]}>
        <HamburgerMenu />
        <Text style={[styles.headerTitle, isDark && styles.headerTitleDark]}>Museo Digital</Text>
        <ThemeToggle />
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={[styles.heroSection, isDark && styles.heroSectionDark]}>
          {images.length > 0 ? (
            <>
              <View style={styles.carouselContainer}>
                <Image
                  source={{ uri: images[currentIndex].url }}
                  style={styles.heroImage}
                  contentFit="cover"
                  transition={500}
                />
                <View style={[styles.imageOverlay, isDark && styles.imageOverlayDark]} />
                <View style={styles.imageInfo}>
                  <Text style={[styles.imageTitle, isDark && styles.imageTitleDark]}>
                    {images[currentIndex].titulo}
                  </Text>
                  <Text style={[styles.imageAuthor, isDark && styles.imageAuthorDark]}>
                    {images[currentIndex].autor}
                  </Text>
                </View>
              </View>
              <View style={styles.indicators}>
                {images.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.indicator,
                      index === currentIndex && styles.indicatorActive,
                      isDark && styles.indicatorDark,
                      index === currentIndex && isDark && styles.indicatorActiveDark,
                    ]}
                  />
                ))}
              </View>
            </>
          ) : (
            <Image
              source={require('@/assets/images/partial-react-logo.png')}
              style={styles.heroImagePlaceholder}
              contentFit="contain"
            />
          )}
          <Text style={[styles.heroTitle, isDark && styles.heroTitleDark]}>Bienvenido al Museo Digital</Text>
          <Text style={[styles.heroSubtitle, isDark && styles.heroSubtitleDark]}>
            Explora arte y cultura de forma interactiva
          </Text>
        </View>

        <View style={styles.featuresContainer}>
          <TouchableOpacity
            style={[styles.featureCard, isDark && styles.featureCardDark]}
            onPress={() => router.push('/galeria')}
          >
            <Text style={styles.featureIcon}>🖼️</Text>
            <Text style={[styles.featureTitle, isDark && styles.featureTitleDark]}>Explorar Galería</Text>
            <Text style={[styles.featureDescription, isDark && styles.featureDescriptionDark]}>
              Descubre nuestra colección de obras de arte
            </Text>
          </TouchableOpacity>

          {isAuthenticated ? (
            <>
              <TouchableOpacity
                style={[styles.featureCard, isDark && styles.featureCardDark]}
                onPress={() => router.push('/subir')}
              >
                <Text style={styles.featureIcon}>📤</Text>
                <Text style={[styles.featureTitle, isDark && styles.featureTitleDark]}>Subir Obra</Text>
                <Text style={[styles.featureDescription, isDark && styles.featureDescriptionDark]}>
                  Comparte tu arte con la comunidad
                </Text>
              </TouchableOpacity>

              <View style={[styles.welcomeCard, isDark && styles.welcomeCardDark]}>
                <Text style={[styles.welcomeText, isDark && styles.welcomeTextDark]}>
                  ¡Hola, {user?.nombre}!
                </Text>
                <Text style={[styles.welcomeSubtext, isDark && styles.welcomeSubtextDark]}>
                  Gracias por ser parte de nuestra comunidad
                </Text>
              </View>
            </>
          ) : (
            <TouchableOpacity
              style={[styles.featureCard, styles.loginCard, isDark && styles.featureCardDark, isDark && styles.loginCardDark]}
              onPress={() => router.push('/login')}
            >
              <Text style={styles.featureIcon}>🔐</Text>
              <Text style={[styles.featureTitle, isDark && styles.featureTitleDark]}>Iniciar Sesión</Text>
              <Text style={[styles.featureDescription, isDark && styles.featureDescriptionDark]}>
                Accede a funciones exclusivas
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'transparent',
  },
  headerDark: {
    backgroundColor: 'transparent',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '300',
    color: '#1a1a1a',
    letterSpacing: 1,
  },
  headerTitleDark: {
    color: '#e5e5e5',
  },
  headerSpacer: {
    width: 40,
  },
  heroSection: {
    paddingVertical: 60,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  heroSectionDark: {
    backgroundColor: 'transparent',
  },
  carouselContainer: {
    width: width - 64,
    height: 300,
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroImagePlaceholder: {
    width: 100,
    height: 100,
    marginBottom: 32,
    opacity: 0.9,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  imageOverlayDark: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  imageInfo: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
  imageTitle: {
    fontSize: 18,
    fontWeight: '400',
    color: '#ffffff',
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  imageTitleDark: {
    color: '#ffffff',
  },
  imageAuthor: {
    fontSize: 14,
    fontWeight: '300',
    color: '#e5e5e5',
  },
  imageAuthorDark: {
    color: '#cccccc',
  },
  indicators: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#cccccc',
  },
  indicatorDark: {
    backgroundColor: '#444444',
  },
  indicatorActive: {
    backgroundColor: '#1a1a1a',
    width: 24,
  },
  indicatorActiveDark: {
    backgroundColor: '#e5e5e5',
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '200',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  heroTitleDark: {
    color: '#e5e5e5',
  },
  heroSubtitle: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    fontWeight: '300',
  },
  heroSubtitleDark: {
    color: '#999',
  },
  featuresContainer: {
    padding: 24,
    gap: 16,
  },
  featureCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 28,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  featureCardDark: {
    backgroundColor: '#1a1a1a',
    borderColor: '#2a2a2a',
  },
  loginCard: {
    borderColor: '#1a1a1a',
  },
  loginCardDark: {
    borderColor: '#e5e5e5',
  },
  featureIcon: {
    fontSize: 40,
    marginBottom: 16,
    opacity: 0.8,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '400',
    color: '#1a1a1a',
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  featureTitleDark: {
    color: '#e5e5e5',
  },
  featureDescription: {
    fontSize: 14,
    color: '#757575',
    lineHeight: 22,
    fontWeight: '300',
  },
  featureDescriptionDark: {
    color: '#999',
  },
  welcomeCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 24,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  welcomeCardDark: {
    backgroundColor: '#1a1a1a',
    borderColor: '#2a2a2a',
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: '400',
    color: '#1a1a1a',
    marginBottom: 6,
  },
  welcomeTextDark: {
    color: '#e5e5e5',
  },
  welcomeSubtext: {
    fontSize: 13,
    color: '#757575',
    fontWeight: '300',
  },
  welcomeSubtextDark: {
    color: '#999',
  },
});

