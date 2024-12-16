/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuraciones adicionales para imágenes
  images: {
    unoptimized: true, // Importante para exportación estática
  },

  // Configuraciones adicionales opcionales
  reactStrictMode: true,

  // Configuración de webpack si es necesario
  webpack: (config) => {
    // Puedes agregar configuraciones personalizadas de webpack si las necesitas
    return config;
  },
};

export default nextConfig;
