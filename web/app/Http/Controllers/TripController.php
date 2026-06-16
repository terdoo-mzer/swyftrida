<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
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
        return "Trip stored successfully.";
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
