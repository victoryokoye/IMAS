import { type Request, type Response, type NextFunction } from "express";
import { attendanceService } from "./attendance.service";

// Controllers only handle HTTP: read validated input, call the service, send the response.
export const attendanceController = {
  async checkIn(_req: Request, res: Response, next: NextFunction) {
    try {
      const { body } = res.locals.validated;
      const record = await attendanceService.checkIn(body);
      res.status(201).json(record);
    } catch (err) {
      next(err);
    }
  },

  async checkOut(_req: Request, res: Response, next: NextFunction) {
    try {
      const { body } = res.locals.validated;
      const record = await attendanceService.checkOut(body);
      res.json(record);
    } catch (err) {
      next(err);
    }
  },

  async markPermittedAbsence(_req: Request, res: Response, next: NextFunction) {
    try {
      const { body } = res.locals.validated;
      // const staffId = res.locals.staff!.id;
      const record = await attendanceService.markPermittedAbsence(
        body,
        // staffId,
      );
      res.json(record);
    } catch (err) {
      next(err);
    }
  },

  async editAttendance(req: Request, res: Response, next: NextFunction) {
    try {
      const { params } = res.locals.validated;
      const { body } = res.locals.validated;
      const input = { params, body };
      const data = await attendanceService.editAttendance(input);
      res.status(200).json({ status: "success", data });
    } catch (err) {
      next(err);
    }
  },

  async list(_req: Request, res: Response, next: NextFunction) {
    try {
      const { query } = res.locals.validated;
      const result = await attendanceService.list(query);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  async listByIntern(_req: Request, res: Response, next: NextFunction) {
    try {
      const { params, query } = res.locals.validated;
      const result = await attendanceService.listByIntern(params.id, query);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  async getById(_req: Request, res: Response, next: NextFunction) {
    try {
      const { params } = res.locals.validated;
      const record = await attendanceService.getById(params.id);
      res.json(record);
    } catch (err) {
      next(err);
    }
  },

  async deleteAttendance(_req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = res.locals.validated.params; // set by the validate middleware
      const data = await attendanceService.deleteAttendance(id);
      res.status(200).json({ status: "success", data });
    } catch (err) {
      next(err);
    }
  },
};
