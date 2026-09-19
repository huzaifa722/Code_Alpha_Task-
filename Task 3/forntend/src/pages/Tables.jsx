// import { useEffect, useState } from "react";
// import { getTables, createReservation } from "../api/client";
// import { useCart } from "../context/CartContext";

// export default function Tables() {
//   const [tables, setTables] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const { table: selectedTable, setTable } = useCart();

//   const [reserveForm, setReserveForm] = useState(null); // holds table being reserved
//   const [form, setForm] = useState({ customerName: "", customerPhone: "", guests: 2, reservationDate: "", reservationTime: "" });
//   const [submitting, setSubmitting] = useState(false);

//   const load = () => {
//     setLoading(true);
//     getTables()
//       .then(setTables)
//       .catch((err) => setError(err.message))
//       .finally(() => setLoading(false));
//   };

//   useEffect(load, []);

//   const openReserve = (table) => {
//     setReserveForm(table);
//     setSuccess("");
//     setError("");
//   };

//   const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

//   const handleReserve = async (e) => {
//     e.preventDefault();
//     setSubmitting(true);
//     setError("");
//     try {
//       await createReservation({ ...form, table: reserveForm._id, guests: Number(form.guests) });
//       setSuccess(`Table ${reserveForm.tableNumber} reserved.`);
//       setReserveForm(null);
//       load();
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div>
//       <div className="page-header">
//         <p className="page-eyebrow">Seating</p>
//         <h1 className="page-title">Pick a table for dine-in, or reserve ahead.</h1>
//         <p className="page-sub">
//           Selecting a table here attaches it to your next order. Reserve a table instead if
//           you're booking for later.
//         </p>
//       </div>

//       {success && <div className="form-success">{success}</div>}
//       {error && !reserveForm && <div className="form-error">{error}</div>}
//       {loading && <div className="loading-state">Loading tables…</div>}

//       <div className="tables-grid">
//         {tables.map((t) => (
//           <div
//             key={t._id}
//             className={`table-chip ${selectedTable?._id === t._id ? "selected" : ""}`}
//             onClick={() => t.status === "available" && setTable(t)}
//           >
//             <div className="table-number">#{t.tableNumber}</div>
//             <div className="table-capacity">Seats {t.capacity}</div>
//             <span className={`table-status ${t.status}`}>{t.status}</span>
//             {t.status !== "available" && (
//               <div style={{ marginTop: 10 }}>
//                 <button
//                   className="btn-link"
//                   style={{ color: "var(--brass)" }}
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     openReserve(t);
//                   }}
//                 >
//                   Reserve later
//                 </button>
//               </div>
//             )}
//             {t.status === "available" && (
//               <div style={{ marginTop: 10 }}>
//                 <button
//                   className="btn-link"
//                   style={{ color: "var(--brass)" }}
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     openReserve(t);
//                   }}
//                 >
//                   Reserve
//                 </button>
//               </div>
//             )}
//           </div>
//         ))}
//       </div>

//       {reserveForm && (
//         <div className="form-card" style={{ marginTop: 32 }}>
//           <h2 style={{ fontFamily: "var(--font-display)", marginTop: 0 }}>
//             Reserve table #{reserveForm.tableNumber}
//           </h2>

//           {error && <div className="form-error">{error}</div>}

