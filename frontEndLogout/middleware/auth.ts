import { useAuth } from "~/composables/useAuth";

export default defineNuxtRouteMiddleware(async (to, from) => {
    const { initUser, user } = useAuth();
    
    await initUser(); // Inicialitzem l'usuari
    
    if (!user.value) {
        return navigateTo("/login");
    }
});