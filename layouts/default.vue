<template>
    <div>
        <slot />
    </div>
</template>

<script setup lang="ts">
import { useAuth } from "~/composables/useAuth";

const router = useRouter();
const route = useRoute();
const config = useRuntimeConfig();
const { getUser, delUser } = useAuth();

if (getUser.value === undefined) {
    router.push("/login");
}
</script>
