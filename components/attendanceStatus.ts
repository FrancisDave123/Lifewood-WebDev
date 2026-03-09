export type AttendanceStatus = 'present' | 'absent' | 'late' | 'early-out' | 'remote';

export type AttendanceRecord = {
  date: string;
  status: AttendanceStatus;
  reason?: string;
};

export type LegacyAttendanceException = {
  date: string;
  reason: string;
};

export const mergeLegacyAttendanceRecords = (
  records?: AttendanceRecord[],
  legacy?: LegacyAttendanceException[]
): AttendanceRecord[] => {
  const normalized = Array.isArray(records) ? [...records] : [];
  if (Array.isArray(legacy)) {
    legacy.forEach((entry) => {
      if (!normalized.some((record) => record.date === entry.date)) {
        normalized.push({
          date: entry.date,
          status: 'absent',
          reason: entry.reason
        });
      }
    });
  }
  normalized.sort((a, b) => a.date.localeCompare(b.date));
  return normalized;
};

const ATTENDANCE_STATUS_DETAILS: Record<AttendanceStatus, { label: string; legendClass: string; cellClass: string }> = {
  present: {
    label: 'Present',
    legendClass: 'bg-lifewood-green/70',
    cellClass: 'bg-lifewood-green/70 text-white'
  },
  absent: {
    label: 'Absent',
    legendClass: 'bg-red-400/80',
    cellClass: 'bg-red-400/80 text-white'
  },
  late: {
    label: 'Late',
    legendClass: 'bg-lifewood-yellow/80',
    cellClass: 'bg-lifewood-yellow/80 text-lifewood-serpent/90'
  },
  'early-out': {
    label: 'Early Out',
    legendClass: 'bg-orange-400/90',
    cellClass: 'bg-orange-400/90 text-white'
  },
  remote: {
    label: 'Remote',
    legendClass: 'bg-sky-500/80',
    cellClass: 'bg-sky-500/80 text-white'
  }
};

export const ATTENDANCE_STATUS_OPTIONS = (Object.keys(ATTENDANCE_STATUS_DETAILS) as AttendanceStatus[]).map((status) => ({
  value: status,
  label: ATTENDANCE_STATUS_DETAILS[status].label
}));

export const ATTENDANCE_STATUS_LEGEND = (Object.keys(ATTENDANCE_STATUS_DETAILS) as AttendanceStatus[]).map((status) => ({
  value: status,
  label: ATTENDANCE_STATUS_DETAILS[status].label,
  legendClass: ATTENDANCE_STATUS_DETAILS[status].legendClass
}));

export const getAttendanceCellClass = (status: AttendanceStatus) => ATTENDANCE_STATUS_DETAILS[status].cellClass;
export const getAttendanceLabel = (status: AttendanceStatus) => ATTENDANCE_STATUS_DETAILS[status].label;
