<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Invoice extends Model {
    protected $fillable = ['owner_id','client_id','invoice_number','line_items','subtotal','tax_rate','tax_amount','total','currency','status','issue_date','due_date','notes'];
    protected $casts = ['line_items'=>'array','issue_date'=>'date','due_date'=>'date','subtotal'=>'decimal:2','tax_amount'=>'decimal:2','total'=>'decimal:2'];
    public function owner() { return $this->belongsTo(User::class,'owner_id'); }
    public function client() { return $this->belongsTo(Client::class); }
}
