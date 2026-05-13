<?php
namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ProjectController extends Controller
{
    private function ownerRoot() {
        $u = Auth::user();
        return $u->role === 'owner' ? $u->id : ($u->invited_by ?? $u->id);
    }

    public function index()
    {
        $ownerId = $this->ownerRoot();
        $projects = Project::where('owner_id', $ownerId)
            ->with(['client:id,name','tasks'])
            ->orderBy('created_at','desc')
            ->get()
            ->map(fn($p) => [
                'id'          => $p->id,
                'name'        => $p->name,
                'description' => $p->description,
                'status'      => $p->status,
                'priority'    => $p->priority,
                'progress'    => $p->progress,
                'budget'      => $p->budget,
                'spent'       => $p->spent,
                'start_date'  => $p->start_date?->format('M d, Y'),
                'due_date'    => $p->due_date?->format('M d, Y'),
                'color'       => $p->color,
                'client'      => $p->client?->name,
                'task_count'  => $p->tasks->count(),
                'done_count'  => $p->tasks->where('status','done')->count(),
            ]);

        return Inertia::render('Projects/Index', ['projects' => $projects]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'        => ['required','string','max:255'],
            'description' => ['nullable','string'],
            'status'      => ['nullable','string'],
            'priority'    => ['nullable','string'],
            'start_date'  => ['nullable','date'],
            'due_date'    => ['nullable','date'],
            'budget'      => ['nullable','numeric'],
            'client_id'   => ['nullable','exists:clients,id'],
            'color'       => ['nullable','string','max:20'],
        ]);

        Project::create(array_merge($validated, ['owner_id' => $this->ownerRoot()]));

        return back()->with('success', 'Project created successfully!');
    }

    public function show(int $id)
    {
        $ownerId = $this->ownerRoot();
        $project = Project::where('id',$id)
            ->where('owner_id',$ownerId)
            ->with(['tasks.assignee:id,name','client'])
            ->firstOrFail();

        return Inertia::render('Projects/Show', ['project' => $project, 'projectId' => $id]);
    }

    public function update(Request $request, int $id)
    {
        $project = Project::where('id',$id)->where('owner_id',$this->ownerRoot())->firstOrFail();
        $project->update($request->only(['name','description','status','priority','progress','budget','spent','start_date','due_date','color']));
        return back()->with('success', 'Project updated.');
    }

    public function destroy(int $id)
    {
        Project::where('id',$id)->where('owner_id',$this->ownerRoot())->firstOrFail()->delete();
        return back()->with('success', 'Project deleted.');
    }
}
