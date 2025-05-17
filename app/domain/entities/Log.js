//value objects: userId , action, status=>(processed/raw)
class Log {
  constructor(userId, action) {
    this.userId = userId;
    this.action = action;
    this.status = 'Raw';
  }
}
module.exports = Log;
