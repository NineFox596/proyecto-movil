# Pasos para la instalacion correcta del proyecto

-npx rn-new proyecto-movil --nativewind --yarn  
-cd proyecto-movil  
yarn

# Importante, en cada archivo dentro de /src tener esto

import Constants from "expo-constants";  
// Obtener la URL del .env (inyectada por app.config.js)  
const API_URL = Constants.expoConfig?.extra?.API_URL as string;

# Obligatorio en todos los archivos dentro de src
