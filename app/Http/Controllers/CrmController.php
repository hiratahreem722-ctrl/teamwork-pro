<?php
namespace App\Http\Controllers;

use App\Models\CrmLead;
use App\Models\CrmContact;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CrmController extends Controller
{
    private function ownerId() {
        $u = Auth::user(); return $u->role === 'owner' ? $u->id : ($u->invited_by ?? $u->id);
    }

    // LEADS
    public function leads()
    {
        $leads = CrmLead::where('owner_id',$this->ownerId())->orderBy('created_at','desc')->get();
        return Inertia::render('CRM/Leads', ['leads'=>$leads]);
    }

    public function storeLead(Request $request)
    {
        $v = $request->validate([
            'name'    => ['required','string','max:200'],
            'email'   => ['nullable','email'],
            'company' => ['nullable','string','max:200'],
            'phone'   => ['nullable','string','max:30'],
            'stage'   => ['nullable','string'],
            'value'   => ['nullable','numeric'],
            'source'  => ['nullable','string','max:100'],
        ]);
        CrmLead::create(array_merge($v,['owner_id'=>$this->ownerId()]));
        return back()->with('success','Lead added!');
    }

    public function updateLead(Request $request, int $id)
    {
        CrmLead::where('id',$id)->where('owner_id',$this->ownerId())->firstOrFail()
            ->update($request->only(['name','email','company','phone','stage','value','source','notes']));
        return back()->with('success','Lead updated.');
    }

    // CONTACTS
    public function contacts()
    {
        $contacts = CrmContact::where('owner_id',$this->ownerId())->orderBy('created_at','desc')->get();
        return Inertia::render('CRM/Contacts', ['contacts'=>$contacts]);
    }

    public function storeContact(Request $request)
    {
        $v = $request->validate([
            'name'    => ['required','string','max:200'],
            'email'   => ['nullable','email'],
            'company' => ['nullable','string','max:200'],
            'phone'   => ['nullable','string','max:30'],
            'type'    => ['nullable','string'],
        ]);
        CrmContact::create(array_merge($v,['owner_id'=>$this->ownerId()]));
        return back()->with('success','Contact added!');
    }
}
