<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class StudyContent extends Model
{
    use HasFactory, Notifiable, HasUuids;

    // Allow these fields to be filled via a form
    protected $fillable = [
        'user_id',
        'title',
        'description',
        'file_path',
        'file_type',
        'year',
        'section',
        'is_public',
    ];

    // Define the relationship: a material belongs to a user
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function tags()
    {
        return $this->belongsToMany(Tag::class, 'study_content_tag');
    }
}
