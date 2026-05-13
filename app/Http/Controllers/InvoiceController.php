<?php
namespace App\Http\Controllers;

use App\Models\Invoice;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class InvoiceController extends Controller
{
    private function ownerId() {
        $u = Auth::user(); return $u->role === 'owner' ? $u->id : ($u->invited_by ?? $u->id);
    }

    public function index()
    {
        $invoices = Invoice::where('owner_id',$this->ownerId())
            ->with('client:id,name,company')
            ->orderBy('created_at','desc')->get();
        return \Inertia\Inertia::render('Finance/Invoices', ['invoices' => $invoices]);
    }

    public function store(Request $request)
    {
        $v = $request->validate([
            'client_id'  => ['nullable','exists:clients,id'],
            'line_items' => ['required','array'],
            'subtotal'   => ['required','numeric'],
            'tax_rate'   => ['nullable','numeric'],
            'tax_amount' => ['nullable','numeric'],
            'total'      => ['required','numeric'],
            'currency'   => ['nullable','string','max:10'],
            'issue_date' => ['required','date'],
            'due_date'   => ['required','date'],
            'notes'      => ['nullable','string'],
        ]);
        $v['owner_id'] = $this->ownerId();
        $v['invoice_number'] = 'INV-'.strtoupper(substr(uniqid(),0,8));
        $v['status'] = 'draft';
        Invoice::create($v);
        return back()->with('success','Invoice created!');
    }

    public function update(Request $request, int $id)
    {
        Invoice::where('id',$id)->where('owner_id',$this->ownerId())->firstOrFail()
            ->update($request->only(['status']));
        return back()->with('success','Invoice updated.');
    }
}
