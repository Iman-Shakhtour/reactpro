import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-toastify";
import "./SolveAssignment.css";

export default function SolveAssignment() {
  const { id } = useParams();
  const [assignment, setAssignment] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await axiosInstance.get(`/api/assessments/${id}`);
        const a = data.content ?? data;
        setAssignment(a);
        const parsed = parseCorrectAnswers(a.correctAnswers);
        const initial = {};
        parsed.forEach(q => initial[q.q] = "");
        setAnswers(initial);
      } catch (err) {
        toast.error("❌ Failed to load assignment");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const parseCorrectAnswers = (str) => {
    return (str || "")
      .split(",")
      .map(pair => {
        const [q, a] = pair.split("=");
        return { q: q.trim(), a: a.trim() };
      });
  };

  const handleChange = (q, value) => {
    setAnswers(prev => ({ ...prev, [q]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.success("✅ Submission saved (mock)");
    // 🔒 لاحقًا: أرسلها إلى /api/submissions
  };

  if (loading) return <div className="solve-wrapper">Loading…</div>;
  if (!assignment) return <div className="solve-wrapper">Assignment not found.</div>;

  const questions = parseCorrectAnswers(assignment.correctAnswers);

  return (
    <section className="solve-wrapper">
      <h2 className="solve-heading">📝 Solve: {assignment.type}</h2>
      <form className="solve-form" onSubmit={handleSubmit}>
        {questions.map(({ q }) => (
          <div key={q} className="question-box">
            <label className="question-label">{q}</label>
            <select
              value={answers[q]}
              onChange={(e) => handleChange(q, e.target.value)}
              className="question-select"
              required
            >
              <option value="">Select answer</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
            </select>
          </div>
        ))}
        <button type="submit" className="submit-btn">Submit</button>
      </form>
    </section>
  );
}
