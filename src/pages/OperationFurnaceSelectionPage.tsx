import { useSearchParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import LangToggle from "@/components/LangToggle";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useSelector, useDispatch } from "react-redux";
import {
  setShift,
  setEmployee,
  setMode,
  setFurnaceSize,
  clearAll,
} from "@/store/shiftSlice";

export default function OperationFurnaceSelection() {
  const { selectedShift, selectedEmployee } = useSelector(
    (state) => state.shift
  );
  const dispatch = useDispatch();
  const shift = selectedShift;
  const employee = selectedEmployee;

  const [mode, setModeLocal] = useState("");
  const [furnaceSize, setFurnaceSizeLocal] = useState("");
  const navigate = useNavigate();

  //   const handleContinue = () => {
  //     if (!mode || !furnaceSize) return;
  //     if (mode === "charge") {
  //       navigate(
  //         `/employee/material-entry?shift=${shift}&employee=${employee}&mode=${mode}&furnaceSize=${furnaceSize}`
  //       );
  //     } else {
  //       navigate(
  //         `/employee/discharge/material-entry?shift=${shift}&employee=${employee}&mode=${mode}&furnaceSize=${furnaceSize}`
  //       );
  //     }
  //   };
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-5xl mx-auto p-6">
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
            Back to Shift Selection
          </Button>

          <span className="ml-auto mr-4">
            <LangToggle />
          </span>
        </div>
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-center text-xl">
             <span className="game-icons--furnace">
                    </span> Mode Selection | {shift} - {employee.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <h1 className="text-xl font-bold mb-4">
                Select Mode
            </h1>
            <div className="flex gap-4 mb-6">
              <Button
                variant={mode === "charge" ? "default" : "outline"}
                onClick={() => setModeLocal("charge")}
              >
                Charge
              </Button>
              <Button
                variant={mode === "discharge" ? "default" : "outline"}
                onClick={() => setModeLocal("discharge")}
              >
                Discharge
              </Button>
            </div>

            <h1 className="text-xl font-bold mb-4">
            Select Furnace Size</h1>
            <div className="flex gap-4 mb-6">
              <Button
                variant={furnaceSize === "big" ? "default" : "outline"}
                onClick={() => setFurnaceSizeLocal("big")}
              >
                Big Furnace
              </Button>
              <Button
                variant={furnaceSize === "small" ? "default" : "outline"}
                onClick={() => setFurnaceSizeLocal("small")}
              >
                Small Furnace
              </Button>
            </div>

            <Button disabled={!mode || !furnaceSize} onClick={handleContinue}>
              Continue
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
