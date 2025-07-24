import { useEffect, useState } from "react";
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
import { Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
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

const DischargeTable = ({ t, backendUrl }) => {
  const [discharges, setDischarges] = useState([]);
  const [filters, setFilters] = useState({
    shift: "all",
    employeeName: "",
    dateFrom: "",
    dateTo: "",
  });

  const [selectedMaterialEntry, setSelectedMaterialEntry] = useState(null);
  const [showMaterialModal, setShowMaterialModal] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("adminToken");
  if (!token) {
    navigate("/admin/login");
    return;
  }

  useEffect(() => {
    fetch(`${backendUrl}/api/admin/discharges`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setDischarges)
      .catch(console.error);
  }, [backendUrl]);

  const filteredDischarges = discharges.filter((d) => {
    const matchesShift = filters.shift === "all" || d.shift === filters.shift;
    const matchesName =
      !filters.employeeName ||
      d.employee?.name
        ?.toLowerCase()
        .includes(filters.employeeName.toLowerCase());
    const timestamp = new Date(d.timestamp);
    const matchesDateFrom =
      !filters.dateFrom || timestamp >= new Date(filters.dateFrom);
    const matchesDateTo =
      !filters.dateTo || timestamp <= new Date(filters.dateTo);

    return matchesShift && matchesName && matchesDateFrom && matchesDateTo;
  });

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
      ...filteredDischarges.map((d) =>
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
    link.download = "discharges.csv";
    link.click();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("adminDashboard.dischargeRecords")}</CardTitle>
      </CardHeader>
      <CardContent>
        {/* 🔍 Filter section */}
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="w-full sm:w-auto flex-1 min-w-[150px]">
            <p className="text-sm">Shift</p>
            <Select
              value={filters.shift}
              onValueChange={(v) => setFilters((f) => ({ ...f, shift: v }))}
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
              value={filters.employeeName}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  employeeName: e.target.value,
                }))
              }
              className="flex-1 min-w-[150px]"
            />
          </div>
          <div className="w-full sm:w-auto flex-1 min-w-[150px]">
            <p className="text-sm">To Date</p>
            <Input
              type="date"
              value={filters.dateFrom}
              onChange={(e) =>
                setFilters((f) => ({ ...f, dateFrom: e.target.value }))
              }
              className="flex-1 min-w-[150px]"
            />
          </div>
          <div className="w-full sm:w-auto flex-1 min-w-[150px]">
            <p className="text-sm">From Date</p>
            <Input
              type="date"
              value={filters.dateTo}
              onChange={(e) =>
                setFilters((f) => ({ ...f, dateTo: e.target.value }))
              }
              className="flex-1 min-w-[150px]"
            />{" "}
          </div>
          <div className="w-full sm:w-auto flex-1 min-w-[150px]">
            <p className="text-sm">.</p>
            <Button
              onClick={() =>
                setFilters({
                  shift: "all",
                  employeeName: "",
                  dateFrom: "",
                  dateTo: "",
                })
              }
              className="flex-shrink-0"
            >
              Clear Filters
            </Button>
          </div>
          <div className="w-full sm:w-auto flex-1 min-w-[150px]">
            <p className="text-sm">.</p>
            <Button onClick={handleExport} className="flex-shrink-0">
              <Download className="w-4 h-4 mr-2" /> Export CSV
            </Button>
          </div>
        </div>

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
            {filteredDischarges.map((d) => (
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

        <AlertDialog
          open={showMaterialModal}
          onOpenChange={setShowMaterialModal}
        >
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
