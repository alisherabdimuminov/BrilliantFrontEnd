<template>
    <div class="flex flex-row min-h-screen justify-center items-center mx-4 md:mx-20 lg:mx-40">
        <div class="w-full md:w-1/2 h-full">
            <Card>
                <CardHeader>
                    <CardTitle>Brilliant City Monitoring</CardTitle>
                </CardHeader>
                <CardContent>
                    <form @submit.prevent>
                        <Label>Foydalanuvchi nomi <span class="text-red-500" v-if="error.username">(Foydalanuvchi topilmadi)</span></Label>
                        <Input :disabled="loading" v-model="user.username" autocomplete="username" />
                        <Label>Maxfiy so'z <span class="text-red-500" v-if="error.password">(Maxfiy so'z xato)</span></Label>
                        <Input :disabled="loading" v-model="user.password" type="password" autocomplete="current-password" />
                        <div class="mt-2">
                            <Button :disabled="loading" @click="login" class="w-full">Kirish</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useAuth } from "~/composables/useAuth";

useHead({
    title: "Kirish"
})

const router = useRouter();
const route = useRoute();
const config = useRuntimeConfig();
const { getUser, setUser } = useAuth();

interface Props {
    username: string
    password: string
}

const user = reactive<Props>({
    username: "",
    password: ""
});
const loading = ref(false);
const error = ref({
    username: null,
    password: null
});

if (getUser.value !== undefined) {
    router.push("/");
}

const login = async () => {
    loading.value = true;
    const response: any = await $fetch(`${config.public.api}auth/login/`, {
        method: "POST",
        body: JSON.stringify({
            "username": user.username,
            "password": user.password,
        })
    });
    loading.value = false;
    if (response.status === "success") {
        setUser(response.data);
        router.push("/");
    } else {
        error.value = response.errors;
    }
}

</script>
