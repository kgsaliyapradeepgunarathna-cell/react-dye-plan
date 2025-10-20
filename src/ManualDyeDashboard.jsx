import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import ComputerIcon from "@mui/icons-material/Computer";
import PaletteIcon from "@mui/icons-material/Palette";
import LocalLaundryServiceIcon from "@mui/icons-material/LocalLaundryService";
import DoNotDisturbAltIcon from "@mui/icons-material/DoNotDisturbAlt";

const stats = [
  {
    label: "To be dyed",
    value: 36npm start,
    icon: <LocalLaundryServiceIcon sx={{ fontSize: 48, color: "#ff6600" }} />,
  },
  {
    label: "De-Twist",
    value: 18,
    icon: <DoNotDisturbAltIcon sx={{ fontSize: 48, color: "#6c2eb6" }} />,
  },
  {
    label: "SAP",
    value: 10,
    icon: <ComputerIcon sx={{ fontSize: 48, color: "#00b050" }} />,
  },
  {
    label: "To be Finish",
    value: 10,
    icon: <PaletteIcon sx={{ fontSize: 48, color: "#e600e6" }} />,
  },
];

export default function Dashboard() {
  const [rows, setRows] = useState([]);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [password, setPassword] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  // ✅ Load saved data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem("excelData");
    if (savedData) {
      setRows(JSON.parse(savedData));
    }
  }, []);

  // ✅ Convert Excel to JSON and Save to localStorage
  const handleFileUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const workbook = XLSX.read(e.target.result, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
      setRows(data);
      localStorage.setItem("excelData", JSON.stringify(data));
    };
    reader.readAsBinaryString(file);
  };

  // ✅ When user selects Excel file
  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setOpenPasswordDialog(true);
    }
  };

  // ✅ Password check before uploading Excel
  const handlePasswordConfirm = () => {
    const correctPassword = "1234"; // <-- change this password as you like
    if (password === correctPassword) {
      handleFileUpload(selectedFile);
      setOpenPasswordDialog(false);
      setPassword("");
      setSelectedFile(null);
      alert("✅ Excel data uploaded successfully!");
    } else {
      alert("❌ Wrong password! Try again.");
    }
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", bgcolor: "#e6e6fa" }}>
      {/* Sidebar */}
      <Box
        sx={{
          width: 220,
          bgcolor: "linear-gradient(180deg, #b3c6e6 0%, #a3b8d8 100%)",
          p: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <img
          src="https://www.noyonlanka.com/wp-content/uploads/2021/12/noyon-lanka-logo.webp"
          alt="Logo"
          style={{ width: 120, marginBottom: 24 }}
        />
        <List>
          <ListItem button selected>
            <ListItemText primary={<b>Dye Plan</b>} />
          </ListItem>
          <Divider />
          <ListItem button>
            <ListItemText primary={<b>Hydro</b>} />
          </ListItem>
          <Divider />
          <ListItem button>
            <ListItemText primary={<b>SAP</b>} />
          </ListItem>
          <Divider />
          <ListItem button>
            <ListItemText primary={<b>Finishing</b>} />
          </ListItem>
        </List>

        {/* Excel Upload Button */}
        <Button
          variant="contained"
          component="label"
          sx={{
            mt: 2,
            bgcolor: "#4b6cb7",
            "&:hover": { bgcolor: "#3a539b" },
            textTransform: "none",
          }}
        >
          Upload Excel
          <input type="file" hidden accept=".xlsx, .xls" onChange={onFileChange} />
        </Button>
      </Box>

      {/* Main Content */}
      <Box sx={{ flex: 1, p: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
          Dye Plan
        </Typography>

        {/* Stats Cards */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          {stats.map((stat) => (
            <Grid item xs={3} key={stat.label}>
              <Paper
                sx={{
                  p: 2,
                  textAlign: "center",
                  border:
                    stat.label === "De-Twist"
                      ? "3px solid #6c2eb6"
                      : stat.label === "To be Finish"
                      ? "3px solid #e600e6"
                      : "3px solid transparent",
                  boxShadow: "0 2px 8px #0001",
                }}
              >
                {stat.icon}
                <Typography
                  variant="subtitle1"
                  sx={{ color: "#888", fontWeight: 500 }}
                >
                  {stat.label}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                  {stat.value}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Table */}
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: "#444" }}>
                {[
                  "Customer",
                  "Article",
                  "Batch No",
                  "Colour",
                  "Plan Dye Date",
                  "Pending Days",
                  "Status",
                  "Re Mark",
                ].map((header) => (
                  <TableCell key={header} sx={{ color: "#fff" }}>
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((r, idx) => (
                <TableRow
                  key={idx}
                  sx={{ bgcolor: idx % 2 ? "#e6f0ff" : "#f7faff" }}
                >
                  <TableCell>{r.Customer}</TableCell>
                  <TableCell>{r.Article}</TableCell>
                  <TableCell>{r.Batch}</TableCell>
                  <TableCell>{r.Colour}</TableCell>

                  {/* 🩵 FIX for Date Object Rendering */}
                  <TableCell>
                    {r["Plan Dye Date"]
                      ? typeof r["Plan Dye Date"] === "object"
                        ? new Date(r["Plan Dye Date"]).toLocaleDateString("en-CA")
                        : r["Plan Dye Date"]
                      : ""}
                  </TableCell>

                  <TableCell>{r["Pending Days"]}</TableCell>
                  <TableCell>{r.Status}</TableCell>
                  <TableCell>{r.Remark}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Password Dialog */}
      <Dialog open={openPasswordDialog} onClose={() => setOpenPasswordDialog(false)}>
        <DialogTitle>🔒 Enter Password</DialogTitle>
        <DialogContent>
          <TextField
            type="password"
            label="Password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPasswordDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handlePasswordConfirm}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
