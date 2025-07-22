import AppointmentRepository from "../repositories/appointment.repository";
import { Appointment } from "@prisma/client";
import { parseISO } from "date-fns";

export class AppointmentService {
  async book(
    userId: string,
    dentistId: string,
    startTs: string,
    endTs: string
  ): Promise<Appointment> {
    const start = parseISO(startTs);
    const end = parseISO(endTs);

    const dentistOverlap = await AppointmentRepository.findDentistOverlapping(
      dentistId,
      start,
      end
    );
    if (dentistOverlap.length > 0) {
      throw {
        statusCode: 400,
        message: "That dentist already has an appointment in this time slot.",
      };
    }

    const userOverlap = await AppointmentRepository.findUserOverlapping(
      userId,
      start,
      end
    );
    if (userOverlap.length > 0) {
      throw {
        statusCode: 400,
        message: "You already have an appointment in this time slot.",
      };
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

  async availability(dentistId: string, date: string) {
    return AppointmentRepository.findByDentistAndDate(dentistId, date);
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

    const start = parseISO(newStartTs);
    const end = parseISO(newEndTs);

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
