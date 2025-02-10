import { useState, useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { formatDateForInput, formatDateForApi } from "../../utils/dateUtils";

const ItemModal = ({ show, onHide, item, onSave, addNotification }) => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
  });

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || "",
        price: item.price || "",
      });
    }
  }, [item]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSubmit = {
        ...formData,
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
      addNotification("Item updated successfully!", "success");
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
        <Modal.Title>{item ? "Edit Item" : "Add Item"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Item Name</Form.Label>
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
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="number"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              placeholder="Enter Price"
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

export default ItemModal;
