<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head, Link } from '@inertiajs/vue3';
import { ref } from 'vue';

// One "trip" section's default shape — duplicated each time "Add trip" is clicked
const blankTrip = () => ({
    origin: '',
    destination: '',
    departure_date: '',
    departure_time: '',
    capacity: '',
    price: '',
});

// Starts with one trip section. "Add trip" pushes another blank one.
// You'll wire up form submission yourself — this just manages the array.
const trips = ref([blankTrip()]);

const addTrip = () => {
    trips.value.push(blankTrip());
};

const removeTrip = (index) => {
    trips.value.splice(index, 1);
};
</script>

<template>
    <Head title="Create Trip" />

    <AuthenticatedLayout>
        <template #header>
            <h2 class="text-xl font-semibold leading-tight text-gray-800">
                Create Trip
            </h2>
        </template>

        <div class="py-12">
            <div class="mx-auto max-w-4xl sm:px-6 lg:px-8">
                <div class="overflow-hidden bg-white shadow-sm sm:rounded-lg p-6">

                    <form>
                        <!--
                            EXTRACTION NOTE:
                            Each iteration of this v-for can later become its own
                            <TripFormSection /> component if the form grows complex.
                              1. Create resources/js/Components/TripFormSection.vue
                              2. Move the inner <div class="border ..."> block into its <template>
                              3. Use v-model with defineModel() or emit/update events for the trip object
                              4. Replace the block here with:
                                     <TripFormSection v-for="(trip, index) in trips" ... />
                        -->
                        <div
                            v-for="(trip, index) in trips"
                            :key="index"
                            class="border border-gray-200 rounded-lg p-4 mb-4"
                        >
                            <div class="flex items-center justify-between mb-4">
                                <h3 class="text-sm font-semibold text-gray-700">
                                    Trip {{ index + 1 }}
                                </h3>
                                <button
                                    v-if="trips.length > 1"
                                    type="button"
                                    @click="removeTrip(index)"
                                    class="text-sm text-red-600 hover:text-red-800"
                                >
                                    Remove
                                </button>
                            </div>

                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <!-- Origin -->
                                <div>
                                    <label :for="`origin-${index}`" class="block text-sm font-medium text-gray-700">
                                        Origin
                                    </label>
                                    <select
                                        :id="`origin-${index}`"
                                        v-model="trip.origin"
                                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    >
                                        <option value="" disabled>Select origin</option>
                                        <option value="lagos">Lagos</option>
                                        <option value="abuja">Abuja</option>
                                    </select>
                                </div>

                                <!-- Destination -->
                                <div>
                                    <label :for="`destination-${index}`" class="block text-sm font-medium text-gray-700">
                                        Destination
                                    </label>
                                    <select
                                        :id="`destination-${index}`"
                                        v-model="trip.destination"
                                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    >
                                        <option value="" disabled>Select destination</option>
                                        <option value="lagos">Lagos</option>
                                        <option value="abuja">Abuja</option>
                                    </select>
                                </div>

                                <!-- Departure Date -->
                                <div>
                                    <label :for="`departure_date-${index}`" class="block text-sm font-medium text-gray-700">
                                        Departure Date
                                    </label>
                                    <input
                                        :id="`departure_date-${index}`"
                                        v-model="trip.departure_date"
                                        type="date"
                                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                </div>

                                <!-- Departure Time -->
                                <div>
                                    <label :for="`departure_time-${index}`" class="block text-sm font-medium text-gray-700">
                                        Departure Time
                                    </label>
                                    <input
                                        :id="`departure_time-${index}`"
                                        v-model="trip.departure_time"
                                        type="time"
                                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                </div>

                                <!-- Capacity -->
                                <div>
                                    <label :for="`capacity-${index}`" class="block text-sm font-medium text-gray-700">
                                        Capacity
                                    </label>
                                    <input
                                        :id="`capacity-${index}`"
                                        v-model="trip.capacity"
                                        type="number"
                                        min="1"
                                        placeholder="e.g. 18"
                                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                </div>

                                <!-- Price -->
                                <div>
                                    <label :for="`price-${index}`" class="block text-sm font-medium text-gray-700">
                                        Price (₦)
                                    </label>
                                    <input
                                        :id="`price-${index}`"
                                        v-model="trip.price"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        placeholder="e.g. 25000"
                                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                </div>
                            </div>
                        </div>

                        <!-- Add trip + actions -->
                        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-6">
                            <button
                                type="button"
                                @click="addTrip"
                                class="inline-flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 w-full sm:w-auto"
                            >
                                + Add Trip
                            </button>

                            <div class="flex gap-3 w-full sm:w-auto">
                                <Link
                                    :href="route('dashboard')"
                                    class="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 w-full sm:w-auto"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    class="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 w-full sm:w-auto"
                                >
                                    Save {{ trips.length > 1 ? 'Trips' : 'Trip' }}
                                </button>
                            </div>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    </AuthenticatedLayout>
</template>