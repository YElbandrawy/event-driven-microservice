module.exports = (userlog) => {
  //Change status field
  //Means NOTHING, just simulating log processing by changing the status to Procesed'
  userlog.status = 'Processed';
  return userlog;
};
