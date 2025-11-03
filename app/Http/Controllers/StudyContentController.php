<?php

namespace App\Http\Controllers;

use App\Models\StudyContent;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
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
                $rawTags = array_filter(array_map('trim', explode(',', $data['tags'])));
                $tagIds = [];
                foreach ($rawTags as $rawTag) {
                    // Strip leading # for storage
                    $cleanTagName = ltrim($rawTag, '#');
                    if (!empty($cleanTagName)) {
                        $tag = Tag::firstOrCreate(['name' => $cleanTagName]);
                        $tagIds[] = $tag->id;
                    }
                }
                $content->tags()->sync($tagIds);
            }
        }

        return redirect()->route('dashboard')->with('success', 'Content uploaded successfully!');
    }
    public function edit($id)
    {
        $content = StudyContent::with('tags')->findOrFail($id);

        // Optional: Ensure user can only edit their own content
        if ($content->user_id !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }

        return Inertia::render('edit-content', [
            'content' => $content,
        ]);
    }

    public function update(Request $request, $id)
    {
        $content = StudyContent::findOrFail($id);

        if ($content->user_id !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $content->update($validated);

        return redirect()->route('dashboard')->with('success', 'Study material updated successfully.');
    }

    public function destroy($id)
    {
        $content = StudyContent::findOrFail($id);

        // Ensure the user can only delete their own file
        if ($content->user_id !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }

        // Delete the physical file if it exists
        if ($content->file_path && Storage::exists('public/' . $content->file_path)) {
            Storage::delete('public/' . $content->file_path);
        }

        // Remove the record from database
        $content->delete();

        return redirect()->route('dashboard')->with('success', 'Study content deleted successfully.');
    }

    public function index()
    {
        $user = Auth::user();

        // 1. Get IDs of users that the current user follows
        $followingIds = DB::table('followers')
            ->where('follower_id', $user->id)
            ->pluck('following_id');

        // 2. Private content from followed users (excluding own uploads)
        $privateContent = StudyContent::with(['user:id,name,uucms_no,year,course,section'])
            ->where('is_public', false)
            ->whereIn('user_id', $followingIds)
            ->where('user_id', '!=', $user->id)
            ->latest()
            ->get();

        // 3. All public content (excluding own uploads)
        $publicContent = StudyContent::with(['user:id,name,uucms_no,year,course,section'])
            ->where('is_public', true)
            ->where('user_id', '!=', $user->id)
            ->latest()
            ->get();

        // 4. Merge private first, then public
        $contents = $privateContent->concat($publicContent);

        // 5. Return response to Inertia
        return Inertia::render('homepage', [
            'contents' => $contents,
        ]);
    }
}
