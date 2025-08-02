// import { useEffect, useState } from "react";
// import {
//   Table,
//   TableHeader,
//   TableBody,
//   TableRow,
//   TableHead,
//   TableCell,
// } from "@/components/ui/table";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Download } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectTrigger,
//   SelectValue,
//   SelectContent,
//   SelectItem,
// } from "@/components/ui/select";
// import {
//   AlertDialog,
//   AlertDialogTrigger,
//   AlertDialogContent,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogFooter,
//   AlertDialogCancel,
// } from "@/components/ui/alert-dialog";

// const DischargeTable = ({ t, backendUrl }) => {
//   const [discharges, setDischarges] = useState([]);
//   const [filters, setFilters] = useState({
//     shift: "all",
//     employeeName: "",
//     dateFrom: "",
//     dateTo: "",
//     furnaceSize: "all",
//     sowId: "",
//   });

//   const [selectedMaterialEntry, setSelectedMaterialEntry] = useState(null);
//   const [showMaterialModal, setShowMaterialModal] = useState(false);

//   const navigate = useNavigate();
//   const token = localStorage.getItem("adminToken");
//   if (!token) {
//     navigate("/admin/login");
//     return;
//   }

//   useEffect(() => {
//     fetch(`${backendUrl}/api/admin/discharges`, {
//       headers: { Authorization: `Bearer ${token}` },
//     })
//       .then((res) => res.json())
//       .then(setDischarges)
//       .catch(console.error);
//   }, [backendUrl]);

//   const filteredDischarges = discharges.filter((d) => {
//     const matchesShift = filters.shift === "all" || d.shift === filters.shift;
//     const matchesName =
//       !filters.employeeName ||
//       d.employee?.name
//         ?.toLowerCase()
//         .includes(filters.employeeName.toLowerCase());
//     const timestamp = new Date(d.timestamp);
//     const matchesDateFrom =
//       !filters.dateFrom || timestamp >= new Date(filters.dateFrom);
//     const matchesDateTo =
//       !filters.dateTo || timestamp <= new Date(filters.dateTo);
//     // const matchesFurnaceSize =
//     //   filters.furnaceSize === "all" || d.furnaceSize === filters.furnaceSize;
//     const matchesFurnaceSize =
//       filters.furnaceSize === "all" ||
//       d.furnaceSize?.toUpperCase() === filters.furnaceSize;
//     const matchesSowId =
//       !filters.sowId ||
//       d.sowId?.toLowerCase().includes(filters.sowId.toLowerCase());
//     return (
//       matchesShift &&
//       matchesName &&
//       matchesDateFrom &&
//       matchesDateTo &&
//       matchesFurnaceSize &&
//       matchesSowId
//     );
//   });

//   const handleExport = () => {
//     const csv = [
//       [
//         "Shift",
//         "Employee",
//         "Item Type",
//         "Weight",
//         "Sow ID",
//         "Furnace Size",
//         "Timestamp",
//       ].join(","),
//       ...filteredDischarges.map((d) =>
//         [
//           d.shift,
//           d.employee?.name || "",
//           d.itemType,
//           d.weight || "",
//           d.sowId || "",
//           d.furnaceSize || "",
//           new Date(d.timestamp).toLocaleString(),
//         ].join(",")
//       ),
//     ].join("\n");

//     const blob = new Blob([csv], { type: "text/csv" });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.href = url;
//     link.download = "discharges.csv";
//     link.click();
//   };

