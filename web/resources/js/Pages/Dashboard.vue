<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink.vue';
import { Head, Link } from '@inertiajs/vue3';
import { ref } from 'vue';
import { formatDate, formatPrice } from '@/utilities/helpers';

const {trips} = defineProps({
    trips: {
        type: Array,
        required: true,
    },
    stats: {
        type: Object,
        required: true,
    },
})

console.table(trips)

const search = ref('');

// Placeholder KPI data — replace with props from controller later
// e.g. defineProps({ stats: Object })
const stats = ref({
    totalTrips: 3,
    totalBooked: 36,
    totalRevenue: 850000,
    fullyBookedCount: 1,
});

const isFullyBooked = (trip) => trip.booked_seats >= trip.capacity;

// Tracks which row's action menu is open — only one open at a time
const openMenuId = ref(null);

const toggleMenu = (tripId) => {
    openMenuId.value = openMenuId.value === tripId ? null : tripId;
};

const closeMenu = () => {
    openMenuId.value = null;
};
</script>

<template>
    <Head title="Dashboard" />

    <AuthenticatedLayout>
        <template #header>
            <h2 class="text-xl font-semibold leading-tight text-gray-800">
                Dashboard
            </h2>
        </template>

        <div class="py-12">
            <!-- Stats -->
            <div class="mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                    <div class="bg-white shadow-sm rounded-lg p-4">
                        <p class="text-xs font-medium text-gray-500">Total Trips</p>
                        <p class="mt-1 text-2xl font-semibold text-gray-800">{{ stats.totalTrips }}</p>
                    </div>
                    <div class="bg-white shadow-sm rounded-lg p-4">
                        <p class="text-xs font-medium text-gray-500">Seats Booked</p>
                        <p class="mt-1 text-2xl font-semibold text-gray-800">{{ stats.totalBooked }}</p>
                    </div>
                    <div class="bg-white shadow-sm rounded-lg p-4">
                        <p class="text-xs font-medium text-gray-500">Total Revenue</p>
                        <p class="mt-1 text-2xl font-semibold text-gray-800">{{ formatPrice(stats.totalRevenue) }}</p>
                    </div>
                    <div class="bg-white shadow-sm rounded-lg p-4">
                        <p class="text-xs font-medium text-gray-500">Fully Booked</p>
                        <p class="mt-1 text-2xl font-semibold text-gray-800">{{ stats.fullyBookedCount }}</p>
                    </div>
                </div>
            </div>

            <!-- Trips Table -->
            <div class="mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div
                    class="overflow-hidden bg-white shadow-sm sm:rounded-lg p-6"
                    @click="closeMenu"
                >

                    <!-- Toolbar -->
                    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                        <input
                            v-model="search"
                            type="search"
                            placeholder="Search trips..."
                            class="w-full sm:max-w-xs rounded-md border-gray-300 shadow-sm text-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                        <ResponsiveNavLink
                            :href="route('trips.create')"
                            class="inline-flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 w-full sm:w-auto"
                        >
                            + Create Trip
                        </ResponsiveNavLink>
                    </div>

                    <!-- Table -->
                    <div class="border border-gray-200 rounded-lg overflow-x-auto min-h-[28rem] sm:min-h-[32rem]">
                        <table v-if="trips.length" class="min-w-full text-sm divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-4 py-2 text-left font-medium text-gray-500">Trip ID</th>
                                    <th class="px-4 py-2 text-left font-medium text-gray-500">Route</th>
                                    <th class="px-4 py-2 text-left font-medium text-gray-500">Departure</th>
                                    <th class="px-4 py-2 text-right font-medium text-gray-500">Price</th>
                                    <th class="px-4 py-2 text-right font-medium text-gray-500">Capacity</th>
                                    <th class="px-4 py-2 text-right font-medium text-gray-500">Booked Seats</th>
                                    <th class="px-4 py-2 text-right font-medium text-gray-500">Available Seats</th>
                                    <th class="px-4 py-2 text-center font-medium text-gray-500">Status</th>
                                    <th class="px-4 py-2 text-center font-medium text-gray-500">Revenue</th>
                                    <!-- Actions column header — intentionally blank -->
                                    <th class="px-4 py-2 w-10"></th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-100">
                                <tr v-for="trip in trips" :key="trip.id">
                                    <td class="px-4 py-2 font-mono text-gray-500">{{ trip.id.split("-")[0] }}...</td>
                                    <td class="px-4 py-2 font-medium text-gray-800">{{ trip.origin }} → {{ trip.destination }}</td>
                                    <td class="px-4 py-2 text-gray-500">{{ formatDate(trip.departure_time) }}</td>
                                    <td class="px-4 py-2 text-right">{{ formatPrice(trip.price) }}</td>
                                    <td class="px-4 py-2 text-right">{{ trip.capacity }}</td>
                                    <td class="px-4 py-2 text-right">{{ trip.booked_seats }}</td>
                                    <td class="px-4 py-2 text-right">{{ trip.capacity - trip.booked_seats }}</td>
                                    
                                    <td class="px-4 py-2 text-center">
                                        <span
                                            class="inline-block px-2 py-0.5 rounded-md text-xs font-medium"
                                            :class="isFullyBooked(trip)
                                                ? 'bg-red-100 text-red-800'
                                                : 'bg-green-100 text-green-800'"
                                        >
                                            {{ isFullyBooked(trip) ? 'Fully Booked' : 'Available' }}
                                        </span>
                                    </td>
                                    <td class="px-4 py-2 text-right">{{ formatPrice(trip.revenue) }}</td>

                                    <!-- Row actions -->
                                    <td class="px-4 py-2 text-center relative">
                                        <button
                                            type="button"
                                            @click.stop="toggleMenu(trip.id)"
                                            class="text-gray-400 hover:text-gray-600 px-1"
                                            aria-label="Row actions"
                                        >
                                            <!-- vertical ellipsis -->
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M10 6a2 2 0 100-4 2 2 0 000 4zM10 12a2 2 0 100-4 2 2 0 000 4zM10 18a2 2 0 100-4 2 2 0 000 4z" />
                                            </svg>
                                        </button>

                                        <!-- Dropdown menu -->
                                        <div
                                            v-if="openMenuId === trip.id"
                                            @click.stop
                                            class="absolute right-4 top-full mt-1 w-36 bg-white border border-gray-200 rounded-md shadow-lg z-10 text-left"
                                        >
                                            <Link
                                                :href="route('trips.show', trip.id)"
                                                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                            >
                                                See more
                                            </Link>

                                            <!--
                                                Edit link is conditional:
                                                - Fully booked trips cannot have capacity/price edited
                                                  (would desync seat count from existing bookings)
                                                - Available trips can be edited freely
                                            -->
                                            <Link
                                                v-if="!isFullyBooked(trip)"
                                                :href="route('trips.edit', trip.id)"
                                                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                            >
                                                Edit
                                            </Link>
                                            <span
                                                v-else
                                                class="block px-4 py-2 text-sm text-gray-400 cursor-not-allowed"
                                                title="Fully booked trips cannot be edited"
                                            >
                                                Edit
                                            </span>

                                            <Link
                                                :href="route('trips.destroy', trip.id)"
                                                method="delete"
                                                as="button"
                                                class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                            >
                                                Delete
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div v-else class="p-10 text-center text-lg font-bold text-gray-500">
                            No bookings right now
                        </div>
                    </div>

                </div>
            </div>
        </div>

    </AuthenticatedLayout>
</template>