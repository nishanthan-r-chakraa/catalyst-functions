import { useState, useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { formatDateForInput, formatDateForApi } from "../../utils/dateUtils";

const ProjectModal = ({ show, onHide, project, onSave, addNotification }) => {
  const [formData, setFormData] = useState({
    name: "",
    start_date: "",
    end_date: "",
    description: "",
    currency: "INR",
  });

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || "",
        start_date: formatDateForInput(project.start_date),
        end_date: formatDateForInput(project.end_date),
        description: project.description || "",
        currency: project.currency || "INR",
      });
    }
  }, [project]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSubmit = {
        ...formData,
        // status: "Active",
        start_date: formatDateForApi(formData.start_date),
        end_date: formatDateForApi(formData.end_date),
      };
      const result = await onSave(dataToSubmit);
      // const result = {
      //   success: true,
      // };
      console.log(result);
      if (result.error) {
        const errorMessages = Array.isArray(result.error)
          ? result.error
          : [result.error];
        errorMessages.forEach((message) => addNotification(message, "danger"));
        return;
      }
      addNotification("Project saved successfully!", "success");
      onHide();
    } catch (error) {
      console.log(error);
      addNotification(
        "An unexpected error occurred. Please try again.",
        "danger"
      );
    }
  };


  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{project ? "Edit Project" : "Add Project"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Project Name</Form.Label>
            <Form.Control
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Enter project description"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Currency</Form.Label>
            <Form.Select
              value={formData.currency}
              onChange={(e) =>
                setFormData({ ...formData, currency: e.target.value })
              }
            >
              <option value="INR">INR</option>
              <option value="USD">USD</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Start Date</Form.Label>
            <Form.Control
              type="date"
              value={formData.start_date}
              onChange={(e) =>
                setFormData({ ...formData, start_date: e.target.value })
              }
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>End Date</Form.Label>
            <Form.Control
              type="date"
              value={formData.end_date}
              onChange={(e) =>
                setFormData({ ...formData, end_date: e.target.value })
              }
              required
            />
          </Form.Group>
          <div className="text-end">
            <Button variant="secondary" className="me-2" onClick={onHide}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ProjectModal;
