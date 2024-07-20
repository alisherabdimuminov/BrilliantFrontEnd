<template>
    <div class="h-screen w-full flex">
        <div class="w-12 md:w-64 px-2">
            <br>
            <p class="md:pl-2 font-bold hidden md:block text-blue-500">Brilliant City</p>
            <p class="font-bold md:hidden text-blue-500 flex justify-center">
                <Bold />
            </p>
            <ul class="md:pl-2 mt-2 grid gap-3">
                <li class="border border-blue-500 bg-blue-500/10 text-blue-500 md:flex md:gap-3 md:items-center md:p-2 p-1 rounded">
                    <NuxtLink to="/" class="md:flex md:gap-3 md:items-center md:p-2 p-1">
                        <Home />
                        <span class="hidden md:block">Bosh sahifa</span>
                    </NuxtLink>
                </li>
                <li class="text-blue-500 md:flex md:gap-3 md:items-center md:p-2 p-1 rounded cursor-pointer hover:border hover:border-blue-500 hover:bg-blue-500/10">
                    <NuxtLink to="/workers" class="md:flex md:gap-3 md:items-center md:p-2 p-1">
                        <Users />
                        <span class="hidden md:block">Ishchilar</span>
                    </NuxtLink>
                </li>
                <li class="text-blue-500 md:flex md:gap-3 md:items-center md:p-2 p-1 rounded cursor-pointer hover:border hover:border-blue-500 hover:bg-blue-500/10">
                    <Cog />
                    <span class="hidden md:block">Sozlamalar</span>
                </li>
                <li class="text-red-500 md:flex md:gap-3 md:items-center md:p-2 p-1 rounded cursor-pointer hover:bg-red-500/10 hover:border hover:border-red-500" @click="logout">
                    <LogOut />
                    <span class="hidden md:block">Chiqish</span>
                </li>
            </ul>
        </div>
        <Separator orientation="vertical" />
        <ScrollArea class="h-full w-full">
            <div class="flex-1 w-full p-5 gap-5">
                <div class="flex items-center justify-between">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                Bosh sahifa
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                Analitika
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                    <div>
                        <Popover>
                            <PopoverTrigger as-child>
                                <Button> {{ date ? date : new Date().toDateString() }}</Button>
                            </PopoverTrigger>
                            <PopoverContent>
                                <Calendar @update:model-value="update" v-model="date"></Calendar>
                            </PopoverContent>
                        </Popover>
                    </div>
                </div> <br>
                <div>
                    <Select v-model="worker" v-on:update:model-value="update_worker">
                        <SelectTrigger>
                            <SelectValue placeholder="Select worker" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem @click="update" v-for="(worker, index) in workers" :key="index" :value="worker.id">{{ worker.fullname }}</SelectItem>
                        </SelectContent>
                    </Select>
                </div> <br>
                <div>
                    <Card>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ID</TableHead>
                                        <TableHead>Time</TableHead>
                                        <TableHead>FullName</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Rasm</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <ClientOnly>
                                    <TableBody class="overflow-auto">
                                        <TableRow v-for="(info, index) in infos" :key="index">
                                            <TableCell class="hidden md:inline-block">{{ index+1 }}</TableCell>
                                            <TableCell>{{ info.date }}</TableCell>
                                            <TableCell>
                                                <p v-if="info.worker">{{ info.worker.fullname }}</p>
                                                <p v-else>-----</p>
                                            </TableCell>
                                            <TableCell>
                                                <p class="bg-green-500 text-white text-sm rounded text-center" v-if="info.type === 'worker'">Kirish</p>
                                                <p class="bg-sky-500 text-white text-sm rounded text-center" v-if="info.type === 'customer'">Mijoz</p>
                                            </TableCell>
                                            <TableCell class="flex items-center justify-center">
                                                <Drawer>
                                                    <DrawerTrigger>
                                                        <img class="w-6 h-6 rounded border-2 border-green-500" :src="config.public.api + info.image" />
                                                    </DrawerTrigger>
                                                    <DrawerContent>
                                                        <DrawerHeader>
                                                            <DrawerTitle>{{ info.date }}</DrawerTitle>
                                                            <DrawerDescription></DrawerDescription>
                                                        </DrawerHeader>
                                                        <!-- <NuxtImg class="h-full rounded" :src="config.public.api + info.image" /> -->
                                                        <img class="h-full rounded" :src="config.public.api + info.image">
                                                    </DrawerContent>
                                                </Drawer>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </ClientOnly>
                            </Table>
                        </CardContent>
                    </Card>
                </div> <br>
            </div>
        </ScrollArea>
    </div>
