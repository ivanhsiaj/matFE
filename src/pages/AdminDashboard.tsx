import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { useTranslation } from "react-i18next";
import { Download, Edit, Trash2, Plus, LogOut, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import DischargeTable from "@/components/DischargeTable";
import LangToggle from "@/components/LangToggle";
interface Employee {
  _id: string;
  name: string;
  email: string;
  address: string;
  role: string;
  shiftAssigned: string;
}
interface MaterialSubItem {
  _id: string;
  materialType: string;
  size: string;
  count: number;
  weightPerItem: number;
}

interface MaterialEntry {
  _id: string;
  shift: string;
  employee: {
    _id: string;
    name: string;
  };
  timestamp: string;
  totalWeight: number;
  materials: MaterialSubItem[];
  furnaceSize?: string;
  outputStatus?: boolean;
}

export default function AdminDashboard() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [tab, setTab] = useState("materials");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState<Employee | null>(null);

  const [newEmp, setNewEmp] = useState({
    name: "",
    email: "",
    address: "",
    role: "",
    shiftAssigned: "",
  });

  // your existing material log states & hooks stay here
  // useState, useEffect, filters, etc.
  const [materials, setMaterials] = useState<MaterialEntry[]>([]);
  const [selectedMaterialEntry, setSelectedMaterialEntry] =
    useState<MaterialEntry | null>(null);
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [filteredMaterials, setFilteredMaterials] = useState<MaterialEntry[]>(
    []
  );
  const [materialFilters, setMaterialFilters] = useState({
    shift: "all",
    employeeName: "",
    dateFrom: "",
    dateTo: "",
    outputStatus: "all",
    furnaceSize: "all",
  });

  useEffect(() => {
    if (tab === "employees") fetchEmployees();
  }, [tab]);

  const token = localStorage.getItem("adminToken");
  if (!token) {
    navigate("/admin/login");
    return;
  }
  // ---------------- MATERIALS ----------------

  const fetchMaterials = async () => {
    const res = await fetch(`${backendUrl}/api/admin/materials`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    console.log(data);
    setMaterials(data);
    setFilteredMaterials(data);
  };

  useEffect(() => {
    fetchMaterials();
    fetchEmployees();
  }, []);

  useEffect(() => {
    let filtered = materials;

    if (materialFilters.shift && materialFilters.shift !== "all") {
      filtered = filtered.filter((m) => m.shift === materialFilters.shift);
    }

    if (materialFilters.employeeName) {
      filtered = filtered.filter((m) =>
        m.employee?.name
          ?.toLowerCase()
          .includes(materialFilters.employeeName.toLowerCase())
      );
    }

    if (materialFilters.dateFrom) {
      const from = new Date(materialFilters.dateFrom + "T00:00:00");
      filtered = filtered.filter((m) => new Date(m.timestamp) >= from);
    }
    if (
      materialFilters.outputStatus &&
      materialFilters.outputStatus !== "all"
    ) {
      filtered = filtered.filter(
        (m) =>
          (m.outputStatus ? "Collected" : "Waiting") ===
          materialFilters.outputStatus
      );
    }
    if (materialFilters.dateTo) {
      const to = new Date(materialFilters.dateTo + "T23:59:59");
      filtered = filtered.filter((m) => new Date(m.timestamp) <= to);
    }
    if (materialFilters.furnaceSize && materialFilters.furnaceSize !== "all") {
      filtered = filtered.filter(
        (m) => m.furnaceSize?.toUpperCase() === materialFilters.furnaceSize
      );
    }
    setFilteredMaterials(filtered);
  }, [materialFilters, materials]);

  const handleMaterialDelete = async (id: string) => {
    await fetch(`${backendUrl}/api/admin/materials/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    toast({ title: "Material Deleted" });
    fetchMaterials();
  };

  const handleMaterialExport = () => {
    const csv = [
      "ID,Shift,Employee ID,Employee Name,Total Weight,Output Status,Furnace Size,Timestamp,",
      ...filteredMaterials.map((m) =>
        [
          m._id,
          m.shift,
          m.employee?._id || "N/A",
          m.employee?.name || "N/A",
          m.totalWeight,
          m.outputStatus || "N/A",
          m.furnaceSize || "N/A",
          new Date(m.timestamp).toLocaleString(),
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `materials-${Date.now()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({ title: "Exported CSV" });
  };

  // ---------------- EMPLOYEES ----------------
  const fetchEmployees = async () => {
    const res = await fetch(`${backendUrl}/api/admin/employees`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    setEmployees(data);
  };

  const createEmployee = async () => {
    const res = await fetch(`${backendUrl}/api/admin/employees`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newEmp),
    });
    if (res.ok) {
      toast({ title: "Employee Created" });
      fetchEmployees();
      setShowAddModal(false);
      setNewEmp({
        name: "",
        email: "",
        address: "",
        role: "",
        shiftAssigned: "",
      });
    } else {
      toast({ title: "Error", description: "Failed to create employee" });
    }
  };

  const updateEmployee = async () => {
    if (!selectedEmp) return;

    const res = await fetch(
      `${backendUrl}/api/admin/employees/${selectedEmp._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(selectedEmp),
      }
    );
    if (res.ok) {
      toast({ title: "Employee Updated" });
      fetchEmployees();
      setShowEditModal(false);
      setSelectedEmp(null);
    } else {
      toast({ title: "Error", description: "Failed to update employee" });
    }
  };

  const deleteEmployee = async (id: string) => {
    const res = await fetch(`${backendUrl}/api/admin/employees/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      toast({ title: "Employee Deleted" });
      fetchEmployees();
    } else {
      toast({ title: "Error", description: "Failed to delete employee" });
    }
  };
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    toast({
      title: t("adminDashboard.loggedOut"),
      description: t("adminDashboard.loggedOutDesc"),
    });
    navigate("/");
  };
  return (
    <div className="container mx-auto py-8">
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b mb-4">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t("adminDashboard.title")}
            </h1>
            <span className="ml-auto mr-4">
              <LangToggle />
            </span>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              {t("adminDashboard.logout")}
            </Button>
            {/* <div className="text-right p-4">
            </div> */}
          </div>
        </div>
      </div>
      <Tabs defaultValue="materials" onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="materials">
            {t("adminDashboard.materialsTab")}
          </TabsTrigger>
          <TabsTrigger value="discharges">
            {t("adminDashboard.dischargesTab")}
          </TabsTrigger>
          <TabsTrigger value="employees">
            {t("adminDashboard.employeesTab")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="materials">
          {/* --- Materials --- */}

          <Card className="mb-6 w-full">
            <CardHeader className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
              <CardTitle>{t("adminDashboard.materialFilters")}</CardTitle>
              <div className="flex flex-col md:flex-row gap-2">
                <Button
                  onClick={() =>
                    setMaterialFilters({
                      shift: "all",
                      employeeName: "",
                      dateFrom: "",
                      dateTo: "",
                      outputStatus: "all",
                      furnaceSize: "all",
                    })
                  }
                  className="flex-shrink-0"
                >
                  {t("adminDashboard.clearFilters")}
                </Button>
                <Button
                  onClick={handleMaterialExport}
                  className="flex-shrink-0"
                >
                  <Download className="h-4 w-4 mr-1" />{" "}
                  {t("adminDashboard.exportCsv")}
                </Button>
              </div>
            </CardHeader>

            <CardContent>
              <div className="flex flex-wrap gap-4">
                <div className="w-full sm:w-auto flex-1 min-w-[150px]">
                  <p className="text-sm">Shift</p>
                  <Select
                    value={materialFilters.shift}
                    onValueChange={(v) =>
                      setMaterialFilters((f) => ({ ...f, shift: v }))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t("adminDashboard.shift")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="Shift 1">Shift 1</SelectItem>
                      <SelectItem value="Shift 2">Shift 2</SelectItem>
                      <SelectItem value="Shift 3">Shift 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1 min-w-[150px]">
                  <p className="text-sm">To Date</p>
                  <Input
                    placeholder={t("adminDashboard.searchEmployee")}
                    value={materialFilters.employeeName}
                    onChange={(e) =>
                      setMaterialFilters((prev) => ({
                        ...prev,
                        employeeName: e.target.value,
                      }))
                    }
                    className="flex-1 min-w-[150px]"
                  />
                </div>
                <div className="flex-1 min-w-[150px]">
                  <p className="text-sm">From Date</p>
                  <Input
                    type="date"
                    value={materialFilters.dateFrom}
                    onChange={(e) =>
                      setMaterialFilters((f) => ({
                        ...f,
                        dateFrom: e.target.value,
                      }))
                    }
                    className="flex-1 min-w-[150px]"
                  />
                </div>
                <div className="flex-1 min-w-[150px]">
                  <p className="text-sm">To Date</p>
                  <Input
                    type="date"
                    value={materialFilters.dateTo}
                    onChange={(e) =>
                      setMaterialFilters((f) => ({
                        ...f,
                        dateTo: e.target.value,
                      }))
                    }
                    className="flex-1 min-w-[150px]"
                  />
                </div>
                <div className="w-full sm:w-auto flex-1 min-w-[150px]">
                  <p className="text-sm">Output Status</p>
                  <Select
                    value={materialFilters.outputStatus}
                    onValueChange={(v) =>
                      setMaterialFilters((f) => ({ ...f, outputStatus: v }))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Output Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="Collected">Collected</SelectItem>
                      <SelectItem value="Waiting">Waiting</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-full sm:w-auto flex-1 min-w-[150px]">
                  <p className="text-sm">Furnace Size</p>
                  <Select
                    value={materialFilters.furnaceSize}
                    onValueChange={(v) =>
                      setMaterialFilters((f) => ({ ...f, furnaceSize: v }))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Furnace Size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="BIG">BIG</SelectItem>
                      <SelectItem value="SMALL">SMALL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Table>
            <TableHeader>
              <TableRow>
                {/* <TableHead>ID</TableHead> */}
                <TableHead>{t("adminDashboard.shift")}</TableHead>
                <TableHead>{t("adminDashboard.employeeName")}</TableHead>
                <TableHead>{t("adminDashboard.totalWeight")}</TableHead>
                <TableHead>{t("adminDashboard.timestamp")}</TableHead>
                <TableHead>{t("adminDashboard.outputStatus")}</TableHead>
                <TableHead>{t("adminDashboard.furnaceSize")}</TableHead>
                <TableHead>{t("adminDashboard.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMaterials.map((entry) => (
                <TableRow key={entry._id}>
                  {/* <TableCell>{entry._id}</TableCell> */}
                  <TableCell>{entry.shift}</TableCell>
                  <TableCell>{entry.employee?.name}</TableCell>
                  <TableCell>{entry.totalWeight}</TableCell>
                  <TableCell>
                    {new Date(entry.timestamp).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {entry?.outputStatus ? "Collected" : "Waiting"}
                  </TableCell>
                  <TableCell>{entry.furnaceSize}</TableCell>

                  <TableCell className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedMaterialEntry(entry);
                        setShowMaterialModal(true);
                      }}
                    >
                      {t("adminDashboard.viewMaterials")}
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            {t("adminDashboard.deleteEntryTitle")}
                          </AlertDialogTitle>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>
                            {t("adminDashboard.cancel")}
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleMaterialDelete(entry._id)}
                          >
                            {t("adminDashboard.delete")}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <AlertDialog
            open={showMaterialModal}
            onOpenChange={setShowMaterialModal}
          >
            <AlertDialogContent className="max-h-[80vh] overflow-y-auto">
              <AlertDialogHeader>
                <AlertDialogTitle>Materials</AlertDialogTitle>
              </AlertDialogHeader>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Count</TableHead>
                      <TableHead>Weight Per Item</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedMaterialEntry?.materials.map((sub) => (
                      <TableRow key={sub._id}>
                        <TableCell>{sub.materialType}</TableCell>
                        <TableCell>{sub.size}</TableCell>
                        <TableCell>{sub.count}</TableCell>
                        <TableCell>{sub.weightPerItem}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel>
                  {t("adminDashboard.close")}
                </AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* --- Employees --- */}
        </TabsContent>

        <TabsContent value="employees">
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-bold">
              {t("adminDashboard.employeesTab")}
            </h2>
            <Button onClick={() => setShowAddModal(true)}>
              <Plus className="w-4 h-4 mr-2" />{" "}
              {t("adminDashboard.addEmployee")}
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Shift</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((emp) => (
                <TableRow key={emp._id}>
                  <TableCell>{emp._id}</TableCell>
                  <TableCell>{emp.name}</TableCell>
                  <TableCell>{emp.email}</TableCell>
                  <TableCell>{emp.address}</TableCell>
                  <TableCell>{emp.role}</TableCell>
                  <TableCell>{emp.shiftAssigned}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedEmp(emp);
                          setShowEditModal(true);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="outline">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Delete Employee?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this employee?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteEmployee(emp._id)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
        <TabsContent value="discharges">
          <DischargeTable t={t} backendUrl={backendUrl} />
        </TabsContent>
      </Tabs>

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <Card className="w-[400px] p-6 bg-white max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Add Employee</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Label>Name</Label>
              <Input
                value={newEmp.name}
                onChange={(e) => setNewEmp({ ...newEmp, name: e.target.value })}
              />
              <Label>Email</Label>
              <Input
                value={newEmp.email}
                onChange={(e) =>
                  setNewEmp({ ...newEmp, email: e.target.value })
                }
              />
              <Label>Address</Label>
              <Input
                value={newEmp.address}
                onChange={(e) =>
                  setNewEmp({ ...newEmp, address: e.target.value })
                }
              />
              <Label>Role</Label>
              <Input
                value={newEmp.role}
                onChange={(e) => setNewEmp({ ...newEmp, role: e.target.value })}
              />
              <Label>Shift</Label>
              <Input
                value={newEmp.shiftAssigned}
                onChange={(e) =>
                  setNewEmp({ ...newEmp, shiftAssigned: e.target.value })
                }
              />
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </Button>
                <Button onClick={createEmployee}>Save</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Edit Employee Modal */}
      {showEditModal && selectedEmp && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <Card className="w-[400px] p-6 bg-white max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Edit Employee</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Label>Name</Label>
              <Input
                value={selectedEmp.name}
                onChange={(e) =>
                  setSelectedEmp({ ...selectedEmp, name: e.target.value })
                }
              />
              <Label>Email</Label>
              <Input
                value={selectedEmp.email}
                onChange={(e) =>
                  setSelectedEmp({ ...selectedEmp, email: e.target.value })
                }
              />
              <Label>Address</Label>
              <Input
                value={selectedEmp.address}
                onChange={(e) =>
                  setSelectedEmp({ ...selectedEmp, address: e.target.value })
                }
              />
              <Label>Role</Label>
              <Input
                value={selectedEmp.role}
                onChange={(e) =>
                  setSelectedEmp({ ...selectedEmp, role: e.target.value })
                }
              />
              <Label>Shift</Label>
              <Input
                value={selectedEmp.shiftAssigned}
                onChange={(e) =>
                  setSelectedEmp({
                    ...selectedEmp,
                    shiftAssigned: e.target.value,
                  })
                }
              />
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </Button>
                <Button onClick={updateEmployee}>Update</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
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
