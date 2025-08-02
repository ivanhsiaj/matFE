import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Cuboid } from "lucide-react";

import LangToggle from "@/components/LangToggle";
import { useSelector, useDispatch } from "react-redux";
import {
  setShift,
  setEmployee,
  setMode,
  setFurnaceSize,
  clearAll,
} from "@/store/shiftSlice";
import { t } from "i18next";
export default function DischargePage() {
  const dispatch = useDispatch();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    selectedShift: shift,
    selectedEmployee: employee,
    furnaceSize,
    mode,
  } = useSelector((state) => state.shift);
  // const shift = searchParams.get("shift");
  // const employee = searchParams.get("employee");
  // const mode = searchParams.get("mode");
  // const furnaceSize = searchParams.get("furnaceSize");

  // const [furnaceSize, setFurnaceSize] = useState("big");
  const [selectedItem, setSelectedItem] = useState(null);
  const [weight, setWeight] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [possibleInputs, setPossibleInputs] = useState([]);
  const [preferredId, setPreferredId] = useState(null);
  const [selectedInputId, setSelectedInputId] = useState(null);

  useEffect(() => {
    if (!shift || !employee || !furnaceSize) {
      navigate("/employee/shift-selection");
    } else if (
      !["big", "small"].includes(furnaceSize) ||
      !["charge", "discharge"].includes(mode)
    ) {
      navigate("/employee/mode-selection");
    }
  }, [shift, employee, navigate]);

  const handleSelectItem = async (type) => {
    setSelectedItem(type);
    setWeight("");
    if (type === "sow") {
      // Fetch possible sow inputs immediately
      try {
        const res = await fetch(
          `${backendUrl}/api/discharge/possible-sows?furnaceSize=${furnaceSize}`
        );
        if (!res.ok) throw new Error("Failed to fetch sow inputs");
        const data = await res.json();
        setPossibleInputs(data.inputs);
        setPreferredId(data.preferred);
      } catch (err) {
        console.error(err);
        toast({
          title: "Error",
          description: "Failed to fetch sow inputs",
          variant: "destructive",
        });
      }
    }
  };

  const handleSubmitSteelSlag = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        shift,
        furnaceSize,
        employeeId: employee,
        itemType: selectedItem,
        weight: weight ? Number(weight) : undefined,
      };
      const res = await fetch(`${backendUrl}/api/discharge`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to submit discharge");
      toast({
        title: "Discharge saved!",
        description: `Type: ${selectedItem}`,
      });
      setSelectedItem(null);
      dispatch(setMode(""));
      dispatch(setFurnaceSize(""));
      navigate("/employee/mode-selection");
      setWeight("");
    } catch (err) {
      console.error(err);
      toast({
        title: "Submission failed",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitSow = async () => {
    if (!selectedInputId) {
      toast({ title: "Please select an input for Sow!" });
      return;
    }
    setIsSubmitting(true);
    try {
      const payload = {
        shift,
        furnaceSize,
        employeeId: employee,
        inputId: selectedInputId,
        weight: weight ? Number(weight) : undefined,
      };
      const res = await fetch(`${backendUrl}/api/discharge/sow`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to submit Sow");
      toast({
        title: "Sow Discharge saved!",
        description: `Linked to Material: ${selectedInputId}`,
      });
      setSelectedItem(null);
      setPossibleInputs([]);
      setSelectedInputId(null);
      dispatch(setMode(""));
      dispatch(setFurnaceSize(""));
      navigate("/employee/mode-selection");
    } catch (err) {
      console.error(err);
      toast({
        title: "Sow submission failed",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white px-4">
      <div className="container mx-auto max-w-4xl py-6">
        <div className="flex items-center justify-between flex-wrap">
          <Button
            variant="ghost"
            onClick={() => {
              dispatch(setMode(""));
              dispatch(setFurnaceSize(""));
              navigate("/employee/mode-selection");
            }}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("dischargeEntry.backToMode")}
          </Button>

          <div className="ml-auto">
            <LangToggle />
          </div>
        </div>

        <Card className="shadow-md">
          <CardHeader className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border-b border-gray-100 pb-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
              <CardTitle className="flex items-center gap-2 text-2xl">
                <div className="w-12 h-12 bg-blue-100 flex items-center justify-center rounded-xl p-1 rounded-full shadow-lg">
                  <Cuboid className="h-8 w-8 text-blue-600 " />
                </div>
                {t("dischargeEntry.title")}
              </CardTitle>
              <CardDescription className="text-lg mt-2 md:mt-0 text-center md:text-right">
                {t("dischargeEntry.Shift")}{" "}{shift[6]} | {employee.name} |{" "}
                <span
                  className={`px-2 py-1 rounded font-semibold text-white ${
                    furnaceSize.toUpperCase() === "BIG"
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                >
                  {furnaceSize.toUpperCase()} Furnace
                </span>
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 md:mt-4">
            {/* Selection Buttons */}
            <div className="flex flex-wrap justify-center gap-3">
              {["steel", "slag", "sow"].map((item) => (
                <Button
                  key={item}
                  onClick={() => handleSelectItem(item)}
                  variant={selectedItem === item ? "default" : "outline"}
                  className="min-w-[100px]"
                >
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </Button>
              ))}
            </div>

            {/* Input for Steel/Slag */}
            {selectedItem && selectedItem !== "sow" && (
              <div className="space-y-4">
                <Input
                  placeholder={t("dischargeEntry.optionalWeight")}
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                />
                <Button
                  disabled={isSubmitting}
                  onClick={handleSubmitSteelSlag}
                  className="w-full"
                >
                  {isSubmitting ? `${t("dischargeEntry.Submitting")}` : `${t("dischargeEntry.Submit")} ${selectedItem}`}
                </Button>
              </div>
            )}

            {/* Sow Input Section */}
            {selectedItem === "sow" && (
              <div className="space-y-4">
                {possibleInputs.length ? (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-500 text-center">
                      {t("dischargeEntry.selectSowInput")}
                    </p>

                    {possibleInputs.map((input) => (
                      <div
                        key={input._id}
                        onClick={() => setSelectedInputId(input._id)}
                        className={`cursor-pointer rounded-md p-4 transition-all border ${
                          input._id === preferredId
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200"
                        } ${
                          selectedInputId === input._id
                            ? "ring-2 ring-blue-400"
                            : ""
                        }`}
                      >
                        <p className="text-sm">
                          Emp: {input.employee.name} | {t("dischargeEntry.Weight")}:{" "}
                          {input.totalWeight} lbs|{" "}
                          {new Date(input.timestamp).toLocaleString()}
                        </p>
                      </div>
                    ))}

                    <Input
                      placeholder={t("dischargeEntry.optionalWeight")}
                      type="number"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                    />
                    <Button
                      disabled={isSubmitting}
                      onClick={handleSubmitSow}
                      className="w-full"
                    >
                      {isSubmitting ?  `${t("dischargeEntry.Submitting")}`:  `${t("dischargeEntry.ConfirmSow")}`}
                    </Button>
                  </div>
                ) : (
                  <p className="text-center text-sm text-gray-500">
                  {t("dischargeEntry.NoInputsow")}
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
