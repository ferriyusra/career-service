class CompanyService {
  constructor(repository) {
    this.repository = repository;
  }

  async listJobs(paging) {
    return this.repository.listJobs(paging);
  }

  async getJob(id) {
    try {
      return this.repository.getJob(id);
    } catch (error) {
      throw error;
    }
  }

  async createJob(data) {
    try {
      return this.repository.createJob(data);
    } catch (error) {
      throw error;
    }
  }

  async updateJob(id, data) {
    try {
      return this.repository.updateJob(id, data);
    } catch (error) {
      throw error;
    }
  }

  async deleteJob(id) {
    try {
      return await this.repository.updateJob(id, {
        deletedAt: new Date(),
      });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = CompanyService;
