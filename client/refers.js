import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, Paper } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const QuotesTable = ({ userId, topicId }) => {
  const [rowsData, setRowsData] = useState([]);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("S_no");

  useEffect(() => {
    if (userId && topicId) {
      const user_id = userId ? Number(userId) : null;

      axios.post("http://localhost:14853/api/getUserData", { user_id, topicId })
        .then((res) => {
          if (res.data && res.data.rowsData) {
            setRowsData(res.data.rowsData);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [userId, topicId]);

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);

    // Sorting logic
    const sortedData = [...rowsData].sort((a, b) => {
      return isAsc ? a[property] > b[property] : a[property] < b[property];
    });
    setRowsData(sortedData);
  };

  const columns = [
    { id: "S_no", name: "S. No", sortable: true },
    { id: "quotes_title", name: "Quotes Title", sortable: true },
    { id: "author_name", name: "Author", sortable: true },
    { id: "quotes_count", name: "Quote Count", sortable: true },
    { id: "created_at", name: "Created At", sortable: true }
  ];

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="quotes table">
        <TableHead sx={{ backgroundColor: "#ececec" }}>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={column.id} sx={{ color: "black", fontWeight: "bold" }}
                sortDirection={orderBy === column.id ? order : false}>
                <TableSortLabel
                  active={orderBy === column.id}
                  direction={orderBy === column.id ? order : "asc"}
                  onClick={() => handleSort(column.id)}
                  IconComponent={column.sortable ? ArrowDropDownIcon : () => null}
                  sx={{ color: "black" }}
                >
                  {column.name}
                </TableSortLabel>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody sx={{ color: "#4C4C4A" }}>
          {rowsData.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.S_no}</TableCell>
              <TableCell>{row.quotes_title}</TableCell>
              <TableCell>{row.author_name}</TableCell>
              <TableCell>{row.quotes_count}</TableCell>
              <TableCell>{row.created_at}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default QuotesTable;
