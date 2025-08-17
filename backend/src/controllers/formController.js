import Form from '../models/Form.js';

export const createForm = async (req, res) => {
  try {
    const form = await Form.create(req.body);
    res.status(201).json(form);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateForm = async (req, res) => {
  try {
    const updated = await Form.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Form not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getForm = async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) return res.status(404).json({ message: 'Form not found' });
    res.json(form);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const listForms = async (req, res) => {
  const forms = await Form.find().sort({ createdAt: -1 });
  res.json(forms);
};

export const deleteForm = async (req, res) => {
  try {
    await Form.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
