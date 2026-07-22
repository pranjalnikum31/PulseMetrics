const {createProject: createProjectService,} = require("../services/project.service");

const createProject = async (req, res) => {
    const result = await createProjectService(req.body, req.user);

    res.status(result.success ? 201 : 400).json(result);
};

module.exports = {
    createProject,
};