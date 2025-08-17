import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import { PlusCircle, FileText, Sparkles } from "lucide-react";

export default function Home() {
  const [forms, setForms] = useState([]);
  const [deleteFormId, setDeleteFormId] = useState(null); // stores form id to delete

  useEffect(() => {
    api.get("/forms").then((res) => setForms(res.data));
  }, []);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/forms/${id}`);
      setForms(forms.filter(f => f._id !== id));
      setDeleteFormId(null);
    } catch (err) {
      console.error(err);
      alert("Failed to delete form.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-600 text-white shadow-md relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.toptal.com/designers/subtlepatterns/patterns/memphis-mini.png')]"></div>
        <div className="relative max-w-6xl mx-auto px-6 py-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Sparkles className="text-yellow-300" size={28} /> Your Forms
            </h1>
            <p className="text-sm text-indigo-100 mt-1">
              Manage, edit, and share all your forms in one place 🚀
            </p>
          </div>
          <Link
            to="/editor"
            className="inline-flex items-center gap-2 px-5 py-2 bg-white text-indigo-700 text-sm font-semibold rounded-xl shadow hover:bg-gray-100 transition"
          >
            <PlusCircle size={18} />
            Create New Form
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {forms.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {forms.map((f) => (
              <div
                key={f._id}
                className="bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative"
              >
                <div className="p-6">
                  {/* Icon + Title */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md group-hover:scale-110 group-hover:shadow-lg transition">
                      <FileText size={22} />
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 truncate group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-purple-600 transition">
                      {f.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-700 line-clamp-3 min-h-[48px]">
                    {f.description || "No description provided."}
                  </p>

                  {/* Actions */}
                  <div className="mt-6 flex gap-3 text-sm font-medium">
                    <Link
                      to={`/editor?id=${f._id}`}
                      className="px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-500/10 to-blue-600/10 text-blue-600 border border-blue-200 hover:from-blue-500/20 hover:to-blue-600/20 hover:shadow-md transition"
                    >
                      ✏️ Edit
                    </Link>
                    <Link
                      to={`/f/${f._id}`}
                      className="px-4 py-1.5 rounded-full bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 text-emerald-600 border border-emerald-200 hover:from-emerald-500/20 hover:to-emerald-600/20 hover:shadow-md transition"
                    >
                      👀 Preview
                    </Link>
                    <button
                      onClick={() => setDeleteFormId(f._id)}
                      className="px-4 py-1.5 rounded-full bg-red-100 text-red-600 border border-red-300 hover:bg-red-200 hover:shadow-md transition"
                    >
                      🗑 Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Empty State
<div className="flex flex-col items-center justify-center mt-24 text-center">
  <h2 className="text-2xl font-extrabold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
    No Forms Yet
  </h2>
  <p className="text-gray-600 text-sm mt-3 max-w-sm leading-relaxed">
    You haven’t created any forms yet. Start building and share with the world 🌍
  </p>
  <Link
    to="/editor"
    className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white text-sm font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
  >
    <PlusCircle size={18} />
    Create Your First Form
  </Link>
</div>

        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteFormId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-lg">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Confirm Deletion</h2>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete this form? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteFormId(null)}
                className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteFormId)}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
