// import { useState, useEffect } from "react";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { useTranslation } from "react-i18next";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog";
// import { Download, Edit, Trash2, Plus, LogOut, Filter } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { useToast } from "@/hooks/use-toast";

// import LangToggle from "@/components/LangToggle";

// interface MaterialEntry {
//   _id: string;
//   shift: string;
//   materialName: string;
//   materialType: string;
//   weight: number;
//   quantity: number;
//   timestamp: string;
// }

// const AdminDashboard = () => {
//   const navigate = useNavigate();
//   const { toast } = useToast();

//   const [tab, setTab] = useState("materials");
//   const [employees, setEmployees] = useState<Employee[]>([]);
//   const [showAddEmp, setShowAddEmp] = useState(false);
//   const [newEmp, setNewEmp] = useState({
//     name: "", email: "", address: "", role: "", shiftAssigned: ""
//   });
//   useEffect(() => {
//     if (tab === "employees") fetchEmployees();
//   }, [tab]);
//   const fetchEmployees = async () => {
//     const res = await fetch("http://localhost:5000/api/admin/employees");
//     const data = await res.json();
//     setEmployees(data);
//   };

//   const createEmployee = async () => {
//     const res = await fetch("http://localhost:5000/api/admin/employees", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(newEmp),
//     });
//     if (res.ok) {
//       toast({ title: "Employee Added!" });
//       fetchEmployees();
//       setShowAddEmp(false);
//       setNewEmp({ name: "", email: "", address: "", role: "", shiftAssigned: "" });
//     }
//   };

//   const deleteEmployee = async (id: string) => {
//     await fetch(`http://localhost:5000/api/admin/employees/${id}`, {
//       method: "DELETE",
//     });
//     toast({ title: "Deleted" });
//     fetchEmployees();
//   };
//   useEffect(() => {
//     const fetchMaterials = async () => {
//       const token = localStorage.getItem("adminToken");
//       if (!token) {
//         navigate("/admin/login");
//         return;
//       }
//       try {
//         const res = await fetch("http://localhost:5000/api/admin/materials",{
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           });
//         const data = await res.json();
//         console.log(data);
//         setMaterials(Array.isArray(data) ? data : data.materials);
//         setFiltered(Array.isArray(data) ? data : data.materials);

//         // setMaterials(data);
//         // setFiltered(data);
//       } catch (err) {
//         console.error(err);
//         navigate("/admin/login");
//       }
//     };
//     fetchMaterials();
//   }, [navigate]);

//   useEffect(() => {
//     let result = materials;
//     if (filter.materialName) {
//       result = result.filter((m) =>
//         m.materialName.toLowerCase().includes(filter.materialName.toLowerCase())
//       );
//     }
//     if (filter.materialType) {
//       result = result.filter((m) =>
//         m.materialType.toLowerCase().includes(filter.materialType.toLowerCase())
//       );
//     }
//     setFiltered(result);
//   }, [filter, materials]);

//   const handleLogout = () => {
//     localStorage.removeItem("adminToken");
//     toast({
//       title: t("adminDashboard.loggedOut"),
//     });
//     navigate("/");
//   };

