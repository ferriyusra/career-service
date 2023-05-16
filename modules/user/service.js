class UserService {
  constructor(repository) {
    this.repository = repository;
  }

  async getCompanyByNameOrEmail(name, email) {
    try {
      return this.repository.getCompanyByNameOrEmail(name, email);
    } catch (error) {
      throw error;
    }
  }

  async getUserCompany(email) {
    try {
      return this.repository.getUserCompany(email);
    } catch (error) {
      throw error;
    }
  }

  async createUser(data) {
    try {
      return this.repository.createUser(data);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UserService;
