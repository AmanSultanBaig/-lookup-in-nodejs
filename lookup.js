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
    {
      $lookup: {
        from: "Nature",
        localField: "NatureId",
        foreignField: "_id",
        as: "nature_details",
      },
    },
    {
      $lookup: {
        from: "Execution_Status",
        localField: "ExecutionStatus",
        foreignField: "_id",
        as: "execution_status_details",
      },
    },
    {
      $lookup: {
        from: "Users",
        localField: "User",
        foreignField: "_id",
        as: "action_person",
      },
    },
    {
      $lookup: {
        from: "Engagement_Status",
        localField: "StatusId",
        foreignField: "_id",
        as: "status_details",
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

exports.getSummaryData = (req, res) => {
  let summaryPipeline = [
    {
      $lookup: {
        from: "Nature",
        localField: "NatureId",
        foreignField: "_id",
        as: "natures",
      },
    },
    {
      $lookup: {
        from: "Users",
        localField: "User",
        foreignField: "_id",
        as: "action_person",
      },
    },
    {
      $lookup: {
        from: "Execution_Status",
        localField: "ExecutionStatus",
        foreignField: "_id",
        as: "exceution_status",
      },
    },
    {
      $lookup: {
        from: "TeamAssignment",
        localField: "User",
        foreignField: "UserId",
        as: "action_person_team",
      },
    },
    {
      $lookup: {
        from: "TeamNames",
        localField: "action_person_team.TeamId",
        foreignField: "_id",
        as: "teams",
      },
    },

    { $unwind: "$natures" },
    { $unwind: "$exceution_status" },
    { $unwind: "$action_person" },
    { $unwind: "$action_person_team" },
    { $unwind: "$teams" },
    {
      $group: {
        _id: "$User",
        result: {
          $push: {
            nature: "$natures.Nature",
            NatureId: "$natures._id",
            status: "$exceution_status.Execution_Status",
            action_person: "$action_person.Name",
            action_person_id: "$action_person._id",
            Team: "$teams.Name",
            TeamId: "$teams._id",
          },
        },
      },
    },
  ];

  companyWorkSchema
    .aggregate(summaryPipeline)
    .then((result) => {
      res.status(200).json({
        status: "success",
        message: "Summary Report Fetched",
        data: result,
      });
    })
    .catch((err) => {
      res.status(400).json({
        status: "failed",
        message: "Error Occur " + err,
      });
    });
};
