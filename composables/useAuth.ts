export interface User {
    username: string
    first_name: string
    last_name: string
    token: string
}

export function useAuth() {
    const authCookie = useCookie<User | undefined>(
        "user",
        {
            watch: "shallow",
            default: undefined,
            maxAge: 2592000,
        },
    );

    const getUser = computed(() => {
        return authCookie.value;
    });

    const setUser = (user: User) => {
        authCookie.value = user;
    }

    const delUser = () => {
        authCookie.value = undefined;
        window.location.reload();
    }

    return {
        authCookie,
        getUser,
        setUser,
        delUser,
    }
}
