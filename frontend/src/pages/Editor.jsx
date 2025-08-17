import { useEffect,  useState } from 'react';
import { api } from '../api';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import Uploader from '../components/Uploader';
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const emptyForm = {
  title: 'Untitled Form',
  description: '',
  headerImageUrl: '',
  theme: { accent: '#2563eb', font: 'Inter' },
  questions: []
};

export default function Editor(){
  const [search] = useSearchParams();
  const id = search.get('id');
  const [form, setForm] = useState(emptyForm);
  const navigate = useNavigate();

  useEffect(() => {
    if(id){
      api.get(`/forms/${id}`).then(res => setForm(res.data));
    }
  }, [id]);

  const addQuestion = (type) => {
  const q = {
    _id: crypto.randomUUID(),
    type,
    order: (form.questions?.length || 0) + 1,
    title: '',
    prompt: '',
    required: true,
    imageUrl: '',
    settings: {}
  };

  if (type === 'categorize') {
    q.settings.categorize = {
      categories: [{ key: 'cat1', label: '' }, { key: 'cat2', label: '' }],
      items: [{ id: 'i1', label: '', correctCategoryKey: 'cat1' }]
    };
  } else if (type === 'cloze') {
    q.settings.cloze = {
      text: '',
      blanks: [{ key: '1', answer: '', options: [] }, { key: '2', answer: '', options: [] }]
    };
  } else if (type === 'comprehension') {
    q.settings.comprehension = {
      passage: '',
      questions: [
        { qid: 'q1', questionText: '', kind: 'short', options: [], answer: '' }
      ]
    };
  }

  setForm(f => ({ ...f, questions: [...f.questions, q] }));
};


  const save = async () => {
  try {
    if(id){
      const { data } = await api.put(`/forms/${id}`, form);
      setForm(data);
      alert('Saved!');
    } else {
      const { data } = await api.post('/forms', form);
      navigate(`/editor?id=${data._id}`);
    }
  } catch (err) {
    alert("Save failed: " + (err.response?.data?.message || err.message));
  }
};


  return (
  <div className="grid lg:grid-cols-3 gap-6">
    {/* ================= Main Content ================= */}
    <div className="lg:col-span-2 space-y-6">

      {/* ---------------- Form Settings ---------------- */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-gray-200 
                      shadow-lg p-6 space-y-5 transition-all duration-300 
                      hover:shadow-xl hover:border-gray-300">

        {/* Section Title */}
        <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
          Form Settings
        </h2>

        {/* Form Title */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Form Title
          </label>
          <input
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-800 
                       focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none 
                       transition-all duration-200 placeholder-gray-400 shadow-sm"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Enter your form title..."
          />
        </div>

        {/* Form Description */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            rows={4}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-800 
                       focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none 
                       transition-all duration-200 placeholder-gray-400 shadow-sm resize-none"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Write a short description about this form..."
          />
        </div>

        {/* Header Image Upload */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Header Image</p>
          <div className="p-4 border-2 border-dashed border-gray-300 rounded-xl 
                          hover:border-blue-400 hover:bg-blue-50 transition-all duration-300">
            <Uploader
              value={form.headerImageUrl}
              onChange={(url) => setForm({ ...form, headerImageUrl: url })}
            />
          </div>
          {form.headerImageUrl && (
            <div className="mt-3">
              <img
                src={form.headerImageUrl}
                alt="Header Preview"
                className="rounded-xl shadow-md w-full object-cover max-h-48 border border-gray-200"
              />
            </div>
          )}
        </div>
      </div>

      {/* ---------------- Questions ---------------- */}
<div className="space-y-6">
  {form.questions.map((q, idx) => (
    <div
      key={q._id}
      className="bg-white/80 backdrop-blur-lg border border-white/20 rounded-2xl shadow-md hover:shadow-2xl hover:-translate-y-1 transition-transform duration-300 p-5 space-y-4"
    >
      {/* Header (Index + Delete) */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600 font-medium">
          #{idx + 1} • <span className="capitalize">{q.type}</span>
        </span>
        <button
          onClick={() =>
            setForm(f => ({
              ...f,
              questions: f.questions.filter(x => x._id !== q._id)
            }))
          }
          className="text-sm text-red-600 hover:text-red-700 transition"
        >
          Delete
        </button>
      </div>

      {/* Question Title */}
      <input
        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
        value={q.title}
        onChange={e => {
          const v = e.target.value;
          setForm(f => ({
            ...f,
            questions: f.questions.map(x =>
              x._id === q._id ? { ...x, title: v } : x
            )
          }));
        }}
        placeholder="Question title"
      />

      {/* Question Prompt */}
      <textarea
        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
        value={q.prompt}
        onChange={e => {
          const v = e.target.value;
          setForm(f => ({
            ...f,
            questions: f.questions.map(x =>
              x._id === q._id ? { ...x, prompt: v } : x
            )
          }));
        }}
        placeholder="Instructions/prompt"
      />

      {/* Question Image */}
      <div>
        <p className="text-sm mb-2 font-medium text-gray-700">Question Image</p>
        <Uploader
          value={q.imageUrl}
          onChange={(url) => {
            setForm(f => ({
              ...f,
              questions: f.questions.map(x =>
                x._id === q._id ? { ...x, imageUrl: url } : x
              )
            }));
          }}
        />
      </div>

      {/* Type-specific Editors */}
      <div className="mt-2">
        {q.type === 'categorize' && <CategorizeEditor q={q} setForm={setForm} />}
        {q.type === 'cloze' && <ClozeEditor q={q} setForm={setForm} />}
        {q.type === 'comprehension' && <ComprehensionEditor q={q} setForm={setForm} />}
      </div>
    </div>
  ))}
</div>

    </div>

 {/* ================= Sidebar ================= */}
<div className="space-y-6 w-full md:w-72">
  <div className="sticky top-20 bg-white/90 backdrop-blur-md border border-gray-200 rounded-2xl shadow-lg p-5 space-y-4">
    {/* Sidebar Header */}
    <h3 className="text-lg font-bold text-gray-800">Add Question</h3>

    {/* Add Question Buttons */}
    <div className="flex flex-col gap-2">
      <button
        onClick={() => addQuestion('categorize')}
        className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold hover:scale-105 hover:shadow-md transition transform"
      >
        + Categorize
      </button>
      <button
        onClick={() => addQuestion('cloze')}
        className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-green-400 to-teal-500 text-white font-semibold hover:scale-105 hover:shadow-md transition transform"
      >
        + Cloze
      </button>
      <button
        onClick={() => addQuestion('comprehension')}
        className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-yellow-400 to-orange-400 text-white font-semibold hover:scale-105 hover:shadow-md transition transform"
      >
        + Comprehension
      </button>
    </div>

    {/* Save Button */}
    <button
      onClick={save}
      className="mt-4 w-full px-4 py-2 rounded-lg bg-gray-900 text-white font-semibold hover:bg-gray-800 hover:shadow-lg transition"
    >
      Save
    </button>

    {/* Preview Link */}
    {(form?._id || id) && (
      <Link
        className="mt-2 block text-center text-blue-700 underline hover:text-blue-800 transition"
        to={`/f/${form._id || id}`}
      >
        Open Preview / Fill
      </Link>
    )}
  </div>
</div>


  </div>
);
}


import { GripVertical } from "lucide-react"; // Optional for drag handle icons

function CategorizeEditor({ q, setForm }) {
  const update = (patch) =>
    setForm((f) => ({
      ...f,
      questions: f.questions.map((x) =>
        x._id === q._id
          ? { ...x, settings: { ...x.settings, categorize: { ...x.settings.categorize, ...patch } } }
          : x
      ),
    }));

  const cat = q.settings.categorize;

  const handleDragEnd = (result, type) => {
    if (!result.destination) return;

    const list = type === "category" ? [...cat.categories] : [...cat.items];
    const [moved] = list.splice(result.source.index, 1);
    list.splice(result.destination.index, 0, moved);
    type === "category" ? update({ categories: list }) : update({ items: list });
  };

  const categoryColors = [
    "from-indigo-50 to-indigo-100",
    "from-pink-50 to-pink-100",
    "from-yellow-50 to-yellow-100",
    "from-green-50 to-green-100",
    "from-purple-50 to-purple-100",
  ];

  const itemColors = [
    "from-green-50 to-green-100",
    "from-blue-50 to-blue-100",
    "from-purple-50 to-purple-100",
  ];

  return (
    <div className="space-y-6">
      {/* ================= Categories ================= */}
      <DragDropContext onDragEnd={(res) => handleDragEnd(res, "category")}>
        <Droppable droppableId="categories">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="rounded-2xl p-5 border border-gray-200 shadow-md backdrop-blur-md bg-gradient-to-br from-gray-50 to-gray-100"
            >
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Categories</h3>
              {cat.categories.map((c, i) => (
                <Draggable key={c.key} draggableId={c.key} index={i}>
                  {(prov) => (
                    <div
                      ref={prov.innerRef}
                      {...prov.draggableProps}
                      className={`flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r ${categoryColors[i % categoryColors.length]} border border-gray-200 hover:shadow-lg hover:scale-[1.02] transition-all duration-300`}
                    >
                      <div {...prov.dragHandleProps} className="cursor-grab">
                        <GripVertical size={18} />
                      </div>
                      <input
                        className="border border-gray-300 rounded px-3 py-2 w-28 focus:ring-2 focus:ring-indigo-400"
                        value={c.key}
                        placeholder="Key"
                        onChange={(e) => {
                          const v = e.target.value;
                          const next = cat.categories.map((x, idx) => (idx === i ? { ...x, key: v } : x));
                          update({ categories: next });
                        }}
                      />
                      <input
                        className="border border-gray-300 rounded px-3 py-2 flex-1 focus:ring-2 focus:ring-indigo-400"
                        value={c.label}
                        placeholder="Category Name"
                        onChange={(e) => {
                          const v = e.target.value;
                          const next = cat.categories.map((x, idx) => (idx === i ? { ...x, label: v } : x));
                          update({ categories: next });
                        }}
                      />
                      <button
                        className="text-red-600 font-bold hover:text-red-700 transition text-xl"
                        onClick={() =>
                          update({ categories: cat.categories.filter((_, idx) => idx !== i) })
                        }
                      >
                        🗑
                      </button>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
              <button
                className="mt-4 px-4 py-2 rounded-lg bg-indigo-100 text-indigo-700 font-medium hover:bg-indigo-200 hover:shadow-md transition"
                onClick={() =>
                  update({
                    categories: [
                      ...cat.categories,
                      { key: `cat${cat.categories.length + 1}`, label: "New Category" },
                    ],
                  })
                }
              >
                + Add Category
              </button>
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* ================= Items ================= */}
      <DragDropContext onDragEnd={(res) => handleDragEnd(res, "item")}>
        <Droppable droppableId="items">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="rounded-2xl p-5 border border-gray-200 shadow-md backdrop-blur-md bg-gradient-to-br from-gray-50 to-gray-100"
            >
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Items</h3>
              {cat.items.map((it, i) => (
                <Draggable key={it.id} draggableId={it.id} index={i}>
                  {(prov) => (
                    <div
                      ref={prov.innerRef}
                      {...prov.draggableProps}
                      {...prov.dragHandleProps}
                      className={`grid grid-cols-3 gap-3 items-center p-3 rounded-xl bg-gradient-to-r ${itemColors[i % itemColors.length]} border border-gray-200 hover:shadow-lg hover:scale-[1.02] transition-all duration-300`}
                    >
                      <input
                        className="border border-gray-300 rounded px-3 py-2 w-full focus:ring-2 focus:ring-green-400"
                        value={it.id}
                        placeholder="Item ID"
                        onChange={(e) => {
                          const v = e.target.value;
                          const next = cat.items.map((x, idx) => (idx === i ? { ...x, id: v } : x));
                          update({ items: next });
                        }}
                      />
                      <input
                        className="border border-gray-300 rounded px-3 py-2 w-full focus:ring-2 focus:ring-green-400"
                        value={it.label}
                        placeholder="Item Label"
                        onChange={(e) => {
                          const v = e.target.value;
                          const next = cat.items.map((x, idx) => (idx === i ? { ...x, label: v } : x));
                          update({ items: next });
                        }}
                      />
                      <select
                        className="border border-gray-300 rounded px-3 py-2 w-full focus:ring-2 focus:ring-green-400"
                        value={it.correctCategoryKey}
                        onChange={(e) => {
                          const v = e.target.value;
                          const next = cat.items.map((x, idx) => (idx === i ? { ...x, correctCategoryKey: v } : x));
                          update({ items: next });
                        }}
                      >
                        {cat.categories.map((c) => (
                          <option key={c.key} value={c.key}>
                            {c.label}
                          </option>
                        ))}
                      </select>
                      <button
                        className="text-red-600 font-bold hover:text-red-700 col-span-3 mt-2 text-lg"
                        onClick={() =>
                          update({ items: cat.items.filter((_, idx) => idx !== i) })
                        }
                      >
                        🗑 Delete
                      </button>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
              <button
                className="mt-4 px-4 py-2 rounded-lg bg-green-100 text-green-700 font-medium hover:bg-green-200 hover:shadow-md transition"
                onClick={() =>
                  update({
                    items: [
                      ...cat.items,
                      {
                        id: `i${cat.items.length + 1}`,
                        label: "New Item",
                        correctCategoryKey: cat.categories[0]?.key || "",
                      },
                    ],
                  })
                }
              >
                + Add Item
              </button>
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}


function ClozeEditor({ q, setForm }) {
  const cl = q.settings.cloze;

  const update = (patch) =>
    setForm((f) => ({
      ...f,
      questions: f.questions.map((x) =>
        x._id === q._id
          ? { ...x, settings: { ...x.settings, cloze: { ...x.settings.cloze, ...patch } } }
          : x
      ),
    }));

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const next = [...cl.blanks];
    const [moved] = next.splice(result.source.index, 1);
    next.splice(result.destination.index, 0, moved);
    update({ blanks: next });
  };

  const blankColors = [
    "from-purple-50 to-purple-100",
    "from-green-50 to-green-100",
    "from-yellow-50 to-yellow-100",
    "from-pink-50 to-pink-100",
    "from-blue-50 to-blue-100",
  ];

  return (
    <div className="space-y-6">
      {/* Cloze Text */}
      <div className="bg-white/90 backdrop-blur-md shadow-md rounded-2xl p-5 border border-gray-200">
        <label className="text-sm font-semibold text-gray-800 mb-2 block">
          Cloze Text (use __1__, __2__ as blanks)
        </label>
        <textarea
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none placeholder-gray-400"
          value={cl.text}
          onChange={(e) => update({ text: e.target.value })}
          placeholder="Enter your cloze text here..."
        />
      </div>

      {/* Blanks Section */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="blanks">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="bg-white/90 backdrop-blur-md shadow-md rounded-2xl p-5 border border-gray-200"
            >
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Blanks</h3>
              {cl.blanks.map((b, i) => (
                <Draggable key={b.key} draggableId={b.key} index={i}>
                  {(prov) => (
                    <div
                      ref={prov.innerRef}
                      {...prov.draggableProps}
                      className={`flex gap-3 items-center p-3 rounded-xl bg-gradient-to-r ${blankColors[i % blankColors.length]} border border-gray-200 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 mb-2`}
                    >
                      <div {...prov.dragHandleProps} className="cursor-grab">
                        <GripVertical size={18} />
                      </div>
                      <input
                        className="border border-gray-300 rounded px-3 py-2 w-24 focus:ring-2 focus:ring-indigo-400"
                        value={b.key}
                        placeholder="Key"
                        onChange={(e) => {
                          const v = e.target.value;
                          const next = [...cl.blanks];
                          next[i] = { ...next[i], key: v };
                          update({ blanks: next });
                        }}
                      />
                      <input
                        className="border border-gray-300 rounded px-3 py-2 flex-1 focus:ring-2 focus:ring-indigo-400"
                        value={b.answer}
                        placeholder="Answer"
                        onChange={(e) => {
                          const v = e.target.value;
                          const next = [...cl.blanks];
                          next[i] = { ...next[i], answer: v };
                          update({ blanks: next });
                        }}
                      />
                      <button
                        className="text-red-600 font-bold hover:text-red-700 transition text-xl"
                        onClick={() => {
                          const next = cl.blanks.filter((_, idx) => idx !== i);
                          update({ blanks: next });
                        }}
                      >
                        🗑
                      </button>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
              <button
                className="mt-4 px-4 py-2 rounded-lg bg-indigo-100 text-indigo-700 font-medium hover:bg-indigo-200 hover:shadow-md transition"
                onClick={() =>
                  update({
                    blanks: [...cl.blanks, { key: `${cl.blanks.length + 1}`, answer: "" }],
                  })
                }
              >
                + Add Blank
              </button>
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}


function ComprehensionEditor({ q, setForm }) {
  const cs = q.settings.comprehension;
  const update = (patch) =>
    setForm((f) => ({
      ...f,
      questions: f.questions.map((x) =>
        x._id === q._id
          ? {
              ...x,
              settings: {
                ...x.settings,
                comprehension: { ...x.settings.comprehension, ...patch },
              },
            }
          : x
      ),
    }));

  return (
    <div className="space-y-6 bg-white/90 backdrop-blur-md shadow-md rounded-2xl p-5 border border-gray-200">
      {/* Passage */}
      <div>
        <label className="text-sm font-semibold text-gray-800 mb-1 block">
          Passage
        </label>
        <textarea
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          value={cs.passage}
          onChange={(e) => update({ passage: e.target.value })}
          placeholder="Enter the passage here..."
        />
      </div>

      {/* Questions */}
      <div>
        <h3 className="text-sm font-semibold text-gray-800 mb-2">Questions</h3>
        <div className="space-y-4">
          {cs.questions.map((qq, i) => (
            <div
              key={qq.qid}
              className="p-4 border border-gray-200 rounded-lg bg-gray-50 hover:shadow-md transition"
            >
              {/* Question Text */}
              <input
                className="border border-gray-300 rounded px-3 py-2 w-full focus:ring-2 focus:ring-indigo-400"
                value={qq.questionText}
                onChange={(e) => {
                  const v = e.target.value;
                  const next = [...cs.questions];
                  next[i] = { ...next[i], questionText: v };
                  update({ questions: next });
                }}
                placeholder="Question text"
              />

              {/* Question Type */}
              <select
                className="border border-gray-300 rounded px-3 py-2 mt-2 focus:ring-2 focus:ring-indigo-400"
                value={qq.kind}
                onChange={(e) => {
                  const v = e.target.value;
                  const next = [...cs.questions];
                  next[i] = { ...next[i], kind: v };
                  update({ questions: next });
                }}
              >
                <option value="mcq">MCQ</option>
                <option value="short">Short Answer</option>
              </select>

              {/* MCQ Options */}
              {qq.kind === "mcq" && (
                <div className="mt-2 space-y-2">
                  {(qq.options || []).map((op, idx) => (
                    <div
                      key={idx}
                      className="flex gap-2 items-center p-2 rounded-md bg-white border border-gray-200 hover:shadow-sm transition"
                    >
                      <input
                        className="border border-gray-300 rounded px-3 py-2 flex-1 focus:ring-2 focus:ring-indigo-400"
                        value={op}
                        onChange={(e) => {
                          const v = e.target.value;
                          const next = [...cs.questions];
                          const ops = [...(qq.options || [])];
                          ops[idx] = v;
                          next[i] = { ...qq, options: ops };
                          update({ questions: next });
                        }}
                        placeholder={`Option ${idx + 1}`}
                      />
                      <button
                        className="text-red-600 font-semibold hover:text-red-700 transition"
                        onClick={() => {
                          const next = [...cs.questions];
                          const ops = [...(qq.options || [])].filter(
                            (_, k) => k !== idx
                          );
                          next[i] = { ...qq, options: ops };
                          update({ questions: next });
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                  <button
                    className="text-sm mt-1 text-indigo-600 font-medium hover:text-indigo-800 underline"
                    onClick={() => {
                      const next = [...cs.questions];
                      const ops = [...(qq.options || []), "New option"];
                      next[i] = { ...qq, options: ops };
                      update({ questions: next });
                    }}
                  >
                    + Add Option
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Add Question */}
        <button
          className="mt-4 text-indigo-600 font-medium hover:text-indigo-800 underline"
          onClick={() => {
            const next = [
              ...cs.questions,
              {
                qid: crypto.randomUUID(),
                questionText: "New question",
                kind: "mcq",
                options: ["A", "B", "C", "D"],
                answer: "",
              },
            ];
            update({ questions: next });
          }}
        >
          + Add Question
        </button>
      </div>
    </div>
  );
}
