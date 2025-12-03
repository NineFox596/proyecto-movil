# pasos para la instalacion coreccta del proyecto  
-npx rn-new proyecto-movil --nativewind --yarn  
-cd proyecto-movil  
yarn  
yarn add dotenv  
yarn add axios  
yarn add react-native-safe-area-context  

# importante en cada archivo dentro de /src # tener esto   
import Constants from "expo-constants";  
// Obtener la URL del .env (inyectada por app.config.js)  
const API_URL = Constants.expoConfig?.extra?.API_URL as string;
# obligatorio en todos los archivos dentro de src


