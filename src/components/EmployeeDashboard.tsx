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
import AdminDashboard1 from "../components/MatDashboard1";
import LangToggle from "@/components/LangToggle";
import exp from "constants";
interface Employee {
  _id: string;
  name: string;
  email: string;
  address: string;
  role: string;
  shiftAssigned: string;
}
const EmployeeDashboard = () => {
    const token = localStorage.getItem("adminToken");
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();
    const { toast } = useToast();
    const { t } = useTranslation();
    // const [tab, setTab] = useState("materials");
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
  return (
    <Card className="mb-6 w-full p-6">
      <div className="flex justify-between mb-4">
        <CardTitle>
          {t("adminDashboard.employeesTab")}
        </CardTitle>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="w-4 h-4 mr-2" /> {t("adminDashboard.addEmployee")}
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
                        <AlertDialogTitle>Delete Employee?</AlertDialogTitle>
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
    </Card>
  );
};

export default EmployeeDashboard;