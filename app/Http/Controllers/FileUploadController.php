<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class FileUploadController extends Controller
{
public function upload(Request $request)
{
    $request->validate([
        'files' => 'required',
        'files.*' => 'mimes:pdf,doc,docx,mp4,ppt,pptx,jpg,jpeg,png|max:10240',
    ]);

    $paths = [];
    foreach ($request->file('files') as $file) {
        $paths[] = $file->store('uploads', 'public');
    }

    return redirect()->back()->with('success', 'Files uploaded successfully.');
}

}
