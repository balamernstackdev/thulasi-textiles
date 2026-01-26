'use client';

export default function PrintInvoiceButton() {
    return (
        <button
            onClick={() => window.print()}
            className="bg-orange-600 text-white px-8 py-3 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-orange-700 transition-all shadow-xl shadow-orange-200"
        >
            Click to Print Invoice
        </button>
    );
}
