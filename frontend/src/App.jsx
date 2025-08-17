// src/App.jsx
import { Routes, Route } from "react-router-dom";
import Editor from "./pages/Editor.jsx";
import Fill from "./pages/Fill.jsx";
import Home from "./pages/Home.jsx";
import Navbar from "./components/Navbar.jsx";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/editor" element={<Editor />} />
          <Route path="/f/:id" element={<Fill />} />
        </Routes>
      </main>
    </div>
  );
}
