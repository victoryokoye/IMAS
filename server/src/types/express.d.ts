import "express";

declare global {
  namespace IMAS {
    // ---------------------------------------------------------------------------
    // Primitive aliases and enums
    // ---------------------------------------------------------------------------

    /** UUID string supplied by the API/database. */
    type UUID = string;

    /** API date: YYYY-MM-DD. */
    type ISODate = string;

    /** ISO 8601 UTC timestamp, e.g. 2026-10-23T08:05:00.000Z. */
    type ISOTimestamp = string;

    type AttendanceStatus = "PRESENT" | "ABSENT" | "PERMITTED_ABSENCE";

    // ---------------------------------------------------------------------------
    // Shared API envelopes and errors
    // ---------------------------------------------------------------------------

    interface SuccessEnvelope<T> {
      status: "success";
      data: T;
    }

    interface PaginatedSuccessEnvelope<T> extends SuccessEnvelope<T[]> {
      meta: PaginationMeta;
    }

    interface PaginationMeta {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    }

    interface FieldValidationError {
      field: string;
      message: string;
    }

    interface ErrorEnvelope {
      status: "error";
      message: string;
      errors?: FieldValidationError[];
    }

    interface PaginationQuery {
      page?: number;
      limit?: number;
      search?: string;
    }

    interface StatusFilterQuery {
      status?: AccountStatus | ProjectStatus | AttendanceStatus;
    }

    // ---------------------------------------------------------------------------
    // Attendance endpoints
    // ---------------------------------------------------------------------------

    namespace Attendance {
      interface RecordedBy {
        id: UUID;
        fullName: string;
      }

      interface AttendanceListItem {
        id: UUID;
        internId: UUID;
        internName: string;
        date: ISODate;
        signInAt: ISOTimestamp | null;
        signOutAt: ISOTimestamp | null;
        recordedBy: RecordedBy | null;
      }

      interface AttendanceDetail extends AttendanceListItem {
        createdAt: ISOTimestamp;
        updatedAt: ISOTimestamp;
      }

      interface InternAttendanceItem {
        id: UUID;
        date: ISODate;
        signInAt: ISOTimestamp | null;
        signOutAt: ISOTimestamp | null;
        recordedBy: RecordedBy | null;
      }

      interface SignInBody {
        internId: UUID;
        pin: string;
      }

      interface SignOutBody {
        internId: UUID;
        pin: string;
      }

      interface CorrectAttendanceBody {
        date: ISODate;
        signInAt: ISOTimestamp | null;
        signOutAt: ISOTimestamp | null;
      }

      interface ListQuery extends PaginationQuery {
        startDate?: ISODate;
        endDate?: ISODate;
        internId?: UUID;
        status?: AttendanceStatus;
      }

      type ListResponse = PaginatedSuccessEnvelope<AttendanceListItem>;
      type DetailResponse = SuccessEnvelope<AttendanceDetail>;
      type InternHistoryResponse =
        PaginatedSuccessEnvelope<InternAttendanceItem>;
    }
  }
}

export {};
