import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { FileSpreadsheet, FileText, Printer, Search } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useState } from "react";

export interface Column<T> {
  header: string;
  accessorKey: keyof T;
  className?: string;
  cell?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  actions?: (item: T) => React.ReactNode;
  title?: string;
  searchKey?: keyof T;
  initialPageSize?: number;
}

export function DataTable<T>({
  data: initialData,
  columns,
  actions,
  title = "Report",
  searchKey,
  initialPageSize = 10,
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  // Filter data based on search
  const filteredData = searchKey
    ? initialData.filter((item) =>
        String(item[searchKey]).toLowerCase().includes(search.toLowerCase())
      )
    : initialData;

  // Calculate pagination
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = filteredData.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const generatePDF = () => {
    const doc = new jsPDF();
    const date = new Date().toLocaleDateString();

    // Add title
    doc.setFontSize(18);
    doc.text(title, 14, 20);

    // Add date
    doc.setFontSize(11);
    doc.text(`Generated on: ${date}`, 14, 30);

    // Prepare table data
    const headers = columns.map((col) => col.header);
    const rows = filteredData.map((item) =>
      columns.map((col) =>
        String(col.cell ? col.cell(item) : item[col.accessorKey])
      )
    );

    // Add table
    autoTable(doc, {
      head: [headers],
      body: rows,
      startY: 40,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [41, 128, 185] },
    });

    doc.save(`${title.toLowerCase().replace(/\s+/g, "-")}-report.pdf`);
  };

  const generateExcel = () => {
    // Prepare CSV data with proper table structure
    const headerRow = columns.map((col) => col.header).join(",");
    const dataRows = filteredData
      .map((item) => {
        return columns
          .map((col) => {
            let cellContent = col.cell ? col.cell(item) : item[col.accessorKey];
            // Convert to string and remove any HTML/React elements
            return String(cellContent).replace(/<[^>]+>/g, "");
          })
          .join(",");
      })
      .join("\\n");

    const csv = `${headerRow}\\n${dataRows}`;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);
    link.download = `${title.toLowerCase().replace(/\s+/g, "-")}-report.csv`;
    link.click();
  };

  const handlePrint = () => {
    const printWindow = window.open("", "", "height=600,width=800");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>${title}</title>
          <style>
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 2px; text-align: left; }
            th { background-color: #2980b9; color: white; }
            .header { margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${title}</h1>
            <p>Generated on: ${new Date().toLocaleDateString()}</p>
          </div>
          <table>
            <thead>
              <tr>
                ${columns.map((col) => `<th>${col.header}</th>`).join("")}
              </tr>
            </thead>
            <tbody>
              ${filteredData
                .map(
                  (item) => `
                <tr>
                  ${columns
                    .map(
                      (col) =>
                        `<td>${
                          col.cell
                            ? col.cell(item)
                            : String(item[col.accessorKey])
                        }</td>`
                    )
                    .join("")}
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        {searchKey && (
          <div className="flex items-center gap-2">
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1); // Reset to first page on search
                }}
                className="pl-8"
              />
            </div>
            <Select
              value={pageSize.toString()}
              onValueChange={(v) => {
                setPageSize(Number(v));
                setPage(1); // Reset to first page when changing page size
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Rows per page" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 rows per page</SelectItem>
                <SelectItem value="20">20 rows per page</SelectItem>
                <SelectItem value="50">50 rows per page</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button variant="outline" size="sm" onClick={generatePDF}>
            <FileText className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
          <Button variant="outline" size="sm" onClick={generateExcel}>
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Export Excel
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column, index) => (
                <TableHead key={index} className={column.className}>
                  {column.header}
                </TableHead>
              ))}
              {actions && <TableHead className="text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((item, rowIndex) => (
              <TableRow key={rowIndex}>
                {columns.map((column, colIndex) => (
                  <TableCell key={colIndex} className={column.className}>
                    {column.cell
                      ? column.cell(item)
                      : String(item[column.accessorKey])}
                  </TableCell>
                ))}
                {actions && (
                  <TableCell className="text-right">{actions(item)}</TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {(page - 1) * pageSize + 1} to{" "}
          {Math.min(page * pageSize, filteredData.length)} of{" "}
          {filteredData.length} entries
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </Button>
          {[...Array(totalPages)].map((_, i) => (
            <Button
              key={i + 1}
              variant={page === i + 1 ? "default" : "outline"}
              size="sm"
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
