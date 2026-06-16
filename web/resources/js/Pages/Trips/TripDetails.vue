<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head, Link } from '@inertiajs/vue3';

/*
    WIRE-UP NOTE:
    Replace placeholder data below with props from TripController@show:
        defineProps({
            trip: Object,
            bookings: Array,
            revenue: Number,
        })
    Controller will pass:
        - trip: Trip model instance
        - bookings: $trip->bookings()->where('payment_status', 'paid')->with('user', 'seat')->get()
        - revenue: $trip->bookings()->where('payment_status', 'paid')->sum('amount_paid')
*/

// Placeholder trip data
const trip = {
    id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    origin: 'Lagos',
    destination: 'Abuja',
    departure_time: '2026-06-18 06:00',
    price: 25000,
    capacity: 18,
    status: 'active',
};

// Placeholder bookings data
const bookings = [
    { id: 1, customer_name: 'Amaka Obi',    phone: '+2348012345678', seat_number: '3',  payment_status: 'paid',    booked_at: '2026-06-15 10:22' },
    { id: 2, customer_name: 'Tunde Bello',  phone: '+2348098765432', seat_number: '7',  payment_status: 'paid',    booked_at: '2026-06-15 11:05' },
    { id: 3, customer_name: 'Ngozi Eze',    phone: '+2348031112233', seat_number: '11', payment_status: 'pending',  booked_at: '2026-06-15 13:48' },
    { id: 4, customer_name: 'Chidi Okeke',  phone: '+2348055556677', seat_number: '15', payment_status: 'expired',  booked_at: '2026-06-15 14:10' },
    { id: 5, customer_name: 'Fatima Musa',  phone: '+2348077778899', seat_number: '2',  payment_status: 'paid',    booked_at: '2026-06-15 15:33' },
];

// Placeholder revenue — sum of amount_paid where payment_status = paid
const revenue = 75000;

const formatPrice = (price) =>
    new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(price);

const statusBadge = (status) => {
    const map = {
        paid:    { bg: 'bg-green-100', text: 'text-green-800', label: 'Paid' },
        pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
        expired: { bg: 'bg-red-100', text: 'text-red-800', label: 'Expired' },
    };
    return map[status] ?? { bg: 'bg-gray-100', text: 'text-gray-600', label: status };
};

const tripStatusBadge = trip.status === 'active'
    ? { bg: 'bg-green-100', text: 'text-green-800', label: 'Active' }
    : { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelled' };
</script>

<template>
    <Head title="Trip Details" />

    <AuthenticatedLayout>
        <template #header>
            <div class="flex items-center justify-between">
                <h2 class="text-xl font-semibold leading-tight text-gray-800">
                    Trip Details
                </h2>
                <Link
                    :href="route('dashboard')"
                    class="text-sm text-gray-500 hover:text-gray-700"
                >
                    ← Back to Dashboard
                </Link>
            </div>
        </template>

        <div class="py-12">
            <div class="mx-auto max-w-5xl sm:px-6 lg:px-8 space-y-6">

                <!-- Trip summary card -->
                <div class="bg-white shadow-sm sm:rounded-lg p-6">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-base font-semibold text-gray-800">
                            {{ trip.origin }} → {{ trip.destination }}
                        </h3>
                        <span
                            class="inline-block px-2 py-0.5 rounded-md text-xs font-medium"
                            :class="[tripStatusBadge.bg, tripStatusBadge.text]"
                        >
                            {{ tripStatusBadge.label }}
                        </span>
                    </div>

                    <!--
                        EXTRACTION NOTE:
                        This stat grid can become a <TripSummaryCard :trip="trip" :revenue="revenue" /> component.
                        Move the <div class="grid ..."> block and formatPrice into that component.
                        Pass trip and revenue as props.
                    -->
                    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                        <div>
                            <p class="text-xs text-gray-500">Trip ID</p>
                            <p class="mt-1 text-sm font-mono text-gray-700 truncate">{{ trip.id.split('-')[0] }}...</p>
                        </div>
                        <div>
                            <p class="text-xs text-gray-500">Departure</p>
                            <p class="mt-1 text-sm font-medium text-gray-800">{{ trip.departure_time }}</p>
                        </div>
                        <div>
                            <p class="text-xs text-gray-500">Price per seat</p>
                            <p class="mt-1 text-sm font-medium text-gray-800">{{ formatPrice(trip.price) }}</p>
                        </div>
                        <div>
                            <p class="text-xs text-gray-500">Capacity</p>
                            <p class="mt-1 text-sm font-medium text-gray-800">{{ trip.capacity }} seats</p>
                        </div>
                        <div>
                            <p class="text-xs text-gray-500">Booked</p>
                            <p class="mt-1 text-sm font-medium text-gray-800">
                                {{ bookings.filter(b => b.payment_status === 'paid').length }} seats
                            </p>
                        </div>
                        <div>
                            <p class="text-xs text-gray-500">Revenue</p>
                            <p class="mt-1 text-sm font-semibold text-indigo-600">{{ formatPrice(revenue) }}</p>
                        </div>
                    </div>
                </div>

                <!-- Bookings table -->
                <div class="bg-white shadow-sm sm:rounded-lg p-6">
                    <h3 class="text-base font-semibold text-gray-800 mb-4">
                        Bookings
                    </h3>

                    <!--
                        EXTRACTION NOTE:
                        This table can become a <BookingsTable :bookings="bookings" /> component.
                        Move the <div class="border ..."> block and statusBadge helper into it.
                        Pass bookings as a required Array prop.
                    -->
                    <div class="border border-gray-200 rounded-lg overflow-x-auto">
                        <table v-if="bookings.length" class="min-w-full text-sm divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-4 py-2 text-left font-medium text-gray-500">#</th>
                                    <th class="px-4 py-2 text-left font-medium text-gray-500">Customer</th>
                                    <th class="px-4 py-2 text-left font-medium text-gray-500">Phone</th>
                                    <th class="px-4 py-2 text-center font-medium text-gray-500">Seat</th>
                                    <th class="px-4 py-2 text-center font-medium text-gray-500">Payment</th>
                                    <th class="px-4 py-2 text-left font-medium text-gray-500">Booked At</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-100">
                                <tr v-for="(booking, index) in bookings" :key="booking.id">
                                    <td class="px-4 py-2 text-gray-400">{{ index + 1 }}</td>
                                    <td class="px-4 py-2 font-medium text-gray-800">{{ booking.customer_name }}</td>
                                    <td class="px-4 py-2 text-gray-500">{{ booking.phone }}</td>
                                    <td class="px-4 py-2 text-center text-gray-800">{{ booking.seat_number }}</td>
                                    <td class="px-4 py-2 text-center">
                                        <span
                                            class="inline-block px-2 py-0.5 rounded-md text-xs font-medium"
                                            :class="[statusBadge(booking.payment_status).bg, statusBadge(booking.payment_status).text]"
                                        >
                                            {{ statusBadge(booking.payment_status).label }}
                                        </span>
                                    </td>
                                    <td class="px-4 py-2 text-gray-500">{{ booking.booked_at }}</td>
                                </tr>
                            </tbody>
                        </table>
                        <div v-else class="p-10 text-center text-sm text-gray-500">
                            No bookings for this trip yet
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </AuthenticatedLayout>
</template>