<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class TripCreationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'origin' => ['required', 'string', 'max:255', 'lowercase'],
            'destination' => ['required', 'string', 'max:255', 'lowercase'],
            'departure_date' => ['required', 'date'],
            'departure_time' => ['required', 'date_format:H:i'],
            'capacity' => ['required', 'integer', 'min:1'],
            'price' => ['required', 'numeric', 'min:0'],
        ];
    }
}
