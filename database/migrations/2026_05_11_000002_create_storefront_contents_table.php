<?php

use App\Models\StorefrontContent;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('storefront_contents', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->json('content');
            $table->timestamps();
        });

        foreach (StorefrontContent::defaults() as $key => $content) {
            DB::table('storefront_contents')->insert([
                'key' => $key,
                'content' => json_encode($content, JSON_THROW_ON_ERROR),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('storefront_contents');
    }
};
