import { useState, useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { formatDateForInput, formatDateForApi } from "../../utils/dateUtils";

const OrderModal = ({ show, onHide, items, onSave, addNotification }) => {
  const [formData, setFormData] = useState({
    quantity: "",
    item_id: "",
  });
  const [selectedItemId, setSelectedItemId] = useState(null);
  const handleSelectItem = (itemId) => {
    setSelectedItemId(itemId);
    setFormData({ ...formData, item_id: selectedItemId });
    console.log("Selected Item ID:", itemId);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSubmit = {
        ...formData,
      };
      console.log(dataToSubmit);
      return;
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

  function ItemDropDown({ items, onSelectItem }) {
    console.log(items);
    const handleChange = (event) => {
      const selectedId = event.target.value;
      console.log(selectedId);
      onSelectItem(selectedId);
    };

    return (
      <Form.Select aria-label="Default select example" onChange={handleChange}>
        {items.map((item) => (
          <option key={item.ROWID} value={item.ROWID}>
            {item.name}
          </option>
        ))}
      </Form.Select>
    );
  }
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Make Order</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Item Name</Form.Label>
            <ItemDropDown items={items} onSelectItem={handleSelectItem} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Quantity</Form.Label>
            <Form.Control
              type="number"
              value={formData.quantity}
              onChange={(e) =>
                setFormData({ ...formData, quantity: e.target.value })
              }
              placeholder="Enter quantity"
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

export default OrderModal;
