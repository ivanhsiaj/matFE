
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
import AdminDashboard1 from "@/components/MatDashboard1";
import EmpDashboard from "@/components/EmployeeDashboard";
import LangToggle from "@/components/LangToggle";
interface Employee {
  _id: string;
  name: string;
  email: string;
  address: string;
  role: string;
  shiftAssigned: string;
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


  useEffect(() => {
    if (tab === "employees") fetchEmployees();
  }, [tab]);

  const token = localStorage.getItem("adminToken");
  if (!token) {
    navigate("/admin/login");
    return;
  }

  useEffect(() => {
    // fetchMaterials();
    fetchEmployees();
  }, []);

  
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
          <AdminDashboard1/>
        </TabsContent>
          {/* --- Employees --- */}

        <TabsContent value="employees">
            <EmpDashboard/>
        </TabsContent>
        <TabsContent value="discharges">
          <DischargeTable t={t} backendUrl={backendUrl} />
        </TabsContent>
      </Tabs>

      
    </div>
  );
}
