// import { useEffect, useState } from "react";
// import { useTranslation } from "react-i18next";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import LangToggle from "@/components/LangToggle";
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardContent,
//   CardDescription,
// } from "@/components/ui/card";
// import { ArrowLeft, Package, Minus, Plus } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";

// const predefinedMaterials = [
//   { category: "Al Combo", size: "Small", weight: 442 },
//   { category: "Al Combo", size: "Medium", weight: 570 },
//   { category: "Al Combo", size: "Big", weight: 752 },
//   { category: "Al Engine", size: "Small", weight: 182 },
//   { category: "Al Engine", size: "Medium", weight: 240 },
//   { category: "Al Engine", size: "Big", weight: 380 },
//   { category: "Al Transmission", size: "Small", weight: 140 },
//   { category: "Al Transmission", size: "Medium", weight: 160 },
//   { category: "Al Transmission", size: "Big", weight: 220 },
//   { category: "Steel Combo", size: "Small", weight: 480 },
//   { category: "Steel Combo", size: "Medium", weight: 680 },
//   { category: "Steel Combo", size: "Big", weight: 780 },
//   { category: "Steel Engine", size: "Small", weight: 240 },
//   { category: "Steel Engine", size: "Medium", weight: 380 },
//   { category: "Steel Engine", size: "Big", weight: 442 },
// ];

// const MaterialEntry = () => {
//   const backendUrl = import.meta.env.VITE_BACKEND_URL;
//   const { t } = useTranslation();
//   const navigate = useNavigate();
//   const { toast } = useToast();
//   const [searchParams] = useSearchParams();

//   const shift = searchParams.get("shift");
//   const employee = searchParams.get("employee");

//   const [counts, setCounts] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   useEffect(() => {
//     if (!shift || !employee) {
//       navigate("/employee/shift-selection");
//     }
//   }, [shift, employee, navigate]);

//   const handleIncrement = (key) => {
//     setCounts((prev) => ({
//       ...prev,
//       [key]: (prev[key] || 0) + 1,
//     }));
//   };

//   const handleDecrement = (key) => {
//     setCounts((prev) => {
//       const newCount = (prev[key] || 0) - 1;
//       if (newCount <= 0) {
//         const updated = { ...prev };
//         delete updated[key];
//         return updated;
//       }
//       return { ...prev, [key]: newCount };
//     });
//   };

//   const totalWeight = Object.entries(counts).reduce((acc, [key, count]) => {
//     const material = predefinedMaterials.find(
//       (m) => `${m.category}-${m.size}` === key
//     );
//     return acc + (material ? material.weight * count : 0);
//   }, 0);

//   const handleSubmit = async () => {
//     if (!Object.keys(counts).length) return;

//     const materials = Object.entries(counts).map(([key, count]) => {
//       const material = predefinedMaterials.find(
//         (m) => `${m.category}-${m.size}` === key
//       );
//       return {
//         materialType: material.category,
//         size: material.size,
//         count,
//         weightPerItem: material.weight,
//       };
//     });

//     const payload = {
//       shift,
//       employeeId: employee,
//       timestamp: new Date(),
//       materials,
//       totalWeight,
//     };

//     setIsSubmitting(true);
//     try {
//       const res = await fetch(`${backendUrl}/api/materials`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) throw new Error("Failed to save material entry");

//       toast({
//         title: "Material entry saved!",
//         description: `Total Weight: ${totalWeight} lbs`,
//       });

//       setCounts({});
//     } catch (err) {
//       console.error(err);
//       toast({
//         title: "Submission failed",
//         description: "Please try again",
//         variant: "destructive",
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Group by category for rows
//   const categories = [...new Set(predefinedMaterials.map((m) => m.category))];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
//       <div className="container mx-auto max-w-7xl">
//         <div className="flex justify-between items-center">
//           <Button
//             variant="ghost"
//             onClick={() => navigate("/employee/shift-selection")}
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
//             <div className="flex justify-center mb-4">
//               <Package className="h-12 w-12 text-primary" />
//             </div>
//             <CardTitle className="text-2xl text-center">
//               Material Entry
//             </CardTitle>
//             <CardDescription className="text-center">
//               Shift: {shift} | Total Weight: {totalWeight} lbs
//             </CardDescription>
//           </CardHeader>

