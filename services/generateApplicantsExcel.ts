import * as XLSX from 'xlsx-js-style';
import { supabase } from './supabaseClient';

// ── Helpers ────────────────────────────────────────────────────────────────

const formatDate = (iso: string) => {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const formatDateKey = (iso: string) => {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const toTitleCase = (val?: string | null) => {
  if (!val) return '';
  return val.trim().toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
};

// ── Style constants ────────────────────────────────────────────────────────
// Title row & total row : #046241 (lifewood green)
// Header row            : #F5EEDB (warm cream)
// Data row stripe 1     : #FFC370 (amber)
// Data row stripe 2     : #FFE4B5 (lighter amber)

const TITLE_STYLE = {
  font:      { bold: true, color: { rgb: 'FFFFFF' }, name: 'Arial', sz: 14 },
  fill:      { fgColor: { rgb: '046241' }, patternType: 'solid' },
  alignment: { horizontal: 'center', vertical: 'center' },
};

const HEADER_STYLE = {
  font:      { bold: true, color: { rgb: '046241' }, name: 'Arial', sz: 10 },
  fill:      { fgColor: { rgb: 'F5EEDB' }, patternType: 'solid' },
  alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
  border: {
    top:    { style: 'thin', color: { rgb: 'C9B97A' } },
    bottom: { style: 'thin', color: { rgb: 'C9B97A' } },
    left:   { style: 'thin', color: { rgb: 'C9B97A' } },
    right:  { style: 'thin', color: { rgb: 'C9B97A' } },
  },
};

// Alternating: even rows = #FFC370, odd rows = #FFE4B5 (lighter)
const rowDataStyle = (rowIndex: number) => ({
  font:      { name: 'Arial', sz: 10, color: { rgb: '133020' } },
  fill:      { fgColor: { rgb: rowIndex % 2 === 0 ? 'FFF3DC' : 'FFE4B5' }, patternType: 'solid' },
  alignment: { vertical: 'center', wrapText: true },
  border: {
    top:    { style: 'thin', color: { rgb: 'E8A830' } },
    bottom: { style: 'thin', color: { rgb: 'E8A830' } },
    left:   { style: 'thin', color: { rgb: 'E8A830' } },
    right:  { style: 'thin', color: { rgb: 'E8A830' } },
  },
});

const TOTAL_STYLE = {
  font:      { bold: true, name: 'Arial', sz: 10, color: { rgb: 'FFFFFF' } },
  fill:      { fgColor: { rgb: '046241' }, patternType: 'solid' },
  alignment: { horizontal: 'center', vertical: 'center' },
  border: {
    top:    { style: 'medium', color: { rgb: '046241' } },
    bottom: { style: 'medium', color: { rgb: '046241' } },
    left:   { style: 'medium', color: { rgb: '046241' } },
    right:  { style: 'medium', color: { rgb: '046241' } },
  },
};

// ── Sheet builder ──────────────────────────────────────────────────────────
// Layout (1-indexed Excel rows):
//   Row 1      = merged title
//   Row 2      = column headers
//   Row 3..N+2 = data rows
//   Row N+3    = totals row

type TotalCell = { col: number; formula?: string; label?: string };

const DATA_START_EXCEL_ROW = 3;

const buildSheet = (
  sheetTitle: string,
  headers: string[],
  rows: (string | number)[][],
  colWidths: number[],
  totalCells: TotalCell[]
) => {
  const colCount  = headers.length;
  const dataCount = rows.length;

  const titleRowIdx   = 0;
  const headerRowIdx  = 1;
  const totalRowIdx   = 2 + dataCount;

  const dataFirstExcel = DATA_START_EXCEL_ROW;
  const dataLastExcel  = DATA_START_EXCEL_ROW + dataCount - 1;

  const titleRow      = Array(colCount).fill('');
  titleRow[0]         = sheetTitle;
  const blankTotalRow = Array(colCount).fill('');
  const aoa           = [titleRow, headers, ...rows, blankTotalRow];

  const ws = XLSX.utils.aoa_to_sheet(aoa);

  // ── Merge title row ──────────────────────────────────────────────────────
  ws['!merges'] = [{ s: { r: titleRowIdx, c: 0 }, e: { r: titleRowIdx, c: colCount - 1 } }];

  for (let c = 0; c < colCount; c++) {
    const addr = XLSX.utils.encode_cell({ r: titleRowIdx, c });
    if (!ws[addr]) ws[addr] = { t: 's', v: '' };
    ws[addr].s = TITLE_STYLE;
  }

  // ── Header row ───────────────────────────────────────────────────────────
  for (let c = 0; c < colCount; c++) {
    const addr = XLSX.utils.encode_cell({ r: headerRowIdx, c });
    if (!ws[addr]) ws[addr] = { t: 's', v: '' };
    ws[addr].s = HEADER_STYLE;
  }

  // ── Data rows — alternating stripe ───────────────────────────────────────
  for (let r = 0; r < dataCount; r++) {
    const style = rowDataStyle(r);
    for (let c = 0; c < colCount; c++) {
      const addr = XLSX.utils.encode_cell({ r: 2 + r, c });
      if (!ws[addr]) ws[addr] = { t: 's', v: '' };
      ws[addr].s = style;
    }
  }

  // ── Total row ─────────────────────────────────────────────────────────────
  for (let c = 0; c < colCount; c++) {
    const addr = XLSX.utils.encode_cell({ r: totalRowIdx, c });
    if (!ws[addr]) ws[addr] = { t: 's', v: '' };
    ws[addr].s = TOTAL_STYLE;
  }

  for (const { col, formula, label } of totalCells) {
    const addr = XLSX.utils.encode_cell({ r: totalRowIdx, c: col });
    if (formula) {
      const resolved = formula
        .replace('{FIRST}', String(dataFirstExcel))
        .replace('{LAST}',  String(dataLastExcel));
      ws[addr] = { t: 'n', f: resolved, s: TOTAL_STYLE };
    } else if (label !== undefined) {
      ws[addr] = { t: 's', v: label, s: TOTAL_STYLE };
    }
  }

  // ── Column widths, row heights, freeze panes ─────────────────────────────
  ws['!cols']   = colWidths.map((w) => ({ wch: w }));
  ws['!rows']   = [{ hpt: 30 }, { hpt: 22 }];
  ws['!freeze'] = { xSplit: 0, ySplit: 2, topLeftCell: 'A3', activePane: 'bottomLeft' };
  ws['!ref']    = XLSX.utils.encode_range({ r: 0, c: 0 }, { r: totalRowIdx, c: colCount - 1 });

  return ws;
};

// ── Main export ────────────────────────────────────────────────────────────

export const generateApplicantsExcel = async (): Promise<void> => {
  const { data: raw, error } = await supabase
    .from('applicants')
    .select(`
      id,
      first_name,
      last_name,
      middle_name,
      gender,
      age,
      phone_number,
      email,
      position_applied,
      country,
      current_address,
      uploaded_cv,
      new_applicant_status,
      created_at,
      designations ( designation_name ),
      schools ( school_name ),
      applicant_statuses ( status_name )
    `)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);

  const applicants = (raw || []).map((r: any) => ({
    date:         formatDate(r.created_at),
    dateKey:      formatDateKey(r.created_at),
    firstName:    toTitleCase(r.first_name),
    lastName:     toTitleCase(r.last_name),
    middleName:   toTitleCase(r.middle_name) || '—',
    gender:       toTitleCase(r.gender),
    age:          r.age ?? '',
    phone:        r.phone_number ?? '',
    email:        r.email ?? '',
    position:     r.position_applied ?? '',
    designation:  toTitleCase(r.designations?.designation_name) || '—',
    school:       toTitleCase(r.schools?.school_name) || '—',
    country:      toTitleCase(r.country),
    status:       toTitleCase(r.applicant_statuses?.status_name) || 'Unassigned',
    newApplicant: r.new_applicant_status ? 'Yes' : 'No',
    address:      toTitleCase(r.current_address),
    cvUploaded:   r.uploaded_cv ? 'Yes' : 'No',
  }));

  const wb = XLSX.utils.book_new();

  // ── Sheet 1: Applicants ──────────────────────────────────────────────────
  {
    const headers = [
      'Date', 'First Name', 'Last Name', 'Middle Name', 'Gender', 'Age',
      'Phone Number', 'Email Address', 'Position Applied', 'Applying As',
      'School', 'Country', 'Status', 'New Applicant', 'Current Address', 'CV Uploaded',
    ];
    const rows = applicants.map((a) => [
      a.date, a.firstName, a.lastName, a.middleName, a.gender, a.age,
      a.phone, a.email, a.position, a.designation,
      a.school, a.country, a.status, a.newApplicant, a.address, a.cvUploaded,
    ]);
    const ws = buildSheet('Applicants', headers, rows,
      [14, 14, 14, 14, 10, 6, 16, 28, 20, 14, 28, 14, 12, 14, 30, 12],
      [
        { col: 0, label: 'TOTAL' },
        { col: 5, formula: 'COUNTA(A{FIRST}:A{LAST})' },
      ]
    );
    XLSX.utils.book_append_sheet(wb, ws, 'Applicants');
  }

  // ── Sheet 2: Applicants per Day ──────────────────────────────────────────
  {
    const headers = ['Date', 'Total Interns', 'Total Employees'];

    const byDate: Record<string, { interns: number; employees: number }> = {};
    for (const a of applicants) {
      if (!byDate[a.dateKey]) byDate[a.dateKey] = { interns: 0, employees: 0 };
      const desig = a.designation.toLowerCase();
      if (desig === 'intern')        byDate[a.dateKey].interns++;
      else if (desig === 'employee') byDate[a.dateKey].employees++;
    }

    const sortedDates = Object.keys(byDate).sort((a, b) => b.localeCompare(a));
    const rows = sortedDates.map((dk) => {
      const d = new Date(dk);
      const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      return [label, byDate[dk].interns, byDate[dk].employees];
    });

    const ws = buildSheet('Applicants per Day', headers, rows,
      [16, 16, 18],
      [
        { col: 0, label: 'TOTAL' },
        { col: 1, formula: 'SUM(B{FIRST}:B{LAST})' },
        { col: 2, formula: 'SUM(C{FIRST}:C{LAST})' },
      ]
    );
    XLSX.utils.book_append_sheet(wb, ws, 'Applicants per Day');
  }

  // ── Sheet 3: Summary of Applicants ──────────────────────────────────────
  {
    const headers = ['Category', 'Total'];
    const rows: (string | number)[][] = [
      ['Total Interns',   applicants.filter((a) => a.designation.toLowerCase() === 'intern').length],
      ['Total Employees', applicants.filter((a) => a.designation.toLowerCase() === 'employee').length],
    ];
    const ws = buildSheet('Summary of Applicants', headers, rows,
      [22, 12],
      [
        { col: 0, label: 'Grand Total' },
        { col: 1, formula: 'SUM(B{FIRST}:B{LAST})' },
      ]
    );
    XLSX.utils.book_append_sheet(wb, ws, 'Summary of Applicants');
  }

  // ── Sheets 4–6: Hired / Rejected / Pending ───────────────────────────────
  const statusSheets: { status: string; sheetName: string }[] = [
    { status: 'hired',    sheetName: 'Applicants Hired'    },
    { status: 'rejected', sheetName: 'Applicants Rejected' },
    { status: 'pending',  sheetName: 'Pending Applicants'  },
  ];

  for (const { status, sheetName } of statusSheets) {
    const headers = ['Date', 'First Name', 'Last Name', 'Middle Name', 'Designation', 'CV Uploaded'];
    const filtered = applicants.filter((a) => a.status.toLowerCase() === status);
    const rows = filtered.map((a) => [
      a.date, a.firstName, a.lastName, a.middleName, a.designation, a.cvUploaded,
    ]);
    const ws = buildSheet(sheetName, headers, rows,
      [14, 14, 14, 14, 14, 12],
      [
        { col: 0, label: 'TOTAL' },
        { col: 1, formula: 'COUNTA(B{FIRST}:B{LAST})' },
      ]
    );
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
  }

  // ── Download ─────────────────────────────────────────────────────────────
  const today = new Date().toISOString().split('T')[0];
  XLSX.writeFile(wb, `lifewood_applicants_report_${today}.xlsx`);
};