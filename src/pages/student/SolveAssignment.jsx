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
  const [submitted, setSubmitted] = useState(false); // لمنع الإرسال المتكرر

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await axiosInstance.get(`/api/assessments/${id}`);
        const a = data.content ?? data;
        setAssignment(a);
        const parsed = parseCorrectAnswers(a.correctAnswers);
        const initial = {};
        parsed.forEach((q) => (initial[q.q] = ""));
        setAnswers(initial);
      } catch (err) {
        toast.error("❌ Failed to load assignment");
      } finally {
        setLoading(false);
      }
    };

    const checkSubmission = async () => {
      const studentId = localStorage.getItem("userId");
      try {
        const { data } = await axiosInstance.get(`/api/submissions/student/${studentId}`);
        const existing = data.find((s) => s.assessmentId === parseInt(id));
        if (existing) {
          setSubmitted(true);
          setAnswers(JSON.parse(existing.answers));
          toast.info("✅ You already submitted this assignment.");
        }
      } catch (err) {
        console.error(err);
      }
    };

    load();
    checkSubmission();
  }, [id]);

  const parseCorrectAnswers = (str) => {
    return (str || "").split(",").map((pair) => {
      const [q, a] = pair.split("=");
      return { q: q.trim(), a: a.trim() };
    });
  };

  const handleChange = (q, value) => {
    setAnswers((prev) => ({ ...prev, [q]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const studentId = localStorage.getItem("userId");
    if (!studentId) {
      toast.error("❌ Missing student ID – please re-login");
      return;
    }

    const submission = {
      studentId: parseInt(studentId),
      assessmentId: parseInt(id),
      answers: JSON.stringify(answers), // ✅ تم تصحيح هذا السطر
      submittedDate: new Date().toISOString(),
    };

    try {
      const res = await axiosInstance.post("/api/submissions", submission);
      const result = res.data.content ?? res.data;
      setSubmitted(true);
      toast.success(`✅ Submitted! Your score: ${result.score.toFixed(2)}%`);
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to submit your answers");
    }
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
              disabled={submitted} // ✅ تعطيل بعد التسليم
            >
              <option value="">Select answer</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
            </select>
          </div>
        ))}
        <button type="submit" className="submit-btn" disabled={submitted}>
          {submitted ? "Already Submitted" : "Submit"}
        </button>
      </form>
      {submitted && (
        <div className="submission-message">
          ✅ You have already submitted this assignment.
        </div>
      )}
    </section>
  );
}
