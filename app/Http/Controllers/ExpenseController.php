<?php
namespace App\Http\Controllers;

use App\Models\Expense;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ExpenseController extends Controller
{
    private function ownerId() {
        $u = Auth::user(); return $u->role === 'owner' ? $u->id : ($u->invited_by ?? $u->id);
    }

    public function index()
    {
        $expenses = Expense::where('owner_id',$this->ownerId())
            ->with('submitter:id,name')
            ->orderBy('created_at','desc')->get();
        return \Inertia\Inertia::render('Finance/Expenses', ['expenses' => $expenses]);
    }

    public function store(Request $request)
    {
        $v = $request->validate([
            'title'        => ['required','string','max:200'],
            'category'     => ['required','string','max:100'],
            'amount'       => ['required','numeric','min:0'],
            'currency'     => ['nullable','string','max:10'],
            'expense_date' => ['required','date'],
            'notes'        => ['nullable','string'],
        ]);
        $v['owner_id'] = $this->ownerId();
        $v['submitted_by'] = Auth::id();
        $v['status'] = 'pending';
        Expense::create($v);
        return back()->with('success','Expense submitted!');
    }

    public function update(Request $request, int $id)
    {
        Expense::where('id',$id)->where('owner_id',$this->ownerId())->firstOrFail()
            ->update($request->only(['status']));
        return back()->with('success','Expense updated.');
    }
}