</template>

<script setup lang="ts">
import { ArrowUpFromDot, ArrowDownToDot, ArrowsUpFromLine, Home, Users, Cog, Bold, LogOut } from "lucide-vue-next";
import { VisXYContainer, VisStackedBar, VisGroupedBar, VisAxis, VisTooltip } from '@unovis/vue'
import { useAuth } from "~/composables/useAuth";
import { GroupedBar, StackedBar } from "@unovis/ts";

const router = useRouter();
const route = useRoute();
const config = useRuntimeConfig();
const { getUser, delUser } = useAuth();

useHead({
    title: "Bosh sahifa"
})


const date = ref(null);
let timer: any = null;


interface Worker {
    id: string,
    uuid: string,
    fullname: string
}

const workers = ref<Worker[]>([]);
const worker = ref();

interface Info {
    id: number,
    uuid?: string,
    date: string,
    type: "worker" | "customer",
    image: string,
    worker?: Worker
}

const infos = ref<Info[]>();


const getData = async () => {
    if (date.value) {
        let response: any = await $fetch(`${config.public.api}api/faces/?day=${date.value.day}&month=${date.value.month}&year=${date.value.year}${worker.value ? '&worker=' + worker.value : ''}`, {
            method: "GET",
            headers: {
                "Authorization": `Token ${getUser.value?.token}`
            }
        });
        infos.value = [];
        console.log(response)
        for (let info in response.data.faces) {
            console.log(response.data.faces[info]);
            infos.value.push({
                id: response.data.faces[info].id,
                uuid: response.data.faces[info].uuid,
                date: response.data.faces[info].created,
                type: response.data.faces[info].type,
                image: response.data.faces[info].image,
                worker: response.data.faces[info].worker
            })
        }

    } else {
        let response: any = await $fetch(`${config.public.api}api/faces/?${worker.value ? 'worker=' + worker.value : ''}`, {
            method: "GET",
            headers: {
                "Authorization": `Token ${getUser.value?.token}`
            }
        });
        console.log(response)
        infos.value = [];
        for (let info in response.data.faces) {
            console.log(response.data.faces[info]);
            infos.value.push({
                id: response.data.faces[info].id,
                uuid: response.data.faces[info].uuid,
                date: response.data.faces[info].created,
                type: response.data.faces[info].type,
                image: response.data.faces[info].image,
                worker: response.data.faces[info].worker
            })
        }
    }
}


onMounted(async () => {
    getData();

    timer = setInterval(() => {
        console.log(date.value)
        console.log(new Date().getDate());
        if (date.value === null || date.value.day === new Date().getDate()) {
            console.log("get data")
            getData();
        }
    }, 10000);

    let response: any = await $fetch(`${config.public.api}api/workers/`, {
        method: "GET",
        headers: {
            "Authorization": `Token ${getUser.value?.token}`
        }
    });
    workers.value = response.data.workers;
});

onBeforeUnmount(() => {
    clearInterval(timer);
})

const update = async (value: any) => {
    date.value = value;
    let response: any = await $fetch(`${config.public.api}api/faces/?day=${date.value.day}&month=${date.value.month}&year=${date.value.year}`, {
        method: "GET",
        headers: {
            "Authorization": `Token ${getUser.value?.token}`
        }
    });
    console.log(response);
    infos.value = [];
    for (let info in response.data.faces) {
        console.log(response.data.faces[info]);
        infos.value.push({
            id: response.data.faces[info].id,
            uuid: response.data.faces[info].uuid,
            date: response.data.faces[info].created,
            type: response.data.faces[info].type,
            image: response.data.faces[info].image,
            worker: response.data.faces[info].worker

        })
    }
}

const update_worker = async () => {
    let response: any = await $fetch(`${config.public.api}api/faces/?worker=${worker.value}`, {
        method: "GET",
        headers: {
            "Authorization": `Token ${getUser.value?.token}`
        }
    });
    console.log(response);
    infos.value = [];
    for (let info in response.data.faces) {
        console.log(response.data.faces[info]);
        infos.value.push({
            id: response.data.faces[info].id,
            uuid: response.data.faces[info].uuid,
            date: response.data.faces[info].created,
            type: response.data.faces[info].type,
            image: response.data.faces[info].image,
            worker: response.data.faces[info].worker

        })
    }
}

const logout = () => {
    delUser();
}
</script>
