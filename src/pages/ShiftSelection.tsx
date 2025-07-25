
// import { useState, useEffect } from "react";
// import { useTranslation } from "react-i18next";
// import { useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { setShift, setEmployee } from "@/store/shiftSlice";
// import { ArrowLeft, Clock, User } from "lucide-react";

// import LangToggle from "@/components/LangToggle";

// const ShiftSelection = () => {
//   const backendUrl = import.meta.env.VITE_BACKEND_URL;
//   const { t } = useTranslation();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const selectedEmployee = useSelector(
//     (state) => state?.shift.selectedEmployee
//   );

//   const [currentShift, setCurrentShift] = useState("");
//   const [employeesByShift, setEmployeesByShift] = useState({
//     "Shift 1": [],
//     "Shift 2": [],
//     "Shift 3": [],
//   });

//   const now = new Date();
//   const currentHour = now.getHours();

//   const shifts = [
//     {
//       id: "Shift 1",
//       name: t("shiftSelection.shift1"),
//       time: t("shiftSelection.shift1Time"),
//       available: currentHour >= 5 && currentHour < 13,
//     },
//     {
//       id: "Shift 2",
//       name: t("shiftSelection.shift2"),
//       time: t("shiftSelection.shift2Time"),
//       available: currentHour >= 13 && currentHour < 21,
//     },
//     {
//       id: "Shift 3",
//       name: t("shiftSelection.shift3"),
//       time: t("shiftSelection.shift3Time"),
//       available: currentHour >= 21 || currentHour < 5,
//     },
//   ];

//   useEffect(() => {
//     const fetchEmployees = async () => {
//       try {
//         const response = await fetch(
//           `${backendUrl}/api/materials/employees`
//         );
//         const data = await response.json();
//         const grouped = {
//           "Shift 1": data.filter((emp) => emp.shiftAssigned === "Shift 1"),
//           "Shift 2": data.filter((emp) => emp.shiftAssigned === "Shift 2"),
//           "Shift 3": data.filter((emp) => emp.shiftAssigned === "Shift 3"),
//         };
//         setEmployeesByShift(grouped);
//       } catch (err) {
//         console.error("Failed to fetch employees", err);
//       }
//     };
//     fetchEmployees();
//   }, []);

//   const handleShiftSelect = (shift) => {
//     dispatch(setShift(shift.id));
//     dispatch(setEmployee(null));
//     setCurrentShift(shift.id);
//   };

//   const handleEmployeeSelect = (emp) => {
//     dispatch(setEmployee(emp));
//   };

