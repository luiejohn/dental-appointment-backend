import { prisma } from "../utils/prisma";
import { Appointment, Dentist } from "@prisma/client";
import { parseISO, startOfDay, endOfDay } from "date-fns";

export class AppointmentRepository {
  async create(data: {
    userId: string;
    dentistId: string;
    startTs: Date;
    endTs: Date;
    status?: string;
  }): Promise<Appointment> {
    return prisma.appointment.create({ data });
  }

  async findOverlapping(
    dentistId: string,
    startTs: Date,
    endTs: Date
  ): Promise<Appointment[]> {
    return prisma.appointment.findMany({
      where: {
        dentistId,
        AND: [
          { startTs: { lt: endTs } },
          { endTs: { gt: startTs } },
          { status: { in: ["BOOKED", "RESCHEDULED"] } },
        ],
      },
    });
  }

  async findDentistOverlapping(dentistId: string, start: Date, end: Date) {
    return prisma.appointment.findMany({
      where: {
        dentistId,
        AND: [
          { startTs: { lt: end } },
          { endTs: { gt: start } },
          { status: { in: ["BOOKED", "RESCHEDULED"] } },
        ],
      },
    });
  }

  async findUserOverlapping(userId: string, start: Date, end: Date) {
    return prisma.appointment.findMany({
      where: {
        userId,
        AND: [
          { startTs: { lt: end } },
          { endTs: { gt: start } },
          { status: { in: ["BOOKED", "RESCHEDULED"] } },
        ],
      },
    });
  }

  async findByDentistAndDate(
    dentistId: string,
    date: string
  ): Promise<Appointment[]> {
    const parsedDate = parseISO(date);
    const dayStart = startOfDay(parsedDate);
    const dayEnd = endOfDay(parsedDate);

    return prisma.appointment.findMany({
      where: {
        dentistId,
        startTs: { gte: dayStart, lte: dayEnd },
        status: { in: ["BOOKED", "RESCHEDULED"] },
      },
    });
  }

  async findByUserId(
    userId: string
  ): Promise<(Appointment & { dentist: Dentist })[]> {
    return prisma.appointment.findMany({
      where: { userId },
      orderBy: { startTs: "asc" },
      include: {
        dentist: {
          select: {
            id: true,
            name: true,
            specialization: true,
            profilePhotoUrl: true,
          },
        },
      },
    });
  }

  async findById(id: string): Promise<Appointment | null> {
    return prisma.appointment.findUnique({ where: { id } });
  }

  async updateTime(
    id: string,
    startTs: Date,
    endTs: Date
  ): Promise<Appointment> {
    return prisma.appointment.update({
      where: { id },
      data: { startTs, endTs, status: "RESCHEDULED" },
    });
  }

  async updateStatus(id: string, status: string): Promise<Appointment> {
    return prisma.appointment.update({
      where: { id },
      data: { status },
    });
  }
}

export default new AppointmentRepository();
