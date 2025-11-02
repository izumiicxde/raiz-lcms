<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        // USERS TABLE
        Schema::create('users', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('uucms_no')->unique();
            $table->string('password');
            $table->string('course');
            $table->integer('year');
            $table->char('section', 1);
            $table->rememberToken()->nullable();
            $table->timestamps();
        });

        // STUDY CONTENTS TABLE
        Schema::create('study_contents', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained('users')->onDelete('cascade');
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('file_path');
            $table->string('file_type');
            $table->integer('year');
            $table->char('section', 1);
            $table->boolean('is_public')->default(false);
            $table->timestamps();
        });

        // TAGS TABLE
        Schema::create('tags', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name')->unique();
            $table->timestamps();
        });

        // STUDY CONTENT - TAG PIVOT TABLE
        Schema::create('study_content_tag', function (Blueprint $table) {
            $table->foreignUuid('study_content_id')->constrained('study_contents')->onDelete('cascade');
            $table->foreignUuid('tag_id')->constrained('tags')->onDelete('cascade');
            $table->timestamps();
            $table->primary(['study_content_id', 'tag_id']);
        });

        // FOLLOWERS TABLE
        Schema::create('followers', function (Blueprint $table) {
            $table->foreignUuid('follower_id')->constrained('users')->onDelete('cascade');
            $table->foreignUuid('following_id')->constrained('users')->onDelete('cascade');
            $table->timestamps();
            $table->primary(['follower_id', 'following_id']);
        });

        // NOTIFICATIONS TABLE
        Schema::create('notifications', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('sender_id')->constrained('users')->onDelete('cascade');
            $table->foreignUuid('receiver_id')->constrained('users')->onDelete('cascade');
            $table->string('type');
            $table->enum('status', ['unread', 'read'])->default('unread');
            $table->timestamp('read_at')->nullable();
            $table->timestamps();
        });

        // SESSIONS TABLE
        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignUuid('user_id')->nullable()->index()->constrained('users')->onDelete('cascade');
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sessions');
        Schema::dropIfExists('notifications');
        Schema::dropIfExists('followers');
        Schema::dropIfExists('study_content_tag');
        Schema::dropIfExists('tags');
        Schema::dropIfExists('study_contents');
        Schema::dropIfExists('users');
    }
};
