import { prisma } from "../utils/prisma";
import { Dentist } from "@prisma/client";

export class DentistRepository {
  async create(data: {
    name: string;
    specialization: string;
    profilePhotoUrl?: string;
  }): Promise<Dentist> {
    return prisma.dentist.create({ data });
  }

  async findAll(): Promise<Dentist[]> {
    return prisma.dentist.findMany();
  }

  async findById(id: string): Promise<Dentist | null> {
    return prisma.dentist.findUnique({ where: { id } });
  }

  async update(
    id: string,
    data: {
      name?: string;
      specialization?: string;
      profilePhotoUrl?: string;
    }
  ): Promise<Dentist> {
    return prisma.dentist.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await prisma.dentist.delete({ where: { id } });
  }
}

export default new DentistRepository();
