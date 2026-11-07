<?php

namespace App\Actions\Fortify;

use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules, ProfileValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        Validator::make($input, [
            ...$this->profileRules(),
            'password' => $this->passwordRules(),
            'career_id' => ['required', 'exists:careers,id'],
            'terms' => ['required', 'accepted'],
            'privacy' => ['required', 'accepted'],
        ])->validate();

        $user = User::create([
            'name' => $input['name'],
            'email' => $input['email'],
            'career_id' => $input['career_id'],
            'password' => $input['password'],
            'accepted_terms_at' => now(),
            'accepted_privacy_at' => now(),
        ]);

        // asignar rol por defecto
        $user->assignRole('Cientifico');

        return $user;
    }
}
