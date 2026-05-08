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
        return Inertia::render('Storefront/Location');
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
