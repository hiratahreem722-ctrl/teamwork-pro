<?php
namespace App\Http\Controllers;

use App\Models\Workspace;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class WorkspaceController extends Controller
{
    public function store(Request $request)
    {
        $owner = Auth::user();
        $data = $request->validate([
            'name'        => ['required','string','max:200'],
            'industry'    => ['nullable','string','max:100'],
            'size'        => ['nullable','string','max:50'],
            'website'     => ['nullable','string','max:255'],
            'work_style'  => ['nullable','string','max:50'],
            'departments' => ['nullable','array'],
            'goals'       => ['nullable','array'],
            'timezone'    => ['nullable','string','max:100'],
            'pm_view'     => ['nullable','string','max:50'],
            'currency'    => ['nullable','string','max:10'],
            'brand_color' => ['nullable','string','max:20'],
        ]);

        Workspace::updateOrCreate(
            ['owner_id' => $owner->id],
            array_merge($data, ['owner_id' => $owner->id])
        );

        return redirect()->route('dashboard')->with('success', 'Workspace set up successfully!');
    }

    public function show()
    {
        $workspace = Workspace::where('owner_id', Auth::id())->first();
        return response()->json($workspace);
    }
}
