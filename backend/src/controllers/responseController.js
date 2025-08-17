import Response from '../models/Response.js';

export const submitResponse = async (req, res) => {
  try {
    const payload = {
      ...req.body,
      meta: {
        userAgent: req.headers['user-agent'] || '',
        ip: req.ip
      }
    };
    const saved = await Response.create(payload);
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const listResponsesForForm = async (req, res) => {
  const { id } = req.params;
  const responses = await Response.find({ formId: id }).sort({ submittedAt: -1 });
  res.json(responses);
};
