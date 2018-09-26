module.exports = function(app) {
  app.dataSources.storage.connector.getFilename = function(uploadingFile, req, res) {
    return Math.random().toString().substr(2) + '.jpg';
  };
};
