/*  Scholarships.jsx  */
import React, { useEffect, useState } from "react";
import studentApi from "../../api/studentApi";
import { toast } from "react-toastify";
import "./Scholarships.css";

const Scholarships = () => {
  /* تبويبات – بيانات – تحميل */
  const [tab, setTab]       = useState("all");
  const [all, setAll]       = useState([]);
  const [apps, setApps]     = useState([]);
  const [loading, setLoad]  = useState(true);

  /* معلومات الطالب الحالي (نحتاج الـ id) */
  const [me, setMe]         = useState(null);

  /* ID المنحة المفتوح فورمها */
  const [applyingId, setApplyingId] = useState(null);

  /* ───────── تحميل مبدئي ───────── */
  useEffect(() => {
    const bootstrap = async () => {
      try {
        const [sch, profile] = await Promise.all([
          studentApi.getScholarships(),
          studentApi.getProfile()
        ]);

        setAll(sch.data.map(x => x.content || x));
        const student = profile.data.content ?? profile.data;
        setMe(student);

        const appsRes = await studentApi.getMyApplications(student.id);
        setApps(appsRes.data.map(x => x.content || x));
      } catch (e) {
        console.error(e);
        toast.error("حدث خطأ في تحميل البيانات");
      } finally {
        setLoad(false);
      }
    };
    bootstrap();
  }, []);

  /* ───────── إرسال الطلب ───────── */
  const submitApplication = async (scholarship, form) => {
    const reason = form.reason.trim();
    const life   = form.lifeCondition.trim();
    if (!reason || !life) {
      toast.error("يرجى تعبئة جميع الحقول"); return;
    }

    const payload = {
      studentId     : me.id,
courseId      : scholarship.courseId ?? null,
      scholarshipId : scholarship.id,
      reason,
      lifeCondition : life,
      status        : "PENDING",   // قيمة ابتدائية اختيارية
      amount        : null
    };

    try {
      await studentApi.applyScholarship(payload);
      toast.success("تم تقديم الطلب بنجاح ✅");

      /* تحديث قائمة طلباتي */
      const r = await studentApi.getMyApplications(me.id);
      setApps(r.data.map(x => x.content || x));
      setTab("my");
      setApplyingId(null);
    } catch (err) {
      console.error(err);
      toast.error("فشل إرسال الطلب");
    }
  };

  /* ───────── بطاقة المنحة ───────── */
  const ScholarshipCard = ({ s }) => {
    const isOpen = applyingId === s.id;
    const [form, setForm] = useState({ reason: "", lifeCondition: "" });

    useEffect(() => { if (!isOpen) setForm({ reason: "", lifeCondition: "" }); }, [isOpen]);

    return (
      <div className="card">
        <div className="card-header">{s.name}</div>

        <div className="card-body">
          <div className="card-row"><span>Amount</span><span>${s.totalAmount?.toLocaleString()}</span></div>
          <div className="card-row"><span>Slots</span><span>{s.availableSlots}</span></div>
          <div className="card-row"><span>Region</span><span>{s.targetRegion || "-"}</span></div>
          <div className="card-row"><span>Course</span><span>{s.courseName || "-"}</span></div>

          {isOpen ? (
            <div className="application-form">
              <h4>Apply for “{s.name}”</h4>

              <label>Reason for Applying</label>
              <textarea rows={4}
                        value={form.reason}
                        onChange={e => setForm({ ...form, reason: e.target.value })} />

              <label>Life Condition</label>
              <textarea rows={4}
                        value={form.lifeCondition}
                        onChange={e => setForm({ ...form, lifeCondition: e.target.value })} />

              <div className="form-buttons">
                <button className="apply-btn"
                        disabled={!form.reason.trim() || !form.lifeCondition.trim()}
                        onClick={() => submitApplication(s, form)}>
                  Submit
                </button>
                <button className="cancel-btn" onClick={() => setApplyingId(null)}>Cancel</button>
              </div>
            </div>
          ) : (
            <button className="apply-btn"
                    disabled={s.availableSlots === 0}
                    onClick={() => setApplyingId(s.id)}>
              Apply
            </button>
          )}
        </div>
      </div>
    );
  };

  /* ───────── بطاقة الطلب ───────── */
  const ApplicationCard = ({ a }) => (
    <div className="card">
      <div className="card-header">{a.scholarshipName || `Scholarship #${a.scholarshipId}`}</div>
      <div className="card-body">
        <div className="card-row"><span>Requested</span><span>{a.amount ?? "-"}</span></div>
        <div className="card-row"><span>Status</span><span className={`status ${a.status}`}>{a.status}</span></div>
      </div>
    </div>
  );

  const data = tab === "all" ? all : apps;

  return (
    <div className="scholarships-page">
      <h2 className="page-title">Scholarships</h2>

      <div className="tabs">
        <span className={`tab ${tab === "all" ? "active" : ""}`} onClick={() => setTab("all")}>All Scholarships</span>
        <span className={`tab ${tab === "my"  ? "active" : ""}`} onClick={() => setTab("my")}>My Applications</span>
      </div>

      {loading ? (
        <p>Loading…</p>
      ) : data.length === 0 ? (
        <p>{tab === "all" ? "No scholarships." : "No applications yet."}</p>
      ) : (
        <div className="card-grid">
          {tab === "all"
            ? data.map(s => <ScholarshipCard key={s.id} s={s} />)
            : data.map(a => <ApplicationCard key={a.id} a={a} />)}
        </div>
      )}
    </div>
  );
};

export default Scholarships;
