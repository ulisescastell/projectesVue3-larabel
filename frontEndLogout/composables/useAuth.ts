import axios from "axios";

interface LoginPayLoad {
    email: string,
    password: string
}

interface RegisterPayload {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}

interface User {
    created_at: Date,
    updated_at: Date,
    email_verified_at: Date;
    two_factor_confirmed_at: Date;
}

const user = ref<User | null>(null)

export const useAuth=()=> {
    //desar l'usuari connectat
    async function login(payload: LoginPayLoad) {
        await axios.post("/login", payload)
        useRouter().push("/me")
    }
    async function register(payload: RegisterPayload) {
        await axios.post("/register", payload)
        useRouter().push("/me")
    }
    async function logout() {
        await axios.post("/logout");
        user.value = null
        useRouter().replace("/login");
    }
    async function getUser(): Promise<User | null> {
        try {
            const res = await axios.get("/user");
            const user = res.data;
            return {
                ...user,
                created_at: new Date(user.created_at),
                updated_at: new Date(user.updated_at),
                email_verified_at: user.email_verified_at
                    ? new Date(user.email_verified_at)
                    : null,
                two_factor_confirmed_at: user.two_factor_confirmed_at
                    ? new Date(user.two_factor_confirmed_at)
                    : null,
            };
        } catch (err) {
            return null;
        }
    }
    async function initUser() {
        user.value = await getUser()
    }
    return {
        login,
        register,
        logout,
        initUser,
        user
    }
}