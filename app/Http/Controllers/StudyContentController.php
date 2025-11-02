<?php

namespace App\Http\Controllers;

use App\Models\StudyContent;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class StudyContentController extends Controller
{
    public function create()
    {
        return Inertia::render('upload');
    }

    public function store(Request $request)
    {
        // VALIDATION
        $validated = $request->validate([
            'files' => 'required|array',
            'files.*.file' => 'required|file|mimes:pdf,doc,docx,ppt,pptx,jpg,png|max:10240',
            'files.*.title' => 'required|string|max:255',
            'files.*.description' => 'nullable|string|max:500',
            'files.*.tags' => 'nullable|string',
            'files.*.is_public' => 'required|boolean',
        ]);

        $user = Auth::user();

        foreach ($validated['files'] as $index => $data) {
            $uploadedFile = $request->file("files.$index.file");

            if (!$uploadedFile) {
                Log::warning("Missing file for index $index");
                continue;
            }

            $path = $uploadedFile->store('uploads', 'public');

            $content = StudyContent::create([
                'user_id' => $user->id,
                'title' => $data['title'],
                'description' => $data['description'] ?? null,
                'file_path' => $path,
                'file_type' => $uploadedFile->getClientMimeType(),
                'year' => $user->year,
                'section' => $user->section,
                'is_public' => $data['is_public'],
            ]);

            // TAG HANDLING
            if (!empty($data['tags'])) {
                $tags = array_filter(array_map('trim', explode(',', $data['tags'])));
                $tagIds = [];
                foreach ($tags as $tagName) {
                    $tag = Tag::firstOrCreate(['name' => $tagName]);
                    $tagIds[] = $tag->id;
                }
                $content->tags()->sync($tagIds);
            }
        }

        return redirect()->route('dashboard')->with('success', 'Content uploaded successfully!');
    }
}
