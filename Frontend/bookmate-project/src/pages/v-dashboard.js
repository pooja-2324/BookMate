import React, { useState } from "react";
import {
  Drawer,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  Divider,
} from "@mui/material";
import {
  MenuOpenRounded,
  AttachMoneyRounded,
  BookRounded,
  PendingActionsRounded,
  BarChartRounded,
  LogoutRounded,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export default function VDashboard() {
  const [open, setOpen] = useState(true); // Drawer is open by default
  const navigate = useNavigate();

  // Dashboard menu items
  const menuItems = [
    //{ text: "My Earnings", icon: <AttachMoneyRounded />, path: "/dashboard/earnings" },
    { text: "My Books", icon: <BookRounded />, path: "/dashboard/my-books" },
    //{ text: "Pending Rent Books", icon: <PendingActionsRounded />, path: "/dashboard/pending-books" },
    //{ text: "Analytics", icon: <BarChartRounded />, path: "/dashboard/analytics" },
  ];

  // Handle logout functionality
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      // Clear any session data
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  return (
    <div style={{ display: "flex" }}>
      {/* Drawer Component */}
      <Drawer
        variant="persistent"
        open={!open}
        sx={{
          width: 240,
          "& .MuiDrawer-paper": {
            width: 240,
            boxSizing: "border-box",
          },
        }}
      >
        {/* Drawer Header */}
        <Box sx={{ padding: "20px", textAlign: "center" }}>
          <Typography variant="h6">Dashboard</Typography>
        </Box>
        <Divider />
        {/* Menu Items */}
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton onClick={() => navigate(item.path)}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
          <Divider />
          {/* Logout Option */}
          <ListItem disablePadding>
            <ListItemButton onClick={handleLogout}>
              <ListItemIcon>
                <LogoutRounded />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
      {/* Main Content Area */}
      <Box
        sx={{
          flexGrow: 1,
          padding: "20px",
        }}
      >
        <IconButton
          onClick={() => setOpen(!open)}
          sx={{
            position: "absolute",
            left: open ? 250 : 10,
            top: 10,
            transition: "left 0.3s",
          }}
        >
          <MenuOpenRounded />
        </IconButton>
        <Typography variant="h4">Welcome to your Dashboard</Typography>
        <Typography variant="body1">
          Use the menu to navigate between sections.
        </Typography>
      </Box>
    </div>
  );
}
