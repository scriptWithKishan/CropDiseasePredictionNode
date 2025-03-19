const getAllFactory = function (ElementModel) {
  return async function (req, res) {
    try {
      //execute query
      const data = await ElementModel.find();

      if (data.length == 0) {
        throw new Error("No Data Found");
      }
      res.status(200).json({
        status: "success",
        message: "Data found",
        data,
      });
    } catch (err) {
      res.status(404).json({
        status: "failure",
        message: `Error: ${err.message}`,
      });
    }
  };
};

const createFactory = function (ElementModel) {
  return async function (req, res) {
    try {
      const dataDetails = req.body;
      //adding data DB
      const data = await ElementModel.create(dataDetails);
      res.status(200).json({
        status: "success",
        message: "Added data successfully",
        data,
      });
    } catch (err) {
      res.status(500).json({
        status: "failure",
        message: err.message,
      });
    }
  };
};

const getByIdFactory = function (ElementModel) {
  return async function (req, res) {
    try {
      const { dataId } = req.params;
      const dataDetails = await ElementModel.findById(dataId);
      if (!dataDetails) {
        throw new Error(`data with ${dataId} not found`);
      } else {
        res.status(200).json({
          status: "success",
          message: "Data found",
          dataDetails,
        });
      }
    } catch (err) {
      res.status(404).json({
        status: "failure",
        message: err.message,
      });
    }
  };
};

const deleteByIdFactory = function (ElementModel) {
  return async function (req, res) {
    const { dataId } = req.params;
    try {
      const data = await ElementModel.findByIdAndDelete(dataId);
      res.status(200).json({
        status: "successfully deleted",
        message: data,
      });
    } catch (err) {
      res.status(404).json({
        status: "failure",
        message: `Data with ${dataId} was not found. Error Message: ${err.message}`,
      });
    }
  };
};

module.exports = {
  getAllFactory,
  createFactory,
  getByIdFactory,
  deleteByIdFactory,
};
