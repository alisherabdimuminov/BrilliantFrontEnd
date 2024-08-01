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
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Card>
                        <CardHeader>
                            <CardTitle>Mijozlar</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div class="flex justify-between">
                                <div>{{ customers_count }}</div>
                                <div class="">
                                    <ArrowUpFromDot :size="20" color="#22c55e" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Ishchilar</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div class="flex justify-between">
                                <div>{{ workers_count }}</div>
                                <div class="">
                                    <ArrowUpFromDot :size="20" color="#22c55e" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div> <br>
                <div>
                    <Select v-model="worker" v-on:update:model-value="update_worker">
                        <SelectTrigger>
                            <SelectValue placeholder="Select worker" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem @click="update" v-for="(worker, index) in workers" :key="index" :value="worker.id.toString()">{{ worker.fullname }}</SelectItem>
                        </SelectContent>
                    </Select>
                </div> <br>
                <div class="hidden md:block">
                    <Card>
                        <CardHeader>
                            <CardTitle>Statistics</CardTitle>
                        </CardHeader>
                        <CardContent class="w-full overflow-auto">
                            <ScrollArea>
                                <VisXYContainer :data="statistics">
                                    <VisAxis type="x" />
                                    <VisAxis type="y1" />
                                    <VisAxis type="y2" />
                                    <VisGroupedBar :x="x" :y="y" :color="colors" :barPadding="0.5"/>
                                    <VisTooltip :triggers="triggers"/>
                                </VisXYContainer>
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </div> <br>
                <div>
                    <Card>
                        <CardContent class="w-full overflow-x-auto">
                            <ScrollArea class="w-72 md:w-full">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Time</TableHead>
                                            <TableHead>FullName</TableHead>
                                            <TableHead>Type</TableHead>
                                            <TableHead>Rasm</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <ClientOnly>
                                            <TableBody class="w-64 overflow-auto">
                                                <TableRow v-for="(info, index) in infos" :key="index">
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
                                                        <Dialog>
                                                            <DialogTrigger>
                                                                <img class="w-6 h-6 rounded border-2 border-green-500" :src="config.public.api + info.image" />
                                                            </DialogTrigger>
                                                            <DialogContent>
                                                                <img class="w-full -h-full" :src="config.public.api + info.image">
                                                            </DialogContent>
                                                        </Dialog>
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                    </ClientOnly>
                                </Table>
                                <ScrollBar orientation="horizontal" />
                            </ScrollArea>
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
const workers_count = ref(0);
const customers_count = ref(0);

interface Info {
    id: number,
    uuid?: string,
    date: string,
    type: "worker" | "customer",
    image: string,
    worker?: Worker
}


interface Data {
    x: number
    y1: number
    y2: number
}


const infos = ref<Info[]>();
let statistics = ref<Data[]>([]);

const triggers = {
    [GroupedBar.selectors.barGroup]: (d: Data) => `<span>Mijozlar: ${d.y1}</span><br><span>Ishchilar: ${d.y2}</span><br>`
}

const x = (d: { x: number, y: number }) => d.x;
const y = [
    (d: Data) => d.y1,
    (d: Data) => d.y2,
];

let colors = (d: Data, i: number) => ["#0ea5e9", "#ef4444"][i];



const getData = async () => {
    if (date.value) {
        let response: any = await $fetch(`${config.public.api}api/workers/count/?day=${date.value.day}&month=${date.value.month}&year=${date.value.year}`, {
            method: "GET",
            headers: {
                "Authorization": `Token ${getUser.value?.token}`
            }
        });
        workers_count.value = response.data.count;

        response = await $fetch(`${config.public.api}api/customers/count/?day=${date.value.day}&month=${date.value.month}&year=${date.value.year}`, {
            method: "GET",
            headers: {
                "Authorization": `Token ${getUser.value?.token}`
            }
        });
        customers_count.value = response.data.count;

        response = await $fetch(`${config.public.api}api/faces/?day=${date.value.day}&month=${date.value.month}&year=${date.value.year}${worker.value ? '&worker=' + worker.value : ''}`, {
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

    // statistics
    let response: any = await $fetch(`${config.public.api}api/statistics/workers/`, {
        method: "GET",
        headers: {
            "Authorization": `Token ${getUser.value?.token}`
        }
    });
    statistics.value = response.data.statistics;
    console.log(statistics.value);


    response = await $fetch(`${config.public.api}api/workers/count/`, {
        method: "GET",
        headers: {
            "Authorization": `Token ${getUser.value?.token}`
        }
    });
    workers_count.value = response.data.count;

    response = await $fetch(`${config.public.api}api/customers/count/`, {
        method: "GET",
        headers: {
            "Authorization": `Token ${getUser.value?.token}`
        }
    });
    customers_count.value = response.data.count;
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
    let response: any = await $fetch(`${config.public.api}api/faces/?day=${date.value.day}&month=${date.value.month}&year=${date.value.year}${worker.value ? '&worker='+worker.value.toString() : ''}`, {
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
    // statistics
    response = await $fetch(`${config.public.api}api/statistics/workers/?day=${date.value.day}&month=${date.value.month}&year=${date.value.year}`, {
        method: "GET",
        headers: {
            "Authorization": `Token ${getUser.value?.token}`
        }
    });
    statistics.value = response.data.statistics;
    console.log(statistics.value);

    response = await $fetch(`${config.public.api}api/workers/count/?day=${date.value.day}&month=${date.value.month}&year=${date.value.year}`, {
        method: "GET",
        headers: {
            "Authorization": `Token ${getUser.value?.token}`
        }
    });
    workers_count.value = response.data.count;

    response = await $fetch(`${config.public.api}api/customers/count/?day=${date.value.day}&month=${date.value.month}&year=${date.value.year}`, {
        method: "GET",
        headers: {
            "Authorization": `Token ${getUser.value?.token}`
        }
    });
    customers_count.value = response.data.count;
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
