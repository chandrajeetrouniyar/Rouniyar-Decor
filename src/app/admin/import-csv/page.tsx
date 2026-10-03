'use client';

import React, { useState } from 'react';
import Papa from 'papaparse';
import { UploadCloud, Download, CheckCircle, AlertCircle, FileText, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { formatPrice } from '@/lib/utils';

export default function AdminImportCsvPage() {
  const { token } = useAuth();
  const [csvText, setCsvText] = useState('');
  const [parsedRows, setParsedRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [importResult, setImportResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const sampleCsvData = `name,category,price,mrp,sku,stock,material,color,dimensions,weight,tags,image1,description
"Auspicious Sunburst Toran","Toran & Bandarwal",499,899,"RD-IMP-001",15,"Soft Wool Yarn","Yellow & Red","38x8 Inches","240g","Toran, Festive","https://images.unsplash.com/photo-1606744837616-56c9a5c6a6eb?w=800","Handcrafted auspicious sunburst toran."
"Festive Lotus Thali Posh","Pooja Decor & Thali Posh",349,599,"RD-IMP-002",20,"Crochet Cotton","Maroon","16 Inch Dia","140g","Thali Posh, Pooja","https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800","Handmade crochet lotus pooja thali cover."`;

  const handleDownloadSample = () => {
    const blob = new Blob([sampleCsvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'rouniyar_decor_products_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          setParsedRows(results.data);
          setErrorMsg(null);
        },
        error: (err) => {
          setErrorMsg(err.message);
        },
      });
    }
  };

  const handleParseText = () => {
    if (!csvText.trim()) return;
    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setParsedRows(results.data);
        setErrorMsg(null);
      },
      error: (err) => {
        setErrorMsg(err.message);
      },
    });
  };

  const handleImport = async () => {
    if (parsedRows.length === 0) return;
    setLoading(true);
    setImportResult(null);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/admin/import-csv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rows: parsedRows }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Import failed');

      setImportResult(data);
      setParsedRows([]);
      setCsvText('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Import error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-earth-200">
        <div>
          <span className="text-xs uppercase tracking-widest text-terracotta font-semibold">
            Catalog Ingestion
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-earth-900 mt-1">
            Import Products via CSV
          </h1>
        </div>

        <button
          onClick={handleDownloadSample}
          className="flex items-center gap-1.5 px-4 py-2 bg-cream-100 hover:bg-cream-200 text-earth-900 rounded-xl text-xs font-semibold border border-earth-300 transition-colors self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-terracotta" /> Download Sample CSV Template
        </button>
      </div>

      {/* Upload & Paste Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* File Drop Area */}
        <div className="p-6 bg-white rounded-3xl border-2 border-dashed border-earth-300 hover:border-terracotta text-center space-y-4 transition-colors">
          <div className="w-12 h-12 bg-cream-100 rounded-full flex items-center justify-center mx-auto text-terracotta">
            <UploadCloud className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-sm text-earth-900">Upload CSV File</h3>
            <p className="text-xs text-earth-600 mt-1">
              Select a .csv file formatted with product columns
            </p>
          </div>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="text-xs file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-earth-900 file:text-white hover:file:bg-terracotta cursor-pointer text-earth-600"
          />
        </div>

        {/* Raw CSV Text Paste */}
        <div className="p-6 bg-white rounded-3xl border border-earth-200 shadow-card space-y-3">
          <h3 className="font-serif font-bold text-sm text-earth-900">Or Paste Raw CSV Content</h3>
          <textarea
            rows={4}
            value={csvText}
            onChange={(e) => setCsvText(e.target.value)}
            placeholder='name,category,price,mrp,sku,stock...'
            className="w-full p-2.5 border border-earth-300 rounded-xl text-xs font-mono focus:border-terracotta focus:outline-none"
          />
          <button
            onClick={handleParseText}
            disabled={!csvText.trim()}
            className="px-4 py-2 bg-earth-900 hover:bg-earth-800 text-white rounded-xl text-xs font-semibold disabled:opacity-50 transition-colors"
          >
            Parse CSV Text
          </button>
        </div>
      </div>

      {/* Import Result Notification */}
      {importResult && (
        <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-3xl space-y-2">
          <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <span>{importResult.message}</span>
          </div>
          {importResult.errors && importResult.errors.length > 0 && (
            <div className="text-xs text-red-700 space-y-1 pt-2 border-t border-emerald-200">
              <p className="font-bold">Row-level issues:</p>
              {importResult.errors.map((err: any, i: number) => (
                <p key={i}>
                  Row {err.row}: {err.reason}
                </p>
              ))}
            </div>
          )}
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Preview Table if rows parsed */}
      {parsedRows.length > 0 && (
        <div className="bg-white rounded-3xl border border-earth-200 shadow-card p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-earth-100">
            <div>
              <h3 className="font-serif font-bold text-base text-earth-900">
                Parsed Rows Preview ({parsedRows.length} items ready)
              </h3>
              <p className="text-xs text-earth-600">Review your products before committing to database.</p>
            </div>
            <button
              onClick={handleImport}
              disabled={loading}
              className="px-6 py-2.5 bg-terracotta hover:bg-terracotta-hover text-white rounded-xl text-xs font-semibold shadow-sm transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? 'Importing Products...' : `Import ${parsedRows.length} Products`}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="overflow-x-auto max-h-72">
            <table className="w-full text-left text-xs">
              <thead className="bg-cream-50 text-earth-700 font-bold uppercase text-[10px] sticky top-0">
                <tr>
                  <th className="p-2.5">Name</th>
                  <th className="p-2.5">Category</th>
                  <th className="p-2.5">Price</th>
                  <th className="p-2.5">MRP</th>
                  <th className="p-2.5">SKU</th>
                  <th className="p-2.5">Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-earth-100">
                {parsedRows.map((r, i) => (
                  <tr key={i} className="hover:bg-cream-50/50">
                    <td className="p-2.5 font-bold text-earth-900">{r.name || r.Name}</td>
                    <td className="p-2.5 text-earth-600">{r.category || r.Category}</td>
                    <td className="p-2.5 font-semibold text-earth-900">₹{r.price || r.Price}</td>
                    <td className="p-2.5 text-earth-600">₹{r.mrp || r.MRP}</td>
                    <td className="p-2.5 font-mono text-earth-800">{r.sku || r.SKU}</td>
                    <td className="p-2.5">{r.stock || r.Stock || 10}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
