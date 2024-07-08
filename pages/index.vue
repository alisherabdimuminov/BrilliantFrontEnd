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
                    <Home />
                    <span class="hidden md:block">Bosh sahifa</span>
                </li>
                <li class="text-blue-500 md:flex md:gap-3 md:items-center md:p-2 p-1 rounded cursor-pointer hover:border hover:border-blue-500 hover:bg-blue-500/10">
                    <Users />
                    <span class="hidden md:block">Ishchilar</span>
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
                <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Card>
                        <CardHeader>
                            <CardTitle>Kirish</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div class="flex justify-between">
                                <div>{{ count_inputs }}</div>
                                <div class="">
                                    <ArrowUpFromDot :size="20" color="#22c55e" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Chiqish</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div class="flex justify-between">
                                <div>{{ count_outputs }}</div>
                                <div class="">
                                    <ArrowUpFromDot :size="20" color="#22c55e" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Guruh</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div class="flex justify-between">
                                <div>{{ count_group_inputs }}</div>
                                <div class="">
                                    <ArrowDownToDot :size="20" color="#ef4444" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div> <br>
                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Statistics</CardTitle>
                        </CardHeader>
                        <CardContent class="w-full overflow-auto">
                            <ScrollArea>
                                <VisXYContainer :data="data">
                                    <VisStackedBar :x="x" :y="y" />
                                    <VisAxis type="x" />
                                    <VisAxis type="y" />
                                </VisXYContainer>
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </div> <br>
                <div>
                    <Card>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ID</TableHead>
                                        <TableHead>Kamera</TableHead>
                                        <TableHead>Vaqt</TableHead>
                                        <TableHead>Holat</TableHead>
                                        <TableHead>Rasm</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow v-for="(info, index) in infos" :key="index">
                                        <TableCell>{{ info.id }}</TableCell>
                                        <TableCell>{{ info.camera }}</TableCell>
                                        <TableCell>{{ info.date }}</TableCell>
                                        <TableCell>
                                            <p class="bg-green-500 text-white text-sm rounded text-center" v-if="info.type === 'input'">Kirish</p>
                                            <p class="bg-red-500 text-white text-sm rounded text-center" v-if="info.type === 'output'">Chiqish</p>
                                            <p class="bg-blue-500 text-white text-sm rounded text-center" v-if="info.type === 'group_input'">Guruh {{ info.count }}</p>
                                        </TableCell>
                                        <TableCell class="flex items-center justify-center">
                                            <Drawer>
                                                <DrawerTrigger>
                                                    <NuxtImg class="w-6 h-6 rounded border-2 border-green-500" :src="config.public.api + info.image" />
                                                </DrawerTrigger>
                                                <DrawerContent>
                                                    <DrawerHeader>
                                                        <DrawerTitle>{{ info.date }}</DrawerTitle>
                                                        <DrawerDescription></DrawerDescription>
                                                    </DrawerHeader>
                                                    <NuxtImg class="h-96 rounded" :src="config.public.api + info.image" />
                                                </DrawerContent>
                                            </Drawer>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div> <br>
            </div>
        </ScrollArea>
    </div>
</template>

<script setup lang="ts">
import { ArrowUpFromDot, ArrowDownToDot, Home, Users, Cog, Bold, LogOut } from "lucide-vue-next";
import { VisXYContainer, VisStackedBar, VisAxis } from '@unovis/vue'
import { useAuth } from "~/composables/useAuth";

const router = useRouter();
const route = useRoute();
const config = useRuntimeConfig();
const { getUser, delUser } = useAuth();

useHead({
    title: "Bosh sahifa"
})


const data = ref([
    {
        x: 1,
        y: 2
    },
    {
        x: 2,
        y: 5
    },
    {
        x: 3,
        y: 2
    },
    {
        x: 4,
        y: 10
    },
    {
        x: 5,
        y: 2
    },
    {
        x: 6,
        y: 15
    },
    {
        x: 7,
        y: 20
    },
    {
        x: 8,
        y: 1
    },
])

const date = ref(null);
let timer: any = null;


const x = (d: { x: number, y: number }) => d.x
const y = (d: { x: number, y: number }) => d.y


interface Info {
    id: number,
    camera: number | string,
    date: string,
    count: number,
    type: "input" | "output" | "group_input",
    image: string,
}

let infos = ref<Info[]>([]);
let count_inputs = ref(0);
let count_outputs = ref(0);
let count_group_inputs = ref(0);


