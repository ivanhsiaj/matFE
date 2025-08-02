// import { useSearchParams, useNavigate } from "react-router-dom";
// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { ArrowLeft } from "lucide-react";
// import LangToggle from "@/components/LangToggle";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { useSelector, useDispatch } from "react-redux";
// import {
//   setShift,
//   setEmployee,
//   setMode,
//   setFurnaceSize,
//   clearAll,
// } from "@/store/shiftSlice";

// export default function OperationFurnaceSelection() {
//   const { selectedShift, selectedEmployee } = useSelector(
//     (state) => state.shift
//   );
//   const dispatch = useDispatch();
//   const shift = selectedShift;
//   const employee = selectedEmployee;

//   const [mode, setModeLocal] = useState("");
//   const [furnaceSize, setFurnaceSizeLocal] = useState("");
//   const navigate = useNavigate();

//   //   const handleContinue = () => {
//   //     if (!mode || !furnaceSize) return;
//   //     if (mode === "charge") {
//   //       navigate(
//   //         `/employee/material-entry?shift=${shift}&employee=${employee}&mode=${mode}&furnaceSize=${furnaceSize}`
//   //       );
//   //     } else {
//   //       navigate(
//   //         `/employee/discharge/material-entry?shift=${shift}&employee=${employee}&mode=${mode}&furnaceSize=${furnaceSize}`
//   //       );
//   //     }
//   //   };
//   const handleContinue = () => {
//     if (!mode || !furnaceSize) return;

//     dispatch(setShift(shift));
//     dispatch(setEmployee(employee));
//     dispatch(setMode(mode));
//     dispatch(setFurnaceSize(furnaceSize));

//     if (mode === "charge") {
//       navigate(`/employee/material-entry`);
//     } else {
//       navigate(`/employee/discharge/material-entry`);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
//       <div className="max-w-5xl mx-auto p-6">
//         <div className="flex justify-between items-center">
//           <Button
//             variant="ghost"
//             onClick={() => {
//               dispatch(clearAll());
//               navigate("/employee/shift-selection");
//             }}
//             className="mb-6 mt-4"
//           >
//             <ArrowLeft className="h-4 w-4 mr-2" />
//             Back to Shift Selection
//           </Button>

//           <span className="ml-auto mr-4">
//             <LangToggle />
//           </span>
//         </div>
//         <Card className="bg-white shadow-lg">
//           <CardHeader>
//             <CardTitle className="text-center text-xl">
//              <span className="game-icons--furnace">
//                     </span> Mode Selection | {shift} - {employee.name}
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-6">
//             <h1 className="text-xl font-bold mb-4">
//                 Select Mode
//             </h1>
//             <div className="flex gap-4 mb-6">
//               <Button
//                 variant={mode === "charge" ? "default" : "outline"}
//                 onClick={() => setModeLocal("charge")}
//               >
//                 Charge
//               </Button>
//               <Button
//                 variant={mode === "discharge" ? "default" : "outline"}
//                 onClick={() => setModeLocal("discharge")}
//               >
//                 Discharge
//               </Button>
//             </div>

//             <h1 className="text-xl font-bold mb-4">
//             Select Furnace Size</h1>
//             <div className="flex gap-4 mb-6">
//               <Button
//                 variant={furnaceSize === "big" ? "default" : "outline"}
//                 onClick={() => setFurnaceSizeLocal("big")}
//               >
//                 Big Furnace
//               </Button>
//               <Button
//                 variant={furnaceSize === "small" ? "default" : "outline"}
//                 onClick={() => setFurnaceSizeLocal("small")}
//               >
//                 Small Furnace
//               </Button>
//             </div>

//             <Button disabled={!mode || !furnaceSize} onClick={handleContinue}>
//               Continue
//             </Button>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }
import { useTranslation } from "react-i18next";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Flame, Factory, Zap, Settings2 } from "lucide-react";
import LangToggle from "@/components/LangToggle";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { useSelector, useDispatch } from "react-redux";
import {
  setShift,
  setEmployee,
  setMode,
  setFurnaceSize,
  clearAll,
} from "@/store/shiftSlice";