//           <CardContent>
//             <div className="overflow-x-auto">
//               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
//                 {categories.map((category) => (
//                   <div key={category} className="border rounded p-4">
//                     <h3 className="font-bold mb-2 text-center">{category}</h3>
//                     <div className="space-y-3">
//                       {["Small", "Medium", "Big"].map((size) => {
//                         const key = `${category}-${size}`;
//                         const material = predefinedMaterials.find(
//                           (m) => m.category === category && m.size === size
//                         );
//                         return (
//                           <div
//                             key={key}
//                             className="flex items-center justify-between gap-2"
//                           >
//                             <div className="flex items-center gap-2 w-full justify-between rounded-sm border">
//                               <span className="text-xs font-medium">
//                                 {size}
//                               </span>
//                               <Button
//                                 type="button"
//                                 variant="ghost"
//                                 size="icon"
//                                 onClick={() => handleDecrement(key)}
//                               >
//                                 <Minus className="h-4 w-4" />
//                               </Button>
//                               <span className="w-6 text-center">{counts[key] || 0}</span>
//                               <Button
//                                 type="button"
//                                 variant="secondary"
//                                 size="icon"
//                                 onClick={() => handleIncrement(key)}
//                               >
//                                 <Plus className="h-4 w-4" />
//                               </Button>
//                             </div>
//                           </div>
//                         );
//                       })}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <Button
//               onClick={handleSubmit}
//               disabled={!Object.keys(counts).length || isSubmitting}
//               className="w-full mt-6"
//               size="lg"
//             >
//               {isSubmitting ? "Submitting..." : "Submit Entry"}
//             </Button>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default MaterialEntry;
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import LangToggle from "@/components/LangToggle";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { ArrowLeft, Package, Minus, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSelector, useDispatch } from "react-redux";
import {
  setShift,
  setEmployee,
  setMode,
  setFurnaceSize,
  clearAll,
} from "@/store/shiftSlice";

const predefinedMaterialsBig = [
  { category: "Al Combo", size: "Small", weight: 442 },
  { category: "Al Combo", size: "Medium", weight: 570 },
  { category: "Al Combo", size: "Big", weight: 752 },
  { category: "Al Engine", size: "Small", weight: 182 },
  { category: "Al Engine", size: "Medium", weight: 240 },
  { category: "Al Engine", size: "Big", weight: 380 },
  { category: "Al Transmission", size: "Small", weight: 140 },
  { category: "Al Transmission", size: "Medium", weight: 160 },
  { category: "Al Transmission", size: "Big", weight: 220 },
  { category: "Steel Combo", size: "Small", weight: 480 },
  { category: "Steel Combo", size: "Medium", weight: 680 },
  { category: "Steel Combo", size: "Big", weight: 780 },
  { category: "Steel Engine", size: "Small", weight: 240 },
  { category: "Steel Engine", size: "Medium", weight: 380 },
  { category: "Steel Engine", size: "Big", weight: 442 },
  { category: "Aluminum Rim", size: "Standard", weight: 24 },
];

// const predefinedMaterialsSmall = [
// ];

