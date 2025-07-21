import DentistRepository from "../repositories/dentist.repository";
import { Dentist } from "@prisma/client";

export class DentistService {
  async createDentist(input: {
    name: string;
    specialization: string;
    profilePhotoUrl?: string;
  }): Promise<Dentist> {
    return DentistRepository.create(input);
  }

  async listDentists(): Promise<Dentist[]> {
    return DentistRepository.findAll();
  }

  async getDentist(id: string): Promise<Dentist> {
    const dentist = await DentistRepository.findById(id);
    if (!dentist) {
      throw { statusCode: 404, message: "Dentist not found" };
    }
    return dentist;
  }

  async updateDentist(
    id: string,
    data: {
      name?: string;
      specialization?: string;
      profilePhotoUrl?: string;
    }
  ): Promise<Dentist> {
    await this.getDentist(id);
    return DentistRepository.update(id, data);
  }

  async deleteDentist(id: string): Promise<void> {
    await this.getDentist(id);
    await DentistRepository.delete(id);
  }
}

export default new DentistService();
