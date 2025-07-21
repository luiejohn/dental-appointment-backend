import AppointmentRepository from "../repositories/appointment.repository";
import { Appointment } from "@prisma/client";

export class AppointmentService {
  async book(
    userId: string,
    dentistId: string,
    startTs: string,
    endTs: string
  ): Promise<Appointment> {
    const start = new Date(startTs);
    const end = new Date(endTs);

    const overlapping = await AppointmentRepository.findOverlapping(
      dentistId,
      start,
      end
    );
    if (overlapping.length > 0) {
      throw { statusCode: 400, message: "Selected time slot is not available" };
    }

    return AppointmentRepository.create({
      userId,
      dentistId,
      startTs: start,
      endTs: end,
    });
  }

  async list(userId: string): Promise<Appointment[]> {
    return AppointmentRepository.findByUserId(userId);
  }

  async reschedule(
    userId: string,
    appointmentId: string,
    newStartTs: string,
    newEndTs: string
  ): Promise<Appointment> {
    const appt = await AppointmentRepository.findById(appointmentId);
    if (!appt || appt.userId !== userId) {
      throw { statusCode: 404, message: "Appointment not found" };
    }

    const start = new Date(newStartTs);
    const end = new Date(newEndTs);

    const overlapping = await AppointmentRepository.findOverlapping(
      appt.dentistId,
      start,
      end
    );
    if (overlapping.some((o) => o.id !== appointmentId)) {
      throw { statusCode: 400, message: "New time slot is not available" };
    }

    return AppointmentRepository.updateTime(appointmentId, start, end);
  }

  async cancel(userId: string, appointmentId: string): Promise<void> {
    const appt = await AppointmentRepository.findById(appointmentId);
    if (!appt || appt.userId !== userId) {
      throw { statusCode: 404, message: "Appointment not found" };
    }
    await AppointmentRepository.updateStatus(appointmentId, "CANCELLED");
  }
}

export default new AppointmentService();
