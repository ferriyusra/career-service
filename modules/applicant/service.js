class ApplicantService {
  constructor(repository) {
    this.repository = repository;
  }

  async createApplicant(data) {
    try {
      return this.repository.createApplicant(data);
    } catch (error) {
      throw error;
    }
  }

  async updateApplicant(jobId, data) {
    try {
      return this.repository.updateApplicant(jobId, data);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ApplicantService;
