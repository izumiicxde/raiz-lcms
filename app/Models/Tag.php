<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Tag extends Model
{
    use HasFactory, Notifiable, HasUuids;
    protected $fillable = ['name'];

    public function studyContents()
    {
        return $this->belongsToMany(StudyContent::class, 'study_content_tag');
    }
}
