<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('inventory_adjustments', function (Blueprint $table) {
            $table->string('status', 20)->default('active')->after('notes');
            $table->foreignId('replaces_adjustment_id')->nullable()->after('status')->constrained('inventory_adjustments')->nullOnDelete();
            $table->foreignId('voided_by')->nullable()->after('replaces_adjustment_id')->constrained('users')->nullOnDelete();
            $table->timestamp('voided_at')->nullable()->after('voided_by');
            $table->text('void_reason')->nullable()->after('voided_at');
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->foreignId('archived_by')->nullable()->after('inventory_committed_at')->constrained('users')->nullOnDelete();
            $table->timestamp('archived_at')->nullable()->after('archived_by');
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropConstrainedForeignId('archived_by');
            $table->dropColumn('archived_at');
        });

        Schema::table('inventory_adjustments', function (Blueprint $table) {
            $table->dropConstrainedForeignId('replaces_adjustment_id');
            $table->dropConstrainedForeignId('voided_by');
            $table->dropColumn(['status', 'voided_at', 'void_reason']);
        });
    }
};
