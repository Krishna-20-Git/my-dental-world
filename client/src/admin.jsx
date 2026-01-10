import { useState } from "react";
import axios from "axios";
import {
  Lock,
  Phone,
  Calendar,
  MapPin,
  CheckCircle,
  Filter,
  LogOut,
} from "lucide-react";

const API_BASE = "https://my-dental-api.onrender.com/api";

const BRANCH_NAMES = {
  1: "Doddanekundi",
  2: "Mahadevapura",
  3: "Whitefield",
  4: "Medahalli",
};

// Credential Mapping
const CREDENTIALS = {
  doctor123: "all", // Super Admin
  branch1: 1, // Doddanekundi Only
  branch2: 2, // Mahadevapura Only
  branch3: 3, // Whitefield Only
  branch4: 4, // Medahalli Only
};

function Admin() {
  const [key, setKey] = useState("");
  const [auth, setAuth] = useState(false);
  const [accessLevel, setAccessLevel] = useState(null); // 'all' or specific branch ID
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    const permission = CREDENTIALS[key];

    if (permission !== undefined) {
      setAuth(true);
      setAccessLevel(permission);
      // If specific branch user, lock the filter
      if (permission !== "all") {
        setSelectedBranch(permission);
        fetchBookings(permission);
      } else {
        fetchBookings("all");
      }
    } else {
      alert("Invalid Passkey");
    }
  };

  const fetchBookings = async (branchFilter) => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/appointments/admin`, {
        params: {
          key: key,
          branchId: branchFilter,
        },
      });
      setBookings(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Dropdown Change (Only for Super Admin)
  const handleFilterChange = (e) => {
    const newVal = e.target.value;
    setSelectedBranch(newVal);
    fetchBookings(newVal);
  };

  if (!auth)
    return (
      <div className="h-screen flex justify-center items-center bg-gray-100 font-sans">
        <div className="bg-white p-8 rounded-xl shadow-xl w-80 text-center border border-gray-200">
          <div className="bg-teal-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-teal-600">
            <Lock size={28} />
          </div>
          <h2 className="text-xl font-bold mb-2 text-gray-800">
            Clinic Portal
          </h2>
          <p className="text-gray-500 text-xs mb-6">
            Enter Branch ID or Master Key
          </p>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="Enter Key"
              className="border p-3 w-full rounded-lg mb-4 focus:ring-2 focus:ring-teal-500 outline-none transition"
              onChange={(e) => setKey(e.target.value)}
            />
            <button className="bg-teal-600 text-white w-full py-3 rounded-lg font-bold hover:bg-teal-700 transition">
              Access Dashboard
            </button>
          </form>
          <div className="mt-4 text-[10px] text-gray-400">
            Keys: doctor123 (All), branch1, branch2...
          </div>
        </div>
      </div>
    );

  return (
    <div className="p-6 md:p-10 bg-slate-50 min-h-screen font-sans">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              {accessLevel === "all"
                ? "Master Dashboard"
                : `${BRANCH_NAMES[accessLevel]} Dashboard`}
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Real-time appointment overview
            </p>
          </div>

          <div className="flex gap-3 items-center">
            {/* Show Filter Dropdown ONLY if Master Admin */}
            {accessLevel === "all" && (
              <div className="relative">
                <select
                  className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 pl-4 pr-10 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium cursor-pointer"
                  value={selectedBranch}
                  onChange={handleFilterChange}
                >
                  <option value="all">All Branches</option>
                  <option value="1">Doddanekundi</option>
                  <option value="2">Mahadevapura</option>
                  <option value="3">Whitefield</option>
                  <option value="4">Medahalli</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                  <Filter size={16} />
                </div>
              </div>
            )}

            <button
              onClick={() => fetchBookings(selectedBranch)}
              className="bg-white border border-gray-300 text-gray-600 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-50 transition font-medium"
            >
              Refresh
            </button>
            <button
              onClick={() => setAuth(false)}
              className="bg-red-50 text-red-600 px-3 py-2 rounded-lg hover:bg-red-100 transition"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="p-5 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Patient Name
                  </th>
                  <th className="p-5 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="p-5 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="p-5 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Branch
                  </th>
                  <th className="p-5 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {bookings.length > 0 ? (
                  bookings.map((b) => (
                    <tr
                      key={b._id}
                      className="hover:bg-teal-50/30 transition duration-150"
                    >
                      <td className="p-5 font-semibold text-slate-800 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-xs font-bold">
                          {b.patientName.charAt(0).toUpperCase()}
                        </div>
                        {b.patientName}
                      </td>
                      <td className="p-5">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-700 flex items-center gap-2">
                            <Calendar size={14} className="text-teal-500" />
                            {b.slotId?.date || "N/A"}
                          </span>
                          <span className="text-xs text-slate-500 ml-6">
                            {b.slotId?.time || "N/A"}
                          </span>
                        </div>
                      </td>
                      <td className="p-5 text-slate-600 font-medium">
                        <div className="flex items-center gap-2">
                          <Phone size={14} className="text-slate-400" />{" "}
                          {b.patientPhone}
                        </div>
                      </td>
                      <td className="p-5">
                        <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-100 px-2.5 py-1 rounded-md text-xs font-medium">
                          <MapPin size={12} />{" "}
                          {BRANCH_NAMES[b.slotId?.branchId] || "Unknown"}
                        </span>
                      </td>
                      <td className="p-5">
                        <span className="inline-flex items-center gap-1.5 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                          <CheckCircle size={12} /> Confirmed
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="p-10 text-center text-gray-400 flex flex-col items-center justify-center"
                    >
                      <Calendar size={48} className="mb-2 opacity-20" />
                      {loading
                        ? "Loading bookings..."
                        : "No bookings found for this selection."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;
