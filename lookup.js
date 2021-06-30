const companyWorkSchema = require("../models/CompanyWork.Model");

exports.getCompanyData = (req, res) => {
  let pipeline = [
    {
      $lookup: {
        from: "WorkDetails",
        localField: "_id",
        foreignField: "CompanyWork_Id",
        as: "company_work_details",
      },
    },
    {
      $lookup: {
        from: "Companies",
        localField: "CompanyId",
        foreignField: "_id",
        as: "comapny_details",
      },
    },
    {
      $lookup: {
        from: "Jurisdiction",
        localField: "Jurisdiction",
        foreignField: "CompanyId.Jurisdiction",
        as: "jurisdiction_details",
      },
    },
    {
      $lookup: {
        from: "LegalStatus",
        localField: "LegalStatus",
        foreignField: "CompanyId.LegalStatus",
        as: "legal_status_details",
      },
    },
  ];

  companyWorkSchema
    .aggregate(pipeline)
    .then((data) => {
      res.status(200).json({
        status: "success",
        message: "Report Fetched",
        data: data,
      });
    })

    .catch((err) => {
      res.status(400).json({
        status: "failed",
        message: "Error Occur " + err,
      });
    });
};
