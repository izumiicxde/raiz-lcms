<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class FileUploadController extends Controller
{
    public function upload(Request $request){
        $request->validate([
            'file' => 'required|mimes:pdf,doc,docx,mp4,ppt,pptx,jpg,jpeg,png|max:10240', // 10MB max
        ]);
        $path = $request->file('file')->store('uploads', 'public');

        return redirect()->back()->with('success', 'File uploaded successfully.');
    }
}