const MaterialEntry = () => {
  const { selectedShift, selectedEmployee, mode, furnaceSize } = useSelector(
    (state) => state.shift
  );
  const dispatch = useDispatch();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const shift = selectedShift;
  const employee = selectedEmployee;
  // const furnaceSize = searchParams.get("furnaceSize");
  // const mode = searchParams.get("mode");
  const [counts, setCounts] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  // const [furnaceSize, setFurnaceSize] = useState("big"); // 👈 big or small

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

  const handleIncrement = (key) => {
    setCounts((prev) => ({
      ...prev,
      [key]: (prev[key] || 0) + 1,
    }));
  };

  const handleDecrement = (key) => {
    setCounts((prev) => {
      const newCount = (prev[key] || 0) - 1;
      if (newCount <= 0) {
        const updated = { ...prev };
        delete updated[key];
        return updated;
      }
      return { ...prev, [key]: newCount };
    });
  };

  // const predefinedMaterialsBig =
  //   furnaceSize === "big" ? predefinedMaterialsBig : predefinedMaterialsSmall;

  const totalWeight = Object.entries(counts).reduce((acc, [key, count]) => {
    const material = predefinedMaterialsBig.find(
      (m) => `${m.category}-${m.size}` === key
    );
    return acc + (material ? material.weight * count : 0);
  }, 0);

  const handleSubmit = async () => {
    if (!Object.keys(counts).length) return;

    const materials = Object.entries(counts).map(([key, count]) => {
      const material = predefinedMaterialsBig.find(
        (m) => `${m.category}-${m.size}` === key
      );
      return {
        materialType: material.category,
        size: material.size,
        count,
        weightPerItem: material.weight,
      };
    });

    const payload = {
      shift,
      employeeId: employee,
      furnaceSize, // 👈 new field
      materials,
      totalWeight,
    };

    setIsSubmitting(true);
    try {
      const res = await fetch(`${backendUrl}/api/materials`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save material entry");

      toast({
        title: "Material entry saved!",
        description: `Total Weight: ${totalWeight} lbs`,
      });

      setCounts({});
      navigate("/employee/mode-selection");
      dispatch(setMode(""));
      dispatch(setFurnaceSize("")); // Clear all state after submission
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

  // Group by category for rows
  const categories = [
    ...new Set(predefinedMaterialsBig.map((m) => m.category)),
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto max-w-7xl">
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
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <div className="block mb-4 justify-start items-center md:flex">
              <CardTitle className="flex text-2xl items-center">
                <Package className="h-12 w-12 text-primary" />
                Material Entry
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

            {/* Furnace Size Tabs */}
            {/* <div className="flex justify-center mt-4">
              <Button
                variant={furnaceSize === "big" ? "default" : "outline"}
                className="mx-2"
                onClick={() => setFurnaceSize("big")}
              >
                Big Furnace
              </Button>
              <Button
                variant={furnaceSize === "small" ? "default" : "outline"}
                className="mx-2"
                onClick={() => setFurnaceSize("small")}
              >
                Small Furnace
              </Button>
            </div> */}
          </CardHeader>

          <CardContent>
            <div className="overflow-x-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
                {categories.map((category) => (
                  <div key={category} className="border rounded p-4">
                    <h3 className="font-bold mb-2 text-center">{category}</h3>
                    <div className="space-y-3">
                      {predefinedMaterialsBig
                        .filter((m) => m.category === category)
                        .map((material) => {
                          const key = `${material.category}-${material.size}`;
                          return (
                            <div
                              key={key}
                              className="flex items-center justify-between gap-2"
                            >
                              <div className="flex items-center gap-2 w-full justify-between rounded-sm border">
                                <span className="text-xs font-medium">
                                  {material.size}
                                </span>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDecrement(key)}
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                                <span className="w-6 text-center">
                                  {counts[key] || 0}
                                </span>
                                <Button
                                  type="button"
                                  variant="secondary"
                                  size="icon"
                                  onClick={() => handleIncrement(key)}
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <CardDescription className="text-right text-color-black-500 mt-4 text-lg">
              Total Weight: {totalWeight} lbs
            </CardDescription>
            <Button
              onClick={handleSubmit}
              disabled={!Object.keys(counts).length || isSubmitting}
              className="w-full mt-6"
              size="lg"
            >
              {isSubmitting ? "Submitting..." : "Submit Entry"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MaterialEntry;
