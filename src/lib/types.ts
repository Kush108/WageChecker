export type Province = "ON" | "BC" | "AB" | "QC"
export type EmploymentType = "hourly" | "salary"
export type ShiftCancelled = "yes" | "no" | "not_last_week"
export type StatHoliday = "yes" | "no" | "unsure"
export type VacationPay = "yes" | "sometimes" | "never"
export type Tenure = "lt1" | "1to3" | "3to5" | "5plus"

export type QuizAnswers = {
  province: Province
  employmentType: EmploymentType
  hourlyRate?: number
  annualSalary?: number
  hoursWorked: number
  shiftCancelled: ShiftCancelled
  cancelledShiftHours?: number
  statHoliday: StatHoliday
  vacationPay: VacationPay
  tenure: Tenure
  email?: string
  marketingOptIn?: boolean
}

export type ViolationSeverity = "HIGH" | "MEDIUM"

export type Violation = {
  id: string
  name: string
  section: string
  severity: ViolationSeverity
  shortDesc: string
  amount: number | null
  fullCalc: string
  employerMessage: string
  nextSteps: string[]
}

export type CalculationResult = {
  hourlyRate: number
  violations: Violation[]
  totalOwed: number
}