//   return (
//     <Card>
//       <CardHeader className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
//         <CardTitle>{t("adminDashboard.dischargeRecords")}</CardTitle>
//         <div className="flex flex-col md:flex-row gap-2">
//           {/* <p className="text-sm">.</p> */}
//           <Button
//             onClick={() =>
//               setFilters({
//                 shift: "all",
//                 employeeName: "",
//                 dateFrom: "",
//                 dateTo: "",
//                 furnaceSize: "all",
//                 sowId: "",
//               })
//             }
//             className="flex-shrink-0"
//           >
//             Clear Filters
//           </Button>
//           {/* </div> */}
//           {/* <div className="w-full sm:w-auto flex-1 min-w-[150px]"> */}
//           {/* <p className="text-sm">.</p> */}
//           <Button onClick={handleExport} className="flex-shrink-0">
//             <Download className="w-4 h-4 mr-2" /> Export CSV
//           </Button>
//         </div>
//       </CardHeader>
//       <CardContent>
//         {/* 🔍 Filter section */}
//         <div className="flex flex-wrap gap-4 mb-4">
//           <div className="w-full sm:w-auto flex-1 min-w-[150px]">
//             <p className="text-sm">Shift</p>
//             <Select
//               value={filters.shift}
//               onValueChange={(v) => setFilters((f) => ({ ...f, shift: v }))}
//             >
//               <SelectTrigger className="w-full">
//                 <SelectValue placeholder="Shift" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All</SelectItem>
//                 <SelectItem value="Shift 1">Shift 1</SelectItem>
//                 <SelectItem value="Shift 2">Shift 2</SelectItem>
//                 <SelectItem value="Shift 3">Shift 3</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//           <div className="w-full sm:w-auto flex-1 min-w-[150px]">
//             <p className="text-sm">Employee Name</p>
//             <Input
//               placeholder="Search Employee"
//               value={filters.employeeName}
//               onChange={(e) =>
//                 setFilters((prev) => ({
//                   ...prev,
//                   employeeName: e.target.value,
//                 }))
//               }
//               className="flex-1 min-w-[150px]"
//             />
//           </div>
//           <div className="w-full sm:w-auto flex-1 min-w-[150px]">
//             <p className="text-sm">Sow ID</p>
//             <Input
//               placeholder="Sow ID"
//               value={filters.sowId}
//               onChange={(e) =>
//                 setFilters((prev) => ({ ...prev, sowId: e.target.value }))
//               }
//               className="flex-1 min-w-[150px]"
//             />
//           </div>

//           <div className="w-full sm:w-auto flex-1 min-w-[150px]">
//             <p className="text-sm">To Date</p>
//             <Input
//               type="date"
//               value={filters.dateFrom}
//               onChange={(e) =>
//                 setFilters((f) => ({ ...f, dateFrom: e.target.value }))
//               }
//               className="flex-1 min-w-[150px]"
//             />
//           </div>
//           <div className="w-full sm:w-auto flex-1 min-w-[150px]">
//             <p className="text-sm">From Date</p>
//             <Input
//               type="date"
//               value={filters.dateTo}
//               onChange={(e) =>
//                 setFilters((f) => ({ ...f, dateTo: e.target.value }))
//               }
//               className="flex-1 min-w-[150px]"
//             />{" "}
//           </div>

//           <div className="w-full sm:w-auto flex-1 min-w-[150px]">
//             <p className="text-sm">Furnace Size</p>
//             <Select
//               value={filters.furnaceSize}
//               onValueChange={(v) =>
//                 setFilters((f) => ({ ...f, furnaceSize: v }))
//               }
//             >
//               <SelectTrigger className="w-full">
//                 <SelectValue placeholder="Furnace Size" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All</SelectItem>
//                 <SelectItem value="BIG">BIG</SelectItem>
//                 <SelectItem value="SMALL">SMALL</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//         </div>

//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>Shift</TableHead>
//               <TableHead>Employee</TableHead>
//               <TableHead>Item Type</TableHead>
//               <TableHead>Weight</TableHead>
//               <TableHead>Sow ID</TableHead>
//               <TableHead>Furnace Size</TableHead>
//               <TableHead>Material Input</TableHead>
//               <TableHead>Timestamp</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {filteredDischarges.map((d) => (
//               <TableRow key={d._id}>
//                 <TableCell>{d.shift}</TableCell>
//                 <TableCell>{d.employee?.name}</TableCell>
//                 <TableCell>{d.itemType}</TableCell>
//                 <TableCell>{d.weight}</TableCell>
//                 <TableCell>{d.sowId || "-"}</TableCell>
//                 <TableCell>{d.furnaceSize}</TableCell>
//                 <TableCell>
//                   {d.materialEntry ? (
//                     <Button
//                       size="sm"
//                       variant="outline"
//                       onClick={() => {
//                         setSelectedMaterialEntry(d.materialEntry);
//                         setShowMaterialModal(true);
//                       }}
//                     >
//                       View
//                     </Button>
//                   ) : (
//                     "-"
//                   )}
//                 </TableCell>
//                 <TableCell>{new Date(d.timestamp).toLocaleString()}</TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>

