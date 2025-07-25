import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent,CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft,Cuboid } from "lucide-react";

import LangToggle from "@/components/LangToggle";
import { useSelector, useDispatch } from "react-redux";
import {
  setShift,
  setEmployee,
  setMode,
  setFurnaceSize,
  clearAll,
} from "@/store/shiftSlice";
export default function DischargePage() {
  const dispatch = useDispatch();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { selectedShift: shift, selectedEmployee: employee, furnaceSize,mode } =
    useSelector((state) => state.shift);
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
    if (!shift || !employee || !furnaceSize ) {
      navigate("/employee/shift-selection");
    }else if(!["big", "small"].includes(furnaceSize) || !["charge", "discharge"].includes(mode)) {
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
      setWeight("");
      navigate("/employee/mode-selection");
      dispatch(setMode(""));
      dispatch(setFurnaceSize(""));
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
      navigate("/employee/mode-selection");
      dispatch(setMode(""));
      dispatch(setFurnaceSize(""));
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto max-w-4xl py-6">
        <div className="flex justify-between items-center">
          <Button
            variant="ghost"
            onClick={() => {
              dispatch(setMode(""));
              dispatch(setFurnaceSize(""));
              navigate("/employee/mode-selection");
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
        <Card>
          <CardHeader>
            <div className="block mb-4 justify-start items-center md:flex">
              <CardTitle className="flex text-2xl items-center">
                <Cuboid className="h-12 w-12 text-primary" />
                Discharge
              </CardTitle>
              <CardDescription className="text-center text-lg ml-0 md:ml-auto mr-2 ">
                {shift} | {employee.name} |{" "}
                <span
                  className={
                    furnaceSize.toUpperCase() === "BIG"
                      ? "bg-green-400 font-semibold text-white px-2 py-1 rounded whitespace-nowrap" 
                      : "bg-red-400 font-semibold text-white px-2 py-1 rounded whitespace-nowrap"
                  }
                >
                  {furnaceSize.toUpperCase()} Furnace
                </span>{" "}
                
              </CardDescription>
            </div>
            {/* <div className="flex justify-center mt-4">
              <Tabs value={furnaceSize} onValueChange={setFurnaceSize}>
                <TabsList>
                  <TabsTrigger value="big">Big Furnace</TabsTrigger>
                  <TabsTrigger value="small">Small Furnace</TabsTrigger>
                </TabsList>
              </Tabs>
            </div> */}
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="flex justify-center gap-4">
              <Button
                onClick={() => handleSelectItem("steel")}
                variant={selectedItem === "steel" ? "default" : "outline"}
              >
                Steel
              </Button>
              <Button
                onClick={() => handleSelectItem("slag")}
                variant={selectedItem === "slag" ? "default" : "outline"}
              >
                Slag
              </Button>
              <Button
                onClick={() => handleSelectItem("sow")}
                variant={selectedItem === "sow" ? "default" : "outline"}
              >
                Sow
              </Button>
            </div>

            {selectedItem && selectedItem !== "sow" && (
              <div className="space-y-4">
                <Input
                  placeholder="Optional Weight"
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                />
                <Button
                  disabled={isSubmitting}
                  onClick={handleSubmitSteelSlag}
                  className="w-full"
                >
                  {isSubmitting ? "Submitting..." : `Submit ${selectedItem}`}
                </Button>
              </div>
            )}

            {selectedItem === "sow" && (
              <div className="space-y-4">
                {possibleInputs.length ? (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-500">
                      Select input to link Sow (preferred highlighted)
                    </p>
                    {possibleInputs.map((input) => (
                      <div
                        key={input._id}
                        onClick={() => setSelectedInputId(input._id)}
                        className={`p-3 border rounded cursor-pointer ${
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
                          Emp Added: {input.employee.name} | Total Weight:{" "}
                          {input.totalWeight} |{" "}
                          {new Date(input.timestamp).toLocaleString()}
                        </p>
                      </div>
                    ))}
                    <Input
                      placeholder="Optional Sow Weight"
                      type="number"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                    />
                    <Button
                      disabled={isSubmitting}
                      onClick={handleSubmitSow}
                      className="w-full"
                    >
                      {isSubmitting ? "Submitting..." : "Confirm Sow"}
                    </Button>
                  </div>
                ) : (
                  <p className="text-center text-sm text-gray-500">
                    No possible inputs found for Sow.
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