export default function OperationFurnaceSelection() {
  const { t } = useTranslation();
  const { selectedShift, selectedEmployee } = useSelector(
    (state: any) => state.shift
  );
  const dispatch = useDispatch();
  const shift = selectedShift;
  const employee = selectedEmployee;

  const [mode, setModeLocal] = useState("");
  const [furnaceSize, setFurnaceSizeLocal] = useState("");
  const navigate = useNavigate();

  
  const handleContinue = () => {
    if (!mode || !furnaceSize) return;

    dispatch(setShift(shift));
    dispatch(setEmployee(employee));
    dispatch(setMode(mode));
    dispatch(setFurnaceSize(furnaceSize));

    if (mode === "charge") {
      navigate(`/employee/material-entry`);
    } else {
      navigate(`/employee/discharge/material-entry`);
    }
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        {/* <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-200/30 to-transparent animate-pulse"></div> */}
      </div>

      <div className="max-w-6xl mx-auto p-6 relative z-10">
        {/* Header */}
        <div className="flex justify-between items-center">
          <Button
            variant="ghost"
            onClick={() => {
              dispatch(clearAll());
              navigate("/employee/shift-selection");
            }}
            className="mb-6 mt-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("OperationFurnaceSelection.back")}
          </Button>

          <span className="ml-auto mr-4">
            <LangToggle />
          </span>
        </div>

        {/* Main Card */}
        <Card className="bg-white/90 backdrop-blur-xl border-gray-200 shadow-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border-b border-gray-100 md:flex-row flex items-center justify-between gap-4">
            {/* Left: Icon + Title */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 flex items-center justify-center rounded-xl p-1 rounded-full shadow-lg">
                <Flame className="h-8 w-8 text-orange-600 " />
              </div>
              <CardTitle className="text-2xl text-gray-800 font-bold">
                {t("OperationFurnaceSelection.title")}
              </CardTitle>
            </div>

            {/* Right: Description */}
            <CardDescription className="text-gray-600 text-lg">
              {shift} - {employee.name}
            </CardDescription>
          </CardHeader>

          <CardContent className="p-8 space-y-8">
            {/* Mode Selection Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <Settings2 className="h-6 w-6 text-blue-600" />
                <h2 className="text-xl font-bold text-gray-800">
                  {t("OperationFurnaceSelection.operation_mode")}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  onClick={() => setModeLocal("charge")}
                  className={`group cursor-pointer transition-all duration-300 ${
                    mode === "charge"
                      ? "bg-gradient-to-br from-green-50 to-emerald-100 border-green-400 shadow-lg shadow-green-500/20"
                      : "bg-white/60 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                  } border-2 rounded-xl p-6 backdrop-blur-sm`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-3 rounded-full ${
                        mode === "charge" ? "bg-green-500" : "bg-white/10"
                      } transition-colors duration-300`}
                    >
                      <Zap className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">
                        {t("OperationFurnaceSelection.charge")}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {t("OperationFurnaceSelection.charge_desc")}
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  onClick={() => setModeLocal("discharge")}
                  className={`group cursor-pointer transition-all duration-300 ${
                    mode === "discharge"
                      ? "bg-gradient-to-br from-orange-50 to-red-100 border-orange-400 shadow-lg shadow-orange-500/20"
                      : "bg-white/60 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                  } border-2 rounded-xl p-6 backdrop-blur-sm`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-3 rounded-full ${
                        mode === "discharge" ? "bg-orange-500" : "bg-white/10"
                      } transition-colors duration-300`}
                    >
                      <Factory className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">
                        {t("OperationFurnaceSelection.discharge")}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {t("OperationFurnaceSelection.discharge_desc")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Furnace Size Selection */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <Flame className="h-6 w-6 text-orange-500" />
                <h2 className="text-xl font-bold text-gray-800">
                  {t("OperationFurnaceSelection.furnace_size")}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  onClick={() => setFurnaceSizeLocal("big")}
                  className={`group cursor-pointer transition-all duration-300 ${
                    furnaceSize === "big"
                      ? "bg-gradient-to-br from-purple-50 to-violet-100 border-purple-400 shadow-lg shadow-purple-500/20"
                      : "bg-white/60 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                  } border-2 rounded-xl p-6 backdrop-blur-sm`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-3 rounded-full ${
                        furnaceSize === "big" ? "bg-purple-500" : "bg-white/10"
                      } transition-colors duration-300`}
                    >
                      <Factory className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">
                        {t("OperationFurnaceSelection.big_furnace")}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {t("OperationFurnaceSelection.big_furnace_desc")}
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  onClick={() => setFurnaceSizeLocal("small")}
                  className={`group cursor-pointer transition-all duration-300 ${
                    furnaceSize === "small"
                      ? "bg-gradient-to-br from-cyan-50 to-blue-100 border-cyan-400 shadow-lg shadow-cyan-500/20"
                      : "bg-white/60 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                  } border-2 rounded-xl p-6 backdrop-blur-sm`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-3 rounded-full ${
                        furnaceSize === "small" ? "bg-cyan-500" : "bg-white/10"
                      } transition-colors duration-300`}
                    >
                      <Factory className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">
                        {t("OperationFurnaceSelection.small_furnace")}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {t("OperationFurnaceSelection.small_furnace_desc")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Continue Button */}
            <div className="pt-6">
              <Button
                disabled={!mode || !furnaceSize}
                onClick={handleContinue}
                className={`w-full py-4 text-lg font-semibold transition-all duration-300 ${
                  !mode || !furnaceSize
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl"
                }`}
              >
                {!mode || !furnaceSize
                  ? `${t("OperationFurnaceSelection.select_options")}`
                  :  `${t("OperationFurnaceSelection.continue_button")}`}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
