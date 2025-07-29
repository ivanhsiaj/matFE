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

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    toast({
      title: t("adminDashboard.loggedOut"),
      description: t("adminDashboard.loggedOutDesc"),
    });
    navigate("/");
  };
  return (
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
          <Button onClick={handleMaterialExport} className="flex-shrink-0">
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
            <p className="text-sm">Employee Search</p>
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
      <AlertDialog open={showMaterialModal} onOpenChange={setShowMaterialModal}>
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
            <AlertDialogCancel>{t("adminDashboard.close")}</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