//         <AlertDialog
//           open={showMaterialModal}
//           onOpenChange={setShowMaterialModal}
//         >
//           <AlertDialogContent className="max-h-[80vh] overflow-y-auto">
//             <AlertDialogHeader>
//               <AlertDialogTitle>Material Details</AlertDialogTitle>
//             </AlertDialogHeader>
//             {selectedMaterialEntry && (
//               <div className="space-y-4">
//                 <div>
//                   <strong>Timestamp:</strong>{" "}
//                   {new Date(selectedMaterialEntry.timestamp).toLocaleString()}
//                 </div>
//                 <div>
//                   <strong>Total Weight:</strong>{" "}
//                   {selectedMaterialEntry.totalWeight}
//                 </div>
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead>Material Type</TableHead>
//                       <TableHead>Size</TableHead>
//                       <TableHead>Count</TableHead>
//                       <TableHead>Weight Per Item</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {selectedMaterialEntry.materials?.map((m) => (
//                       <TableRow key={m._id}>
//                         <TableCell>{m.materialType}</TableCell>
//                         <TableCell>{m.size}</TableCell>
//                         <TableCell>{m.count}</TableCell>
//                         <TableCell>{m.weightPerItem}</TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </div>
//             )}
//             <AlertDialogFooter>
//               <AlertDialogCancel>Close</AlertDialogCancel>
//             </AlertDialogFooter>
//           </AlertDialogContent>
//         </AlertDialog>
//       </CardContent>
//     </Card>
//   );
// };

// export default DischargeTable;


import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { useTranslation } from "react-i18next";
import { fetchDischarges, setFilters, setPage } from "../store/dischargeSlice";
import { AppDispatch, RootState } from "../store/Store";
import { DischargeEntry } from "../components/types";
import { MaterialEntry } from "../components/types";
interface DischargeTableProps {
  t: any; // Adjust type based on your i18next setup
  backendUrl: string;
}

