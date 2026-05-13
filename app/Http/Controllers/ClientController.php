<?php
namespace App\Http\Controllers;

use App\Models\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ClientController extends Controller
{
    private function ownerId() {
        $u = Auth::user();
        return $u->role === 'owner' ? $u->id : ($u->invited_by ?? $u->id);
    }

    public function index()
    {
        $clients = Client::where('owner_id', $this->ownerId())
            ->withCount('projects')
            ->withCount('invoices')
            ->orderBy('created_at','desc')
            ->get();
        return Inertia::render('Clients/Index', ['clients' => $clients]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'     => ['required','string','max:200'],
            'email'    => ['nullable','email','max:255'],
            'company'  => ['nullable','string','max:200'],
            'phone'    => ['nullable','string','max:30'],
            'website'  => ['nullable','string','max:255'],
            'industry' => ['nullable','string','max:100'],
            'notes'    => ['nullable','string'],
        ]);
        Client::create(array_merge($validated, ['owner_id' => $this->ownerId()]));
        return back()->with('success', 'Client added successfully!');
    }

    public function show(int $id)
    {
        $client = Client::where('id',$id)->where('owner_id',$this->ownerId())
            ->with(['projects','invoices'])->firstOrFail();
        return Inertia::render('Clients/Show', ['client' => $client, 'clientId' => $id]);
    }

    public function update(Request $request, int $id)
    {
        $client = Client::where('id',$id)->where('owner_id',$this->ownerId())->firstOrFail();
        $client->update($request->only(['name','email','company','phone','website','industry','status','notes']));
        return back()->with('success', 'Client updated.');
    }

    public function destroy(int $id)
    {
        Client::where('id',$id)->where('owner_id',$this->ownerId())->firstOrFail()->delete();
        return back()->with('success', 'Client removed.');
    }
}
