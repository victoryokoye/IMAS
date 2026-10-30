import { db } from "../prisma/db";

export interface DashboardSummary {
  totalInterns: number;
  activeInterns: number;
  inactiveInterns: number;
  presentToday: number;
  signedOutToday: number;
  currentlyPresent: number;
  totalStaff: number;
  activeProjects: number;
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const { Intern, Staff, Project, Attendance } = db.orm.public;

  // "Today" in the company's configured timezone, not the server's
  const today = Temporal.Now.plainDateISO(process.env.TIMEZONE);

  const [internTotal, internActive, staffTotal, projectsOpen, todayRows] =
    await Promise.all([
      Intern.aggregate((a) => ({ total: a.count() })),
      Intern.where({ status: "ACTIVE" }).aggregate((a) => ({
        total: a.count(),
      })),
      Staff.aggregate((a) => ({ total: a.count() })),
      Project.where({ status: "OPEN" }).aggregate((a) => ({
        total: a.count(),
      })),
      Attendance.where({ date: today })
        .select("status", "signInTime", "signOutTime")
        .all(),
    ]);

  const totalInterns = Number(internTotal.total);
  const activeInterns = Number(internActive.total);

  // Today's attendance, computed from at most one row per intern
  const presentRows = todayRows.filter(
    (r) => r.status === "PRESENT" && r.signInTime !== null,
  );
  const presentToday = presentRows.length;
  const signedOutToday = presentRows.filter(
    (r) => r.signOutTime !== null,
  ).length;

  return {
    totalInterns,
    activeInterns,
    inactiveInterns: totalInterns - activeInterns,
    presentToday,
    signedOutToday,
    currentlyPresent: presentToday - signedOutToday,
    totalStaff: Number(staffTotal.total),
    activeProjects: Number(projectsOpen.total),
  };
}
