import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api';


export default function Fill() {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [answers, setAnswers] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  const BASE_URL = import.meta.env.VITE_API_URL; // backend base URL

  useEffect(() => {
    api.get(`/forms/${id}`).then(r => setForm(r.data));
  }, [id]);

  const submit = async () => {
    const payload = {
      formId: id,
      answers: Object.entries(answers).map(([questionId, value]) => ({ questionId, value }))
    };
    await api.post('/responses', payload);

    // Show success popup
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  if (!form) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="mx-auto max-w-3xl py-6 px-4 space-y-6 relative">
      {form.headerImageUrl && (
        <img
          src={`${BASE_URL}${form.headerImageUrl}`}
          className="w-full rounded-xl border mb-4 shadow-md"
          alt="Form Header"
        />
      )}
      <h1 className="text-3xl font-bold">{form.title}</h1>
      <p className="text-gray-600 mb-6">{form.description}</p>

      <div className="space-y-6">
        {form.questions.map((q, idx) => (
          <div
            key={q._id}
            className="bg-white shadow-md rounded-xl p-5 border border-gray-200 hover:shadow-lg transition"
          >
            <div className="flex items-start gap-3">
              <span className="text-gray-500 font-semibold mt-1">{idx + 1}.</span>
              <div className="flex-1">
                <p className="font-semibold text-gray-800 mb-1">{q.title || q.type.toUpperCase()}</p>
                <p className="text-gray-600 mb-2">{q.prompt}</p>
                {q.imageUrl && (
                  <img
                    className="mt-2 rounded border shadow-sm max-h-40 object-cover"
                    src={`${BASE_URL}${q.imageUrl}`}
                    alt="Question"
                  />
                )}
                <QuestionRenderer q={q} setAnswers={setAnswers} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={submit}
        className="mt-6 w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
      >
        Submit
      </button>

      {/* Success Popup */}
      {showSuccess && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-center animate-scaleUp">
            <svg
              className="w-16 h-16 text-green-500 mb-4 animate-drawCheck"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <p className="text-green-600 font-semibold text-lg">Form submitted successfully!</p>
          </div>
        </div>
      )}

      {/* Tailwind Animations */}
      <style>{`
        @keyframes scaleUp {
          0% { transform: scale(0.5) translate(-50%, -50%); opacity: 0; }
          50% { transform: scale(1.1) translate(-50%, -50%); opacity: 1; }
          100% { transform: scale(1) translate(-50%, -50%); }
        }
        .animate-scaleUp {
          animation: scaleUp 0.5s ease-out forwards;
        }

        @keyframes drawCheck {
          0% { stroke-dasharray: 0, 24; stroke-dashoffset: 0; }
          100% { stroke-dasharray: 24, 24; stroke-dashoffset: 0; }
        }
        .animate-drawCheck path {
          stroke-dasharray: 24;
          stroke-dashoffset: 24;
          animation: drawCheck 0.5s ease forwards;
        }
      `}</style>
    </div>
  );
}


function QuestionRenderer({ q, setAnswers }) {
  if (q.type === 'categorize') {
    const s = q.settings.categorize;
    return (
      <div className="mt-3 space-y-2">
        {s.items.map(it => (
          <div key={it.id} className="flex gap-2 items-center">
            <span className="text-gray-700">{it.label}</span>
            <select
              className="border rounded-lg px-3 py-1 focus:ring-2 focus:ring-indigo-400 transition"
              onChange={e =>
                setAnswers(prev => ({
                  ...prev,
                  [q._id]: { ...(prev[q._id] || {}), [it.id]: e.target.value }
                }))
              }
            >
              <option value="">Select category</option>
              {s.categories.map(c => (
                <option key={c.key} value={c.key}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    );
  }

  if (q.type === 'cloze') {
    const cl = q.settings.cloze;
    const parts = cl.text.split(/(__\d+__)/g);
    return (
      <p className="mt-3 leading-7 flex flex-wrap gap-2">
        {parts.map((p, idx) => {
          const m = p.match(/__([0-9]+)__/);
          if (m) {
            const key = m[1];
            return (
              <input
                key={idx}
                className="border-b border-indigo-400 px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-400 rounded"
                onChange={e =>
                  setAnswers(prev => ({
                    ...prev,
                    [q._id]: { ...(prev[q._id] || {}), [key]: e.target.value }
                  }))
                }
                placeholder={`Blank ${key}`}
              />
            );
          }
          return <span key={idx}>{p}</span>;
        })}
      </p>
    );
  }

  if (q.type === 'comprehension') {
    const c = q.settings.comprehension;
    return (
      <div className="mt-3 space-y-3">
        <div className="bg-gray-50 border rounded p-3 whitespace-pre-wrap">{c.passage}</div>
        <div className="space-y-3 mt-3">
          {c.questions.map(qq => (
            <div key={qq.qid} className="space-y-1">
              <p className="font-medium text-gray-800">{qq.questionText}</p>
              {qq.kind === 'mcq' ? (
                <div className="grid gap-2">
                  {qq.options?.map((op, idx) => (
                    <label
                      key={idx}
                      className="flex items-center gap-2 bg-indigo-50 rounded p-2 cursor-pointer hover:bg-indigo-100 transition"
                    >
                      <input
                        type="radio"
                        name={`${q._id}-${qq.qid}`}
                        onChange={() =>
                          setAnswers(prev => ({
                            ...prev,
                            [q._id]: { ...(prev[q._id] || {}), [qq.qid]: op }
                          }))
                        }
                        className="accent-indigo-600"
                      />
                      <span>{op}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <input
                  className="border rounded px-3 py-2 w-full focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                  onChange={e =>
                    setAnswers(prev => ({
                      ...prev,
                      [q._id]: { ...(prev[q._id] || {}), [qq.qid]: e.target.value }
                    }))
                  }
                  placeholder="Your answer"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
}
