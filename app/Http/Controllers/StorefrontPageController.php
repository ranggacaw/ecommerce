<?php

namespace App\Http\Controllers;

use App\Models\StoreLocation;
use App\Models\StorefrontContent;
use Inertia\Inertia;
use Inertia\Response;

class StorefrontPageController extends Controller
{
    public function about(): Response
    {
        return Inertia::render('Storefront/About', [
            'aboutContent' => StorefrontContent::content(StorefrontContent::ABOUT),
        ]);
    }

    public function location(): Response
    {
        return Inertia::render('Storefront/Location', [
            'stores' => StoreLocation::query()
                ->where('is_active', true)
                ->orderBy('sort_order')
                ->orderBy('name')
                ->get(),
        ]);
    }

    public function contact(): Response
    {
        return Inertia::render('Storefront/ContactUs', [
            'contactContent' => StorefrontContent::content(StorefrontContent::CONTACT),
        ]);
    }

    public function terms(): Response
    {
        return Inertia::render('Storefront/TermsPolicy', [
            'termsContent' => StorefrontContent::content(StorefrontContent::TERMS),
            'privacyContent' => StorefrontContent::content(StorefrontContent::PRIVACY),
        ]);
    }
}
