import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Pagination,
  Badge,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import ProjectModal from "../ProjectModal/ProjectModal";
import {
  createProject,
  deleteProject,
  fetchProjects,
  updateProject,
} from "../../services/api";
import { formatDateDisplay } from "../../utils/dateUtils";
const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [showModal, setShowModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    loadProjects();
  }, []);

  const addNotification = (message, type = "danger") => {
    setNotifications((prev) => [
      ...prev,
      {
        id: Date.now(),
        message,
        type,
      },
    ]);
  };

  const loadProjects = async () => {
    try {
      setLoading(true);
      const projectData = await fetchProjects();
      setProjects(projectData);
      setError(null);
    } catch (err) {
      setError("Failed to load projects");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (project) => {
    setSelectedProject(project);
    setShowModal(true);
  };

  const handleDelete = async (project) => {
    try {
      await deleteProject(project.id_string);
      await loadProjects();
      addNotification("Project deleted successfully", "success");
    } catch (err) {
      addNotification("Failed to delete project", "danger");
      console.error(err);
    }
  };

  const handleSave = async (formData) => {
    try {
      let response;

      if (selectedProject) {
        // If editing, call update API with project ID
        response = await updateProject(selectedProject.id_string, formData);
      } else {
        // If creating, call create API
        response = await createProject(formData);
      }

      if (!response.success) {
        const errorMessages = response.details || ["Something went wrong"];
        return { error: errorMessages };
      }

      // Reload the projects list
      await loadProjects();

      // Close modal and reset selected project
      setShowModal(false);
      setSelectedProject(null);
      return { success: true };
    } catch (error) {
      console.error("Failed to save project:", error);
      return { error: "Something went wrong. Please try again." };
    }
  };

  const removeNotification = (notificationId) => {
    setNotifications(
      notifications.filter((notif) => notif.id !== notificationId)
    );
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedProject(null);
  };

  // Get current projects for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProjects = projects.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(projects.length / itemsPerPage);

  const getStatusBadge = (status) => {
    const statusColors = {
      active: "success",
      inactive: "secondary",
      completed: "primary",
    };
    return (
      <Badge bg={statusColors[status.toLowerCase()] || "secondary"}>
        {status}
      </Badge>
    );
  };

  if (loading)
    return <div className="text-center p-5">Loading projects...</div>;
  if (error) return <div className="text-center p-5 text-danger">{error}</div>;

  return (
    <div className="p-4">
      <ToastContainer
        position="top-end"
        className="p-3"
        style={{ zIndex: 1100 }}
      >
        {notifications.map((notification) => (
          <Toast
            key={notification.id}
            onClose={() => removeNotification(notification.id)}
            show={true}
            autohide
            delay={5000}
            bg={notification.type}
          >
            <Toast.Header closeButton>
              <strong className="me-auto">
                {notification.type === "success" ? "Success" : "Error"}
              </strong>
            </Toast.Header>
            <Toast.Body className="text-white">
              {notification.message}
            </Toast.Body>
          </Toast>
        ))}
      </ToastContainer>

      <div className="d-flex justify-content-between mb-4">
        <h2>Projects</h2>
        <Button variant="success" onClick={() => setShowModal(true)}>
          Add Project
        </Button>
      </div>

      <Table responsive striped bordered hover>
        <thead>
          <tr>
            <th>Project Name</th>
            <th>Status</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Progress</th>
            <th>Tasks</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentProjects.map((project) => (
            <tr key={project.id}>
              <td>
                <div className="fw-bold">{project.name}</div>
                <small className="text-muted">Key: {project.key}</small>
              </td>
              <td>{getStatusBadge(project.custom_status_name)}</td>
              <td>{formatDateDisplay(project.start_date)}</td>
              <td>{formatDateDisplay(project.end_date)}</td>
              <td>
                <div className="progress" style={{ height: "20px" }}>
                  <div
                    className="progress-bar"
                    role="progressbar"
                    style={{ width: `${project.project_percent}%` }}
                    aria-valuenow={project.project_percent}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  >
                    {project.project_percent}%
                  </div>
                </div>
              </td>
              <td>
                <div>Open: {project.task_count.open}</div>
                <div>Closed: {project.task_count.closed}</div>
              </td>
              <td>
                <Button
                  variant="warning"
                  size="sm"
                  className="me-2"
                  onClick={() => handleEdit(project)}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(project)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {totalPages > 1 && (
        <Pagination className="justify-content-center">
          <Pagination.Prev
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          />
          {[...Array(totalPages)].map((_, idx) => (
            <Pagination.Item
              key={idx + 1}
              active={idx + 1 === currentPage}
              onClick={() => setCurrentPage(idx + 1)}
            >
              {idx + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          />
        </Pagination>
      )}

      <ProjectModal
        show={showModal}
        onHide={handleModalClose}
        project={selectedProject}
        onSave={handleSave}
        addNotification={addNotification}
      />
    </div>
  );
};

export default ProjectList;