//           <form onSubmit={handleReserve}>
//             <div className="field">
//               <label>Your name</label>
//               <input name="customerName" value={form.customerName} onChange={handleChange} required />
//             </div>
//             <div className="field">
//               <label>Phone</label>
//               <input name="customerPhone" value={form.customerPhone} onChange={handleChange} required />
//             </div>
//             <div className="field-row">
//               <div className="field">
//                 <label>Date</label>
//                 <input
//                   type="date"
//                   name="reservationDate"
//                   value={form.reservationDate}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>
//               <div className="field">
//                 <label>Time</label>
//                 <input
//                   type="time"
//                   name="reservationTime"
//                   value={form.reservationTime}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>
//             </div>
//             <div className="field">
//               <label>Guests</label>
//               <input
//                 type="number"
//                 name="guests"
//                 min={1}
//                 value={form.guests}
//                 onChange={handleChange}
//                 required
//               />
//             </div>
//             <div style={{ display: "flex", gap: 10 }}>
//               <button className="btn btn-primary" disabled={submitting}>
//                 {submitting ? "Reserving…" : "Confirm reservation"}
//               </button>
//               <button type="button" className="btn btn-ghost" onClick={() => setReserveForm(null)}>
//                 Cancel
//               </button>
//             </div>
//           </form>
//         </div>
//       )}
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import { getTables, createReservation } from "../api/client";
import { useCart } from "../context/CartContext";

export default function Tables() {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { table: selectedTable, setTable } = useCart();

  const [reserveForm, setReserveForm] = useState(null); // holds table being reserved
  const [form, setForm] = useState({ customerName: "", customerPhone: "", guests: 2, reservationDate: "", reservationTime: "" });
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    setLoading(true);
    getTables()
      .then(setTables)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openReserve = (table) => {
    setReserveForm(table);
    setSuccess("");
    setError("");
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleReserve = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await createReservation({ ...form, table: reserveForm._id, guests: Number(form.guests) });
      setSuccess(`Table ${reserveForm.tableNumber} reserved.`);
      setReserveForm(null);
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <p className="page-eyebrow">Seating</p>
        <h1 className="page-title">Pick a table for dine-in, or reserve ahead.</h1>
        <p className="page-sub">
          Selecting a table here attaches it to your next order. Reserve a table instead if
          you're booking for later.
        </p>
      </div>

      {success && <div className="form-success">{success}</div>}
      {error && !reserveForm && <div className="form-error">{error}</div>}
      {loading && <div className="loading-state">Loading tables…</div>}

      <div className="tables-grid">
        {tables.map((t) => (
          <div
            key={t._id}
            className={`table-chip ${selectedTable?._id === t._id ? "selected" : ""}`}
            onClick={() => t.status === "available" && setTable(t)}
          >
            <div className="table-number">#{t.tableNumber}</div>
            <div className="table-capacity">Seats {t.capacity}</div>
            <span className={`table-status ${t.status}`}>{t.status}</span>
            {t.status !== "available" && (
              <div style={{ marginTop: 10 }}>
                <button
                  className="btn-link"
                  style={{ color: "var(--brass)" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    openReserve(t);
                  }}
                >
                  Reserve later
                </button>
              </div>
            )}
            {t.status === "available" && (
              <div style={{ marginTop: 10 }}>
                <button
                  className="btn-link"
                  style={{ color: "var(--brass)" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    openReserve(t);
                  }}
                >
                  Reserve
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {reserveForm && (
        <div className="form-card" style={{ marginTop: 32 }}>
          <h2 style={{ fontFamily: "var(--font-display)", marginTop: 0 }}>
            Reserve table #{reserveForm.tableNumber}
          </h2>

          {error && <div className="form-error">{error}</div>}

          <form onSubmit={handleReserve}>
            <div className="field">
              <label>Your name</label>
              <input name="customerName" value={form.customerName} onChange={handleChange} required />
            </div>
            <div className="field">
              <label>Phone</label>
              <input name="customerPhone" value={form.customerPhone} onChange={handleChange} required />
            </div>
            <div className="field-row">
              <div className="field">
                <label>Date</label>
                <input
                  type="date"
                  name="reservationDate"
                  value={form.reservationDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="field">
                <label>Time</label>
                <input
                  type="time"
                  name="reservationTime"
                  value={form.reservationTime}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="field">
              <label>Guests</label>
              <input
                type="number"
                name="guests"
                min={1}
                value={form.guests}
                onChange={handleChange}
                required
              />
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn btn-primary" disabled={submitting}>
                {submitting ? "Reserving…" : "Confirm reservation"}
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => setReserveForm(null)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}