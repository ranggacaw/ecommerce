<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class StorefrontPageController extends Controller
{
    public function about(): Response
    {
        return Inertia::render('Storefront/About');
    }

    public function location(): Response
    {
        return Inertia::render('Storefront/Location', [
            'stores' => [
                [
                    'id' => 1,
                    'name' => 'Grand Indonesia',
                    'address' => 'West Mall, 2nd Floor, Jl. M.H. Thamrin No.1, Jakarta Pusat',
                    'city' => 'Jakarta',
                    'latitude' => -6.1955,
                    'longitude' => 106.8221,
                    'distance' => 2.4,
                    'hours' => '10:00 AM - 10:00 PM',
                    'phone' => '+62 21 2358 0001',
                    'services' => ['Styling', 'Pickup', 'Gifting'],
                ],
                [
                    'id' => 2,
                    'name' => 'Senayan City',
                    'address' => '3rd Floor, Unit 3-05, Jl. Asia Afrika Lot 19, Jakarta Selatan',
                    'city' => 'Jakarta',
                    'latitude' => -6.2267,
                    'longitude' => 106.7999,
                    'distance' => 4.1,
                    'hours' => '10:00 AM - 10:00 PM',
                    'phone' => '+62 21 7278 1000',
                    'services' => ['Styling', 'Pickup'],
                ],
                [
                    'id' => 3,
                    'name' => 'Kota Kasablanka',
                    'address' => 'Ground Floor, No. 88, Jl. Casablanca Raya, Jakarta Selatan',
                    'city' => 'Jakarta',
                    'latitude' => -6.2269,
                    'longitude' => 106.8406,
                    'distance' => 5.8,
                    'hours' => '10:00 AM - 10:00 PM',
                    'phone' => '+62 21 2946 5000',
                    'services' => ['Pickup', 'Gifting'],
                ],
                [
                    'id' => 4,
                    'name' => 'Pondok Indah Mall 2',
                    'address' => 'Level 1, South Skywalk, Jl. Metro Pondok Indah, Jakarta Selatan',
                    'city' => 'Jakarta',
                    'latitude' => -6.1912,
                    'longitude' => 106.7837,
                    'distance' => 8.2,
                    'hours' => '10:00 AM - 10:00 PM',
                    'phone' => '+62 21 7592 0800',
                    'services' => ['Styling', 'Pickup', 'Gifting'],
                ],
                [
                    'id' => 5,
                    'name' => 'Mal Grand Indonesia',
                    'address' => '1st Floor, Jl. M.H. Thamrin No.1, Jakarta Pusat',
                    'city' => 'Jakarta',
                    'latitude' => -6.1953,
                    'longitude' => 106.8220,
                    'distance' => 2.5,
                    'hours' => '10:00 AM - 10:00 PM',
                    'phone' => '+62 21 2358 1000',
                    'services' => ['Pickup'],
                ],
            ],
        ]);
    }

    public function contact(): Response
    {
        return Inertia::render('Storefront/ContactUs');
    }

    public function terms(): Response
    {
        return Inertia::render('Storefront/TermsPolicy');
    }
}