const getData = async () => {
    if (date.value) {
        let response: any = await $fetch(`${config.public.api}api/all/?day=${date.value.day}&month=${date.value.month}&year=${date.value.year}`, {
            method: "GET",
            headers: {
                "Authorization": `Token ${getUser.value?.token}`
            }
        });
        infos.value = [];
        for (let info in response.data.all) {
            console.log(response.data.all[info]);
            infos.value.push({
                id: parseInt(info) + 1,
                camera: response.data.all[info].camera_id,
                date: response.data.all[info].created,
                count: response.data.all[info].number_of_people,
                type: response.data.all[info].type,
                image: response.data.all[info].image,
            })
        }

        // count inputs
        response = await $fetch(`${config.public.api}api/inputs/count/?day=${date.value.day}&month=${date.value.month}&year=${date.value.year}`, {
            method: "GET",
            headers: {
                "Authorization": `Token ${getUser.value?.token}`
            }
        });
        count_inputs.value = response.data.count;

        // count outputs
        response = await $fetch(`${config.public.api}api/outputs/count/?day=${date.value.day}&month=${date.value.month}&year=${date.value.year}`, {
            method: "GET",
            headers: {
                "Authorization": `Token ${getUser.value?.token}`
            }
        });
        count_outputs.value = response.data.count;

        // count group inputs
        response = await $fetch(`${config.public.api}api/group_inputs/count/?day=${date.value.day}&month=${date.value.month}&year=${date.value.year}`, {
            method: "GET",
            headers: {
                "Authorization": `Token ${getUser.value?.token}`
            }
        });
        count_group_inputs.value = response.data.count;
    } else {
        let response: any = await $fetch(`${config.public.api}api/all/`, {
            method: "GET",
            headers: {
                "Authorization": `Token ${getUser.value?.token}`
            }
        });
        infos.value = [];
        for (let info in response.data.all) {
            console.log(response.data.all[info]);
            infos.value.push({
                id: parseInt(info) + 1,
                camera: response.data.all[info].camera_id,
                date: response.data.all[info].created,
                count: response.data.all[info].number_of_people,
                type: response.data.all[info].type,
                image: response.data.all[info].image,
            })
        }

        // count inputs
        response = await $fetch(`${config.public.api}api/inputs/count/`, {
            method: "GET",
            headers: {
                "Authorization": `Token ${getUser.value?.token}`
            }
        });
        count_inputs.value = response.data.count;

        // count outputs
        response = await $fetch(`${config.public.api}api/outputs/count/`, {
            method: "GET",
            headers: {
                "Authorization": `Token ${getUser.value?.token}`
            }
        });
        count_outputs.value = response.data.count;

        // count group inputs
        response = await $fetch(`${config.public.api}api/group_inputs/count/`, {
            method: "GET",
            headers: {
                "Authorization": `Token ${getUser.value?.token}`
            }
        });
        count_group_inputs.value = response.data.count;
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
    }, 5000);
});

onBeforeUnmount(() => {
    clearInterval(timer);
})

const update = async (value: any) => {
    date.value = value;
    let response: any = await $fetch(`${config.public.api}api/all/?day=${date.value.day}&month=${date.value.month}&year=${date.value.year}`, {
        method: "GET",
        headers: {
            "Authorization": `Token ${getUser.value?.token}`
        }
    });
    console.log(response);
    infos.value = [];
    for (let info in response.data.all) {
        console.log(response.data.all[info]);
        infos.value.push({
            id: parseInt(info) + 1,
            camera: response.data.all[info].camera_id,
            date: response.data.all[info].created,
            count: response.data.all[info].number_of_people,
            type: response.data.all[info].type,
            image: response.data.all[info].image,
        })
    }

    // count inputs
    response = await $fetch(`${config.public.api}api/inputs/count/?day=${date.value.day}&month=${date.value.month}&year=${date.value.year}`, {
        method: "GET",
        headers: {
            "Authorization": `Token ${getUser.value?.token}`
        }
    });
    count_inputs.value = response.data.count;

    // count outputs
    response = await $fetch(`${config.public.api}api/outputs/count/?day=${date.value.day}&month=${date.value.month}&year=${date.value.year}`, {
        method: "GET",
        headers: {
            "Authorization": `Token ${getUser.value?.token}`
        }
    });
    count_outputs.value = response.data.count;

    // count group inputs
    response = await $fetch(`${config.public.api}api/group_inputs/count/?day=${date.value.day}&month=${date.value.month}&year=${date.value.year}`, {
        method: "GET",
        headers: {
            "Authorization": `Token ${getUser.value?.token}`
        }
    });
    count_group_inputs.value = response.data.count;
}

const logout = () => {
    delUser();
}
</script>