//   const handleContinue = () => {
//     if (currentShift && selectedEmployee) {
//       navigate(
//         `/employee/material-entry?shift=${currentShift}&employee=${selectedEmployee._id}`
//       );
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-2">
//       <div className="max-w-4xl mx-auto mt-3">
//         {/* Back Button */}
//         <div className="flex justify-between items-center">
//           <button
//             onClick={() => navigate("/")}
//             className="flex items-center text-gray-600 hover:text-gray-800 mb-6 cursor-pointer"
//           >
//             <ArrowLeft className="h-5 w-5 mr-2" />{" "}
//             {t("shiftSelection.backToHome")}
//           </button>
//           <span className="ml-auto mr-4">
//             <LangToggle />
//           </span>
//         </div>
//         <div className="text-center mb-3">
//           <h1 className="text-2xl md:text-xl font-bold text-gray-900 mb-2">
//             {t("shiftSelection.selectYourShift")}
//           </h1>
//           <p className="text-gray-600 text-xs">
//             {t("shiftSelection.chooseShift")}
//           </p>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           {/* Shift Selection */}
//           <div className="space-y-4 w-fit">
//             <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-7">
//               <div className="flex items-center mb-4">
//                 <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
//                   <Clock className="text-blue-600" />
//                 </div>
//                 <div>
//                   <h2 className="text-sm font-bold text-gray-900">
//                     {t("shiftSelection.selectYourShift")}
//                   </h2>
//                   <p className="text-gray-600 text-xs">
//                     {t("shiftSelection.chooseShift")}
//                   </p>
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 {shifts.map((shift) => (
//                   <button
//                     key={shift.id}
//                     onClick={() => shift.available && handleShiftSelect(shift)}
//                     disabled={!shift.available}
//                     className={`w-full p-2.5 rounded-xl border-2 transition-all duration-200 text-left ${
//                       currentShift === shift.id
//                         ? "border-blue-500 bg-blue-50 shadow-md"
//                         : shift.available
//                         ? "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50"
//                         : "border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed"
//                     }`}
//                   >
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <div
//                           className={`font-semibold text-sm ${
//                             currentShift === shift.id
//                               ? "text-blue-700"
//                               : "text-gray-900"
//                           }`}
//                         >
//                           {shift.name}
//                         </div>
//                         <div className="text-xs text-gray-500">
//                           {shift.time}
//                         </div>
//                       </div>
//                       <div
//                         className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
//                           currentShift === shift.id
//                             ? "border-blue-500 bg-blue-500"
//                             : "border-gray-300"
//                         }`}
//                       >
//                         {currentShift === shift.id && (
//                           <svg
//                             className="w-3 h-3 text-white"
//                             fill="none"
//                             stroke="currentColor"
//                             strokeWidth={2}
//                             viewBox="0 0 24 24"
//                           >
//                             <path
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               d="M5 13l4 4L19 7"
//                             />
//                           </svg>
//                         )}
//                       </div>
//                     </div>
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {currentShift && (
//               <div className="border-gray-200 border-blue-300 bg-orange-200 rounded-2xl shadow-lg p-4 text-black">
//                 <div className="flex items-center mb-3">
//                   <Clock className="h-5 w-5 mr-2 text-orange-500" />
//                   <h3 className="text-sm font-semibold text-orange-500">
//                     {t("shiftSelection.shiftInfo")}
//                   </h3>
//                 </div>
//                 <p className="text-orange-500 text-xs">
//                   {t("shiftSelection.youSelected")}{" "}
//                   {shifts.find((s) => s.id === currentShift)?.name}.{" "}
//                   {t("shiftSelection.chooseNameBelow")}
//                 </p>
//               </div>
//             )}
//           </div>

//           {/* Employee Selection */}
//           <div className="space-y-4">
//             {currentShift ? (
//               <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-6">
//                 <div className="flex items-center mb-4">
//                   <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4">
//                     <User className="text-green-600" />
//                   </div>
//                   <div>
//                     <h2 className="text-sm font-bold text-gray-900">
//                       {t("shiftSelection.chooseEmployee")}
//                     </h2>
//                     <p className="text-gray-600 text-xs">
//                        {t("shiftSelection.selectYourName")}
//                     </p>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                   {employeesByShift[currentShift].map((emp) => (
//                     <button
//                       key={emp._id}
//                       onClick={() => handleEmployeeSelect(emp)}
//                       className={`p-4 rounded-xl border-2 transition-all duration-200 flex items-center ${
//                         selectedEmployee?._id === emp._id
//                           ? "border-green-500 bg-green-50 shadow-md"
//                           : "border-gray-200 bg-white hover:border-green-300 hover:bg-green-50"
//                       }`}
//                     >
//                       <User
//                         className={`h-5 w-5 mr-3 ${
//                           selectedEmployee?._id === emp._id
//                             ? "text-green-700"
//                             : "text-gray-600"
//                         }`}
//                       />
//                       <span
//                         className={`font-semibold text-sm ${
//                           selectedEmployee?._id === emp._id
//                             ? "text-green-700"
//                             : "text-gray-900"
//                         }`}
//                       >
//                         {emp.name}
//                       </span>
//                     </button>
//                   ))}
//                 </div>
//                 <div className="mt-3 grid grid-cols-1">
//                   <button
//                     onClick={handleContinue}
//                     disabled={!currentShift || !selectedEmployee}
//                     className={`px-4 py-2 rounded-xl font-semibold text-lg transition-all duration-200 ${
//                       currentShift && selectedEmployee
//                         ? "bg-white text-sm shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
//                         : "bg-gray-200 text-sm text-gray-500 cursor-not-allowed"
//                     }`}
//                   >
//                     {t("shiftSelection.continue")}
//                   </button>
//                 </div>
//               </div>
//             ) : (
//               <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center">
//                 <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                   <User className="h-8 w-8 text-gray-400" />
//                 </div>
//                 <h3 className="text-sm font-semibold text-gray-400 mb-2">
//                   {t("shiftSelection.selectShiftFirst")}
//                 </h3>
//                 <p className="text-gray-600 text-sm">
//                   {t("shiftSelection.chooseShiftToSeeEmployees")}
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ShiftSelection;
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setShift, setEmployee } from "@/store/shiftSlice";
import { ArrowLeft, Clock, User, Zap, RefreshCcw } from "lucide-react";

import LangToggle from "@/components/LangToggle";

const ShiftSelection = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const selectedEmployee = useSelector(
    (state) => state?.shift.selectedEmployee
  );

  const [currentShift, setCurrentShift] = useState("");
  const [employeesByShift, setEmployeesByShift] = useState({
    "Shift 1": [],
    "Shift 2": [],
    "Shift 3": [],
  });

  // const [mode, setMode] = useState(""); // 👈 Charge or Discharge

  const now = new Date();
  const currentHour = now.getHours();

  const shifts = [
    {
      id: "Shift 1",
      name: t("shiftSelection.shift1"),
      time: t("shiftSelection.shift1Time"),
      available: currentHour >= 5 && currentHour < 13,
    },
    {
      id: "Shift 2",
      name: t("shiftSelection.shift2"),
      time: t("shiftSelection.shift2Time"),
      available: currentHour >= 13 && currentHour < 21,
    },
    {
      id: "Shift 3",
      name: t("shiftSelection.shift3"),
      time: t("shiftSelection.shift3Time"),
      available: currentHour >= 21 || currentHour < 5,
    },
  ];

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch(
          `${backendUrl}/api/materials/employees`
        );
        const data = await response.json();
        const grouped = {
          "Shift 1": data.filter((emp) => emp.shiftAssigned === "Shift 1"),
          "Shift 2": data.filter((emp) => emp.shiftAssigned === "Shift 2"),
          "Shift 3": data.filter((emp) => emp.shiftAssigned === "Shift 3"),
        };
        setEmployeesByShift(grouped);
      } catch (err) {
        console.error("Failed to fetch employees", err);
      }
    };
    fetchEmployees();
  }, []);

  const handleShiftSelect = (shift) => {
    dispatch(setShift(shift.id));
    dispatch(setEmployee(null));
    setCurrentShift(shift.id);
    // setMode(""); // Reset mode on new shift
  };

  const handleEmployeeSelect = (emp) => {
    dispatch(setEmployee(emp));
  };

  // const handleModeSelect = (value) => {
  //   setMode(value);
  // };

  const handleContinue = () => {
    if (currentShift && selectedEmployee) {
      // 👇 Pass mode in query too
      navigate(
        `/employee/mode-selection?shift=${currentShift}&employee=${selectedEmployee._id}`
      );
    }
    // else if( currentShift && selectedEmployee ) {
    //   navigate(
    //     `/employee/discharge/material-entry?shift=${currentShift}&employee=${selectedEmployee._id}&mode=${mode}`
    //   );

    // }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-2">
      <div className="max-w-4xl mx-auto mt-3">
        {/* Back Button */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => navigate("/")}
            className="flex items-center text-gray-600 hover:text-gray-800 mb-6 cursor-pointer"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            {t("shiftSelection.backToHome")}
          </button>
          <span className="ml-auto mr-4">
            <LangToggle />
          </span>
        </div>

        <div className="text-center mb-3">
          <h1 className="text-2xl md:text-xl font-bold text-gray-900 mb-2">
            {t("shiftSelection.selectYourShift")}
          </h1>
          <p className="text-gray-600 text-xs">
            {t("shiftSelection.chooseShift")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Shift Selection */}
          <div className="space-y-4 w-fit">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-7">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                  <Clock className="text-blue-600" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-gray-900">
                    {t("shiftSelection.selectYourShift")}
                  </h2>
                  <p className="text-gray-600 text-xs">
                    {t("shiftSelection.chooseShift")}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                {shifts.map((shift) => (
                  <button
                    key={shift.id}
                    onClick={() => shift.available && handleShiftSelect(shift)}
                    disabled={!shift.available}
                    className={`w-full p-2.5 rounded-xl border-2 transition-all duration-200 text-left ${
                      currentShift === shift.id
                        ? "border-blue-500 bg-blue-50 shadow-md"
                        : shift.available
                        ? "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50"
                        : "border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div
                          className={`font-semibold text-sm ${
                            currentShift === shift.id
                              ? "text-blue-700"
                              : "text-gray-900"
                          }`}
                        >
                          {shift.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {shift.time}
                        </div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          currentShift === shift.id
                            ? "border-blue-500 bg-blue-500"
                            : "border-gray-300"
                        }`}
                      >
                        {currentShift === shift.id && (
                          <svg
                            className="w-3 h-3 text-white"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Employee + Mode Selection */}
          <div className="space-y-4">
            {currentShift ? (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                    <User className="text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-gray-900">
                      {t("shiftSelection.chooseEmployee")}
                    </h2>
                    <p className="text-gray-600 text-xs">
                      {t("shiftSelection.selectYourName")}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {employeesByShift[currentShift].map((emp) => (
                    <button
                      key={emp._id}
                      onClick={() => handleEmployeeSelect(emp)}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 flex items-center ${
                        selectedEmployee?._id === emp._id
                          ? "border-green-500 bg-green-50 shadow-md"
                          : "border-gray-200 bg-white hover:border-green-300 hover:bg-green-50"
                      }`}
                    >
                      <User
                        className={`h-5 w-5 mr-3 ${
                          selectedEmployee?._id === emp._id
                            ? "text-green-700"
                            : "text-gray-600"
                        }`}
                      />
                      <span
                        className={`font-semibold text-sm ${
                          selectedEmployee?._id === emp._id
                            ? "text-green-700"
                            : "text-gray-900"
                        }`}
                      >
                        {emp.name}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Charge/Discharge toggle
                <div className="mt-5">
                  <h3 className="text-sm font-semibold mb-2">
                    Select Operation:
                  </h3>
                  <div className="flex gap-4">
                    <button
                      onClick={() => handleModeSelect("charge")}
                      disabled={!selectedEmployee}
                      className={`flex items-center px-4 py-2 rounded-xl border-2 transition-all ${
                        mode === "charge"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50"
                      } ${!selectedEmployee && "opacity-50 cursor-not-allowed"}`}
                    >
                      <Zap className="w-4 h-4 mr-2" /> Charge
                    </button>

                    <button
                      onClick={() => handleModeSelect("discharge")}
                      disabled={!selectedEmployee}
                      className={`flex items-center px-4 py-2 rounded-xl border-2 transition-all ${
                        mode === "discharge"
                          ? "border-orange-500 bg-orange-50"
                          : "border-gray-200 bg-white hover:border-orange-300 hover:bg-orange-50"
                      } ${!selectedEmployee && "opacity-50 cursor-not-allowed"}`}
                    >
                      <RefreshCcw className="w-4 h-4 mr-2" /> Discharge
                    </button>
                  </div>
                </div> */}

                <div className="mt-5 grid grid-cols-1">
                  <button
                    onClick={handleContinue}
                    disabled={!currentShift || !selectedEmployee}
                    className={`px-4 py-2 rounded-xl font-semibold text-lg transition-all duration-200 ${
                      currentShift && selectedEmployee 
                        ? "bg-green-500 text-white hover:bg-green-600"
                        : "bg-gray-200 text-sm text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {t("shiftSelection.continue")}
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-sm font-semibold text-gray-400 mb-2">
                  {t("shiftSelection.selectShiftFirst")}
                </h3>
                <p className="text-gray-600 text-sm">
                  {t("shiftSelection.chooseShiftToSeeEmployees")}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShiftSelection;
