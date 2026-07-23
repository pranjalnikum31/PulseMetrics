const {
    createProjectService,
    getAllProjectsService,
    getProjectByIdService
} = require("../services/project.service");

const createProject = async (req, res) => {
    const result = await createProjectService(req.body, req.user);

    res.status(result.success ? 201 : 400).json(result);
};

const getAllProjects = async (req, res) => {
    const result=await getAllProjectsService(req.user);
    res.status(result.success ? 200 : 400).json(result);
}
const getProjectById = async (req, res) => {
    const result=await getProjectByIdService(req.params.id,req.user);
    res.status(result.success ? 200 : 400).json(result);
}

module.exports = {
    createProject,
    getAllProjects,
    getProjectById
};