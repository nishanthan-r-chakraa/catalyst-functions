import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Pagination,
  Badge,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import ItemModal from "./ItemModal";
import {
  createItems,
  deleteItem,
  fetchItems,
  updateItem,
} from "../../services/api";
import { formatDateDisplay } from "../../utils/dateUtils";
import OrderModal from "../Order/OrderModal";
const ItemList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [showModal, setShowModal] = useState(false);
  const [orderModal, setOrderModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    loadItems();
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

  const loadItems = async () => {
    try {
      setLoading(true);
      const itemData = await fetchItems();
      setItems(itemData);
      setError(null);
    } catch (err) {
      setError("Failed to load items");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleDelete = async (item) => {
    try {
      await deleteItem(item.ROWID);
      await loadItems();
      addNotification("Item deleted successfully", "success");
    } catch (err) {
      addNotification("Failed to delete item", "danger");
      console.error(err);
    }
  };

  const handleSave = async (formData) => {
    try {
      let response;
      console.log(selectedItem);
      if (selectedItem) {
        // If editing, call update API with item ID
        response = await updateItem(selectedItem.ROWID, formData);
      } else {
        // If creating, call create API
        response = await createItems(formData);
      }
      console.log(response);
      if (response.status != "success") {
        const errorMessages = response.details || ["Something went wrong"];
        return { error: errorMessages };
      }

      // Reload the items list
      await loadItems();

      // Close modal and reset selected item
      setShowModal(false);
      setSelectedItem(null);
      return { success: true };
    } catch (error) {
      console.error("Failed to save item:", error);
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
    setSelectedItem(null);
  };

  // Get current items for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  console.log(items);
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(items.length / itemsPerPage);

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

  if (loading) return <div className="text-center p-5">Loading items...</div>;
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
        <h2>Items</h2>
        <Button variant="success" onClick={() => setOrderModal(true)}>
          Make Order
        </Button>
        <Button variant="success" onClick={() => setShowModal(true)}>
          Add Item
        </Button>
      </div>

      <Table responsive striped bordered hover>
        <thead>
          <tr>
            <th>Item Name</th>
            <th>Price</th>
            {/* <th>Start Date</th>
            <th>End Date</th>
            <th>Progress</th>
            <th>Tasks</th> */}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item) => (
            <tr key={item.id}>
              <td>
                <div className="fw-bold">{item.name}</div>
                {/* <small className="text-muted">Key: {item.key}</small> */}
              </td>
              {/* <td>{getStatusBadge(item.custom_status_name)}</td>
              <td>{formatDateDisplay(item.start_date)}</td>
              <td>{formatDateDisplay(item.end_date)}</td> */}
              <td>{item.price}</td>
              <td>
                <Button
                  variant="warning"
                  size="sm"
                  className="me-2"
                  onClick={() => handleEdit(item)}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(item)}
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

      <ItemModal
        show={showModal}
        onHide={handleModalClose}
        item={selectedItem}
        onSave={handleSave}
        addNotification={addNotification}
      />
      <OrderModal
        show={orderModal}
        onHide={handleModalClose}
        items={items}
        onSave={handleSave}
        addNotification={addNotification}
      />
    </div>
  );
};

export default ItemList;
