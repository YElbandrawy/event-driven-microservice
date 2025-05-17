//This is interface-like class
//so we can switch between database implementations without changing the business logic
class LogRepository {
  async save(log) {
    throw new Error('Method not implemented');
  }

  async find(filter) {
    throw new Error('Method not implemented');
  }
}

module.exports = LogRepository;
