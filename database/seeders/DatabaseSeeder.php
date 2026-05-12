<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $users = [
            [
                'name'              => 'Super Admin',
                'email'             => 'superadmin@teamworkpro.com',
                'password'          => Hash::make('password'),
                'role'              => 'super_admin',
                'email_verified_at' => now(),
            ],
            [
                'name'              => 'John Owner',
                'email'             => 'owner@teamworkpro.com',
                'password'          => Hash::make('password'),
                'role'              => 'owner',
                'email_verified_at' => now(),
            ],
            [
                'name'              => 'Sara Manager',
                'email'             => 'manager@teamworkpro.com',
                'password'          => Hash::make('password'),
                'role'              => 'manager',
                'email_verified_at' => now(),
            ],
            [
                'name'              => 'Sara Employee',
                'email'             => 'employee@teamworkpro.com',
                'password'          => Hash::make('password'),
                'role'              => 'employee',
                'email_verified_at' => now(),
            ],
            [
                'name'              => 'Acme Client',
                'email'             => 'client@teamworkpro.com',
                'password'          => Hash::make('password'),
                'role'              => 'client',
                'email_verified_at' => now(),
            ],
        ];

        foreach ($users as $user) {
            User::updateOrCreate(['email' => $user['email']], $user);
        }
    }
}
