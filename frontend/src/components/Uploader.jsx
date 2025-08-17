import { api } from '../api';
import { useState } from 'react';

export default function Uploader({ value, onChange }){
  const [loading, setLoading] = useState(false);

  const onFile = async (e) => {
    const file = e.target.files?.[0];
    if(!file) return;
    const form = new FormData();
    form.append('image', file);
    setLoading(true);
    try {
      const res = await api.post('/upload', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      onChange(res.data.url);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      {value && (
  <img
    src={`${import.meta.env.VITE_API_URL}${value}`}
    alt=""
    className="h-12 rounded border"
  />
)}

      <label className="px-3 py-2 border rounded cursor-pointer bg-white">
        {loading ? 'Uploading...' : 'Upload Image'}
        <input type="file" className="hidden" accept="image/*" onChange={onFile}/>
      </label>
      {value && <button onClick={()=>onChange('')} className="text-sm text-red-600">Remove</button>}
    </div>
  );
}
