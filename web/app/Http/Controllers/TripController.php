<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Trip;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class TripController extends Controller
{
    /**
     * Display a listing of all trips.
     */
    public function index()
    {
        return "All trips are displayed here.";
    }

    /**
     * Create a new trip.
     */
    public function create()
    {
        return Inertia::render('Trips/CreateTrip');
    }

    /**
     * Store a new trip.
     */
    public function store(Request $request)
    {

        // Retrive the trips data sent in as an array of trips
        $validatedTripData = $request->validate(
            [

                'trips' => ['required', 'array'],
                'trips.*.origin' => ['required', 'string', 'max:255', 'lowercase'],
                'trips.*.destination' => ['required', 'string', 'max:255', 'lowercase'],
                'trips.*.departure_date' => ['required', 'date'],
                'trips.*.departure_time' => ['required', 'date_format:H:i'],
                'trips.*.capacity' => ['required', 'integer', 'min:1'],
                'trips.*.price' => ['required', 'numeric', 'min:0'],
            ],
            [
                'trips.*.origin.required' => 'Please provide an origin for trip number :position.',
                'trips.*.destination.required' => 'Please provide a destination for trip number :position.',
                'trips.*.departure_date.required' => 'Please provide a departure date for trip number :position.',
                'trips.*.departure_time.required' => 'Please provide a departure time for trip number :position.',
                'trips.*.capacity.required' => 'Please provide a capacity for trip number :position.',
                'trips.*.capacity.integer' => 'Please enter a number for the capacity for trip number :position.',
                'trips.*.price.required' => 'Please provide a price for trip number :position.',
                'trips.*.price.numeric' => 'Please enter a valid price for trip number :position.',
                'trips.*.price.min' => 'Price for trip number :position. cannot be blank or less than 0',
            ]
        );

        // Prevent deuplicate trips with same route and departure date & time
        // Compare incoming multiple trips from the user, and check if there are any with the same route and departure date & time
        if ($validatedTripData['trips'] && count($validatedTripData['trips']) > 1) {
            $duplicateTripEntries = [];
            foreach ($validatedTripData['trips'] as $trip) {
                // Compose a unique trip key/entry
                $tripKey = $trip['destination'] . '-' . $trip['departure_date'] . '-' . $trip['departure_time'];
                if (isset($duplicateTripEntries[$tripKey])) {
                    //dd($duplicateTripEntries);
                    throw ValidationException::withMessages([
                        'duplicateFormTripError' => 'Duplicate trips with the same destination and departure date & time are not allowed.',
                    ]);
                }
                $duplicateTripEntries[$tripKey] = true;
            }

            // There will be no duplicates on the form at this point, so check the database for 
            // duplicates at this point. You are reqired to loop the data array to perform this
            $duplicateTripEntryErrors = [];
            //$formattedDepartureTimeDate = \Carbon\Carbon::parse($trip['departure_date'] . ' ' . $trip['departure_time']);
            foreach($validatedTripData['trips'] as $tripIndex => $value) {
                $formattedDepartureTimeDate = \Carbon\Carbon::parse($value['departure_date'] . ' ' . $value['departure_time']);
                if(
                    DB::table('trips')
                    ->where('destination', $value['destination'])
                    ->where('departure_time', $formattedDepartureTimeDate)
                    ->exists()
                ){
                    $duplicateTripEntryErrors["trips.$tripIndex"] = "A trip already exists with the same destination and departure time.";
                }
                 if (!empty($duplicateTripEntryErrors)) {
                    //dd($duplicateTripEntryErrors);
                    throw ValidationException::withMessages($duplicateTripEntryErrors);
                }
            }

            // Insert the data right here
            foreach ($validatedTripData['trips'] as $trip) {
                DB::table('trips')->insert([
                    'origin' => $trip['origin'],
                    'destination' => $trip['destination'],
                    'departure_time' => \Carbon\Carbon::parse($trip['departure_date'] . ' ' . $trip['departure_time']),
                    'capacity' => $trip['capacity'],
                    'price' => $trip['price'],
                    'status' => 'active',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            // After successful insertion, return a success message or redirect as needed
            return redirect()->route('dashboard')->with('success', 'Trips created successfully!');
        } else {
            // Chek if the single trip already exists in the database
            $trip = $validatedTripData['trips'][0];
            $formattedDepartureTimeDate = \Carbon\Carbon::parse($trip['departure_date'] . ' ' . $trip['departure_time']);
            if (
                DB::table('trips')
                ->where('destination', $trip['destination'])
                ->where('departure_time', $formattedDepartureTimeDate)
                ->exists()
            ) {
                //dd('A trip already exists on this route and departure.');
                throw ValidationException::withMessages([
                    'trips.0' => 'This trip already exists. Please change the destination and departure time.',
                ]); 
                
            }

            Trip::create([
                'origin' => $trip['origin'],
                'destination' => $trip['destination'],
                'departure_time' => \Carbon\Carbon::parse($trip['departure_date'] . ' ' . $trip['departure_time']),
                'capacity' => $trip['capacity'],
                'price' => $trip['price'],
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            return redirect()->route('dashboard')->with('success', 'Trip(s) created successfully!');
            
        }
    }

    /**
     * Display a specific trip.
     */
    public function show(string $id)
    {
        return Inertia::render('Trips/TripDetails', ['tripId' => $id]);
    }

    /**
     * Show the form for editing a specific trip.
     */
    public function edit(string $id)
    {
        return "Form for editing trip with ID: $id";
    }

    /**
     * Update a specific trip.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove a specific trip from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