const DischargeTable = ({ t, backendUrl }: DischargeTableProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const dispatch = useDispatch<AppDispatch>();
  const [selectedMaterialEntry, setSelectedMaterialEntry] = useState<MaterialEntry | null>(null);
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [tempFilters, setTempFilters] = useState({
    shift: "all",
    employeeName: "",
    dateFrom: "",
    dateTo: "",
    furnaceSize: "all",
    sowId: "",
  });

  const { discharges, page, pageSize, totalRows, totalPages, loading, error, filters } = useSelector(
    (state: RootState) => state.discharges
  );

  const token = localStorage.getItem("adminToken");
  if (!token) {
    navigate("/admin/login");
    return null;
  }

  useEffect(() => {
    dispatch(fetchDischarges({ page: 1, filters }));
  }, [dispatch]);

  const handleApplyFilters = () => {
    dispatch(setFilters(tempFilters));
    dispatch(fetchDischarges({ page: 1, filters: tempFilters }));
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      dispatch(setPage(page + 1));
      dispatch(fetchDischarges({ page: page + 1, filters }));
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      dispatch(setPage(page - 1));
      dispatch(fetchDischarges({ page: page - 1, filters }));
    }
  };

  const handleExport = () => {
    const csv = [
      [
        "Shift",
        "Employee",
        "Item Type",
        "Weight",
        "Sow ID",
        "Furnace Size",
        "Timestamp",
      ].join(","),
      ...(Array.isArray(discharges) ? discharges : []).map((d: DischargeEntry) =>
        [
          d.shift,
          d.employee?.name || "",
          d.itemType,
          d.weight || "",
          d.sowId || "",
          d.furnaceSize || "",
          new Date(d.timestamp).toLocaleString(),
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `discharges-${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);

    toast({ title: "Exported CSV" });
  };

  return (
    <Card>
      <CardHeader className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
        <CardTitle>{t("adminDashboard.dischargeRecords")}</CardTitle>
        <div className="flex flex-col md:flex-row gap-2">
          <Button
            onClick={() => {
              setTempFilters({
                shift: "all",
                employeeName: "",
                dateFrom: "",
                dateTo: "",
                furnaceSize: "all",
                sowId: "",
              });
              dispatch(setFilters({
                shift: "all",
                employeeName: "",
                dateFrom: "",
                dateTo: "",
                furnaceSize: "all",
                sowId: "",
              }));
              dispatch(fetchDischarges({
                page: 1,
                filters: {
                  shift: "all",
                  employeeName: "",
                  dateFrom: "",
                  dateTo: "",
                  furnaceSize: "all",
                  sowId: "",
                },
              }));
            }}
            className="flex-shrink-0"
          >
            Clear Filters
          </Button>
          <Button onClick={handleExport} className="flex-shrink-0">
            <Download className="w-4 h-4 mr-2" /> Export CSV
          </Button>
          <Button onClick={handleApplyFilters} className="flex-shrink-0">
            <Filter className="w-4 h-4 mr-2" /> Apply Filters
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="w-full sm:w-auto flex-1 min-w-[150px]">
            <p className="text-sm">Shift</p>
            <Select
              value={tempFilters.shift}
              onValueChange={(v) => setTempFilters((f) => ({ ...f, shift: v }))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Shift" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="Shift 1">Shift 1</SelectItem>
                <SelectItem value="Shift 2">Shift 2</SelectItem>
                <SelectItem value="Shift 3">Shift 3</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full sm:w-auto flex-1 min-w-[150px]">
            <p className="text-sm">Employee Name</p>
            <Input
              placeholder="Search Employee"
              value={tempFilters.employeeName}
              onChange={(e) =>
                setTempFilters((prev) => ({
                  ...prev,
                  employeeName: e.target.value,
                }))
              }
              className="flex-1 min-w-[150px]"
            />
          </div>
          <div className="w-full sm:w-auto flex-1 min-w-[150px]">
            <p className="text-sm">Sow ID</p>
            <Input
              placeholder="Sow ID"
              value={tempFilters.sowId}
              onChange={(e) =>
                setTempFilters((prev) => ({ ...prev, sowId: e.target.value }))
              }
              className="flex-1 min-w-[150px]"
            />
          </div>
          <div className="w-full sm:w-auto flex-1 min-w-[150px]">
            <p className="text-sm">From Date</p>
            <Input
              type="date"
              value={tempFilters.dateFrom}
              onChange={(e) =>
                setTempFilters((f) => ({ ...f, dateFrom: e.target.value }))
              }
              className="flex-1 min-w-[150px]"
            />
          </div>
          <div className="w-full sm:w-auto flex-1 min-w-[150px]">
            <p className="text-sm">To Date</p>
            <Input
              type="date"
              value={tempFilters.dateTo}
              onChange={(e) =>
                setTempFilters((f) => ({ ...f, dateTo: e.target.value }))
              }
              className="flex-1 min-w-[150px]"
            />
          </div>
          <div className="w-full sm:w-auto flex-1 min-w-[150px]">
            <p className="text-sm">Furnace Size</p>
            <Select
              value={tempFilters.furnaceSize}
              onValueChange={(v) =>
                setTempFilters((f) => ({ ...f, furnaceSize: v }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Furnace Size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="big">BIG</SelectItem>
                <SelectItem value="small">SMALL</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && (!discharges || discharges.length === 0) && (
          <p>No discharges found.</p>
        )}

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Shift</TableHead>
              <TableHead>Employee</TableHead>
              <TableHead>Item Type</TableHead>
              <TableHead>Weight</TableHead>
              <TableHead>Sow ID</TableHead>
              <TableHead>Furnace Size</TableHead>
              <TableHead>Material Input</TableHead>
              <TableHead>Timestamp</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.isArray(discharges) &&
              discharges.map((d: DischargeEntry) => (
                <TableRow key={d._id}>
                  <TableCell>{d.shift}</TableCell>
                  <TableCell>{d.employee?.name}</TableCell>
                  <TableCell>{d.itemType}</TableCell>
                  <TableCell>{d.weight}</TableCell>
                  <TableCell>{d.sowId || "-"}</TableCell>
                  <TableCell>{d.furnaceSize}</TableCell>
                  <TableCell>
                    {d.materialEntry ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedMaterialEntry(d.materialEntry);
                          setShowMaterialModal(true);
                        }}
                      >
                        View
                      </Button>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>{new Date(d.timestamp).toLocaleString()}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>

        <div className="flex justify-between items-center p-4">
          <Button
            onClick={handlePrevPage}
            disabled={page === 1}
            variant="outline"
          >
            Previous
          </Button>
          <span>
            Page {page} of {totalPages} (Total Rows: {totalRows})
          </span>
          <Button
            onClick={handleNextPage}
            disabled={page === totalPages}
            variant="outline"
          >
            Next
          </Button>
        </div>

        <AlertDialog open={showMaterialModal} onOpenChange={setShowMaterialModal}>
          <AlertDialogContent className="max-h-[80vh] overflow-y-auto">
            <AlertDialogHeader>
              <AlertDialogTitle>Material Details</AlertDialogTitle>
            </AlertDialogHeader>
            {selectedMaterialEntry && (
              <div className="space-y-4">
                <div>
                  <strong>Timestamp:</strong>{" "}
                  {new Date(selectedMaterialEntry.timestamp).toLocaleString()}
                </div>
                <div>
                  <strong>Total Weight:</strong>{" "}
                  {selectedMaterialEntry.totalWeight}
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Material Type</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Count</TableHead>
                      <TableHead>Weight Per Item</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedMaterialEntry.materials?.map((m) => (
                      <TableRow key={m._id}>
                        <TableCell>{m.materialType}</TableCell>
                        <TableCell>{m.size}</TableCell>
                        <TableCell>{m.count}</TableCell>
                        <TableCell>{m.weightPerItem}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
            <AlertDialogFooter>
              <AlertDialogCancel>Close</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
};

export default DischargeTable;