//   const handleDelete = async (id: string) => {
//     try {
//       await fetch(`http://localhost:5000/api/admin/materials/${id}`, {
//         method: "DELETE",
//       });
//       setMaterials((prev) => prev.filter((m) => m._id !== id));
//       toast({ title: t("adminDashboard.entryDeleted") });
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleExport = () => {
//     const headers = [
//       "ID",
//       "Shift",
//       "Material Name",
//       "Material Type",
//       "Weight",
//       "Quantity",
//       "Timestamp",
//     ];
//     const rows = filtered.map((m) =>
//       [
//         m._id,
//         m.shift,
//         m.materialName,
//         m.materialType,
//         m.weight,
//         m.quantity,
//         new Date(m.timestamp).toLocaleString(),
//       ].join(",")
//     );
//     const csv = [headers.join(","), ...rows].join("\n");
//     const blob = new Blob([csv], { type: "text/csv" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = "materials.csv";
//     a.click();
//     URL.revokeObjectURL(url);
//     toast({ title: t("adminDashboard.exportSuccess") });
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <header className="flex justify-between items-center p-4 border-b bg-white">
//         <h1 className="text-xl font-bold">{t("adminDashboard.title")}</h1>
//         <div className="flex items-center gap-4">
//           <LangToggle />
//           <Button variant="outline" onClick={handleLogout}>
//             <LogOut className="h-4 w-4 mr-2" />
//             {t("adminDashboard.logout")}
//           </Button>
//         </div>
//       </header>

//       <main className="p-4 max-w-6xl mx-auto">
//         <Card className="mb-4">
//           <CardHeader>
//             <CardTitle className="flex items-center">
//               <Filter className="h-5 w-5 mr-2" />
//               {t("adminDashboard.filtersTitle")}
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <Label>{t("adminDashboard.materialName")}</Label>
//                 <Input
//                   value={filter.materialName}
//                   onChange={(e) =>
//                     setFilter((prev) => ({
//                       ...prev,
//                       materialName: e.target.value,
//                     }))
//                   }
//                 />
//               </div>
//               <div>
//                 <Label>{t("adminDashboard.materialType")}</Label>
//                 <Input
//                   value={filter.materialType}
//                   onChange={(e) =>
//                     setFilter((prev) => ({
//                       ...prev,
//                       materialType: e.target.value,
//                     }))
//                   }
//                 />
//               </div>
//             </div>
//             <div className="mt-4 flex gap-2">
//               <Button variant="outline" onClick={handleExport}>
//                 <Download className="h-4 w-4 mr-2" />
//                 {t("adminDashboard.exportCsv")}
//               </Button>
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle>
//               {t("adminDashboard.entries")} ({filtered?.length})
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="overflow-x-auto">
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>ID</TableHead>
//                     <TableHead>Shift</TableHead>
//                     <TableHead>{t("adminDashboard.materialName")}</TableHead>
//                     <TableHead>{t("adminDashboard.materialType")}</TableHead>
//                     <TableHead>Weight</TableHead>
//                     <TableHead>Quantity</TableHead>
//                     <TableHead>{t("adminDashboard.timestamp")}</TableHead>
//                     <TableHead>{t("adminDashboard.actions")}</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {filtered.map((m) => (
//                     <TableRow key={m._id}>
//                       <TableCell>{m._id}</TableCell>
//                       <TableCell>{m.shift}</TableCell>
//                       <TableCell>{m.materialName}</TableCell>
//                       <TableCell>{m.materialType}</TableCell>
//                       <TableCell>{m.weight}</TableCell>
//                       <TableCell>{m.quantity}</TableCell>
//                       <TableCell>
//                         {new Date(m.timestamp).toLocaleString()}
//                       </TableCell>
//                       <TableCell>
//                         <AlertDialog>
//                           <AlertDialogTrigger asChild>
//                             <Button variant="outline" size="sm">
//                               <Trash2 className="h-4 w-4" />
//                             </Button>
//                           </AlertDialogTrigger>
//                           <AlertDialogContent>
//                             <AlertDialogHeader>
//                               <AlertDialogTitle>
//                                 {t("adminDashboard.deleteEntryTitle")}
//                               </AlertDialogTitle>
//                               <AlertDialogDescription>
//                                 {t("adminDashboard.deleteEntryConfirm")}
//                               </AlertDialogDescription>
//                             </AlertDialogHeader>
//                             <AlertDialogFooter>
//                               <AlertDialogCancel>
//                                 {t("adminDashboard.cancel")}
//                               </AlertDialogCancel>
//                               <AlertDialogAction
//                                 onClick={() => handleDelete(m._id)}
//                               >
//                                 {t("adminDashboard.delete")}
//                               </AlertDialogAction>
//                             </AlertDialogFooter>
//                           </AlertDialogContent>
//                         </AlertDialog>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//               {filtered.length === 0 && (
//                 <p className="text-center text-gray-500 mt-4">
//                   {t("adminDashboard.noEntries")}
//                 </p>
//               )}
//             </div>
//           </CardContent>
//         </Card>
//       </main>
//     </div>
//   );
// };

// export default AdminDashboard;


// your existing material log states & hooks stay here
// useState, useEffect, filters, etc.
// const [materials, setMaterials] = useState<MaterialEntry[]>([]);
// const [selectedMaterialEntry, setSelectedMaterialEntry] =
//   useState<MaterialEntry | null>(null);
// const [showMaterialModal, setShowMaterialModal] = useState(false);
// const [filteredMaterials, setFilteredMaterials] = useState<MaterialEntry[]>(
//   []
// );
// const [materialFilters, setMaterialFilters] = useState({
  //   shift: "all",
  //   employeeName: "",
  //   dateFrom: "",
  //   dateTo: "",
  //   outputStatus: "all",
  //   furnaceSize: "all",
  // });
  // ---------------- MATERIALS ----------------
  
  // const fetchMaterials = async () => {
  //   const res = await fetch(`${backendUrl}/api/admin/materials`, {
  //     headers: { Authorization: `Bearer ${token}` },
  //   });
  //   const data = await res.json();
  //   console.log(data);
  //   setMaterials(data);
  //   setFilteredMaterials(data);
  // };
  // useEffect(() => {
  //   let filtered = materials;

  //   if (materialFilters.shift && materialFilters.shift !== "all") {
  //     filtered = filtered.filter((m) => m.shift === materialFilters.shift);
  //   }

  //   if (materialFilters.employeeName) {
  //     filtered = filtered.filter((m) =>
  //       m.employee?.name
  //         ?.toLowerCase()
  //         .includes(materialFilters.employeeName.toLowerCase())
  //     );
  //   }

  //   if (materialFilters.dateFrom) {
  //     const from = new Date(materialFilters.dateFrom + "T00:00:00");
  //     filtered = filtered.filter((m) => new Date(m.timestamp) >= from);
  //   }
  //   if (
  //     materialFilters.outputStatus &&
  //     materialFilters.outputStatus !== "all"
  //   ) {
  //     filtered = filtered.filter(
  //       (m) =>
  //         (m.outputStatus ? "Collected" : "Waiting") ===
  //         materialFilters.outputStatus
  //     );
  //   }
  //   if (materialFilters.dateTo) {
  //     const to = new Date(materialFilters.dateTo + "T23:59:59");
  //     filtered = filtered.filter((m) => new Date(m.timestamp) <= to);
  //   }
  //   if (materialFilters.furnaceSize && materialFilters.furnaceSize !== "all") {
  //     filtered = filtered.filter(
  //       (m) => m.furnaceSize?.toUpperCase() === materialFilters.furnaceSize
  //     );
  //   }
  //   setFilteredMaterials(filtered);
  // }, [materialFilters, materials]);

  // const handleMaterialDelete = async (id: string) => {
  //   await fetch(`${backendUrl}/api/admin/materials/${id}`, {
  //     method: "DELETE",
  //     headers: { Authorization: `Bearer ${token}` },
  //   });
  //   toast({ title: "Material Deleted" });
  //   fetchMaterials();
  // };

  // const handleMaterialExport = () => {
  //   const csv = [
  //     "ID,Shift,Employee ID,Employee Name,Total Weight,Output Status,Furnace Size,Timestamp,",
  //     ...filteredMaterials.map((m) =>
  //       [
  //         m._id,
  //         m.shift,
  //         m.employee?._id || "N/A",
  //         m.employee?.name || "N/A",
  //         m.totalWeight,
  //         m.outputStatus || "N/A",
  //         m.furnaceSize || "N/A",
  //         new Date(m.timestamp).toLocaleString(),
  //       ].join(",")
  //     ),
  //   ].join("\n");

  //   const blob = new Blob([csv], { type: "text/csv" });
  //   const url = window.URL.createObjectURL(blob);
  //   const a = document.createElement("a");
  //   a.href = url;
  //   a.download = `materials-${Date.now()}.csv`;
  //   a.click();
  //   window.URL.revokeObjectURL(url);

  //   toast({ title: "Exported CSV" });
  // };
  // interface MaterialSubItem {
//   _id: string;
//   materialType: string;
//   size: string;
//   count: number;
//   weightPerItem: number;
// }

// interface MaterialEntry {
//   _id: string;
//   shift: string;
//   employee: {
//     _id: string;
//     name: string;
//   };
//   timestamp: string;
//   totalWeight: number;
//   materials: MaterialSubItem[];
//   furnaceSize?: string;
//   outputStatus?: boolean;
// }