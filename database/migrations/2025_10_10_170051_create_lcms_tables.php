<?php 
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        // USERS
        Schema::create('users', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('password');
            $table->string('role_type')->nullable();
            $table->string('usn');
            $table->timestamps();
        });

        // ROLES
        Schema::create('roles', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->text('description')->nullable();
            $table->timestamps();
        });

        // USER_ROLE
        Schema::create('user_role', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id');
            $table->uuid('role_id');
            $table->timestamp('assigned_at')->nullable();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('role_id')->references('id')->on('roles')->onDelete('cascade');
        });

        // COURSES
        Schema::create('courses', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('title');
            $table->text('description')->nullable();
            $table->uuid('instructor_id');
            $table->timestamps();

            $table->foreign('instructor_id')->references('id')->on('users')->onDelete('cascade');
        });

        // CONTENT
        Schema::create('contents', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('course_id');
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('file_path');
            $table->string('type');
            $table->enum('privacy', ['public','private','enlisted'])->default('private');
            $table->string('section')->nullable();
            $table->timestamps();

            $table->foreign('course_id')->references('id')->on('courses')->onDelete('cascade');
        });

        // TAGS
        Schema::create('tags', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->text('description')->nullable();
            $table->timestamps();
        });

        // CONTENT_TAG
        Schema::create('content_tag', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('content_id');
            $table->uuid('tag_id');

            $table->foreign('content_id')->references('id')->on('contents')->onDelete('cascade');
            $table->foreign('tag_id')->references('id')->on('tags')->onDelete('cascade');
        });

        // PERMISSION_REQUESTS
        Schema::create('permission_requests', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id');
            $table->uuid('content_id');
            $table->string('status');
            $table->text('message')->nullable();
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('content_id')->references('id')->on('contents')->onDelete('cascade');
        });

        // FILE_ACCESS
        Schema::create('file_access', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id');
            $table->uuid('content_id');
            $table->timestamp('accessed_at')->nullable();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('content_id')->references('id')->on('contents')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('file_access');
        Schema::dropIfExists('permission_requests');
        Schema::dropIfExists('content_tag');
        Schema::dropIfExists('tags');
        Schema::dropIfExists('contents');
        Schema::dropIfExists('courses');
        Schema::dropIfExists('user_role');
        Schema::dropIfExists('roles');
        Schema::dropIfExists('users');
    }
};
?> 