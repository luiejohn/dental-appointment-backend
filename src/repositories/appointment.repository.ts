import { prisma } from "../utils/prisma";
import { Appointment } from "@prisma/client";

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

  async findByUserId(userId: string): Promise<Appointment[]> {
    return prisma.appointment.findMany({
      where: { userId },
      orderBy: { startTs: "asc" },
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
