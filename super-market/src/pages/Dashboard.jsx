import { Row, Col, Card } from 'react-bootstrap';

const Dashboard = () => {
  return (
    <div className="p-4">
      <h2 className="mb-4">Dashboard</h2>
      <Row>
        <Col md={3} className="mb-4">
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Total Projects</Card.Title>
              <Card.Text className="display-4">42</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-4">
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Active Projects</Card.Title>
              <Card.Text className="display-4">28</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-4">
          <Card className="h-100">
            <Card.Body>
              <Card.Title>On Hold</Card.Title>
              <Card.Text className="display-4">10</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-4">
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Completed</Card.Title>
              <Card.Text className="display-4">4</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col md={6} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title>Recent Projects</Card.Title>
              <div className="list-group">
                <a href="#" className="list-group-item list-group-item-action">
                  <div className="d-flex justify-content-between">
                    <h6 className="mb-1">Website Redesign</h6>
                    <small>3 days ago</small>
                  </div>
                  <small className="text-muted">Active</small>
                </a>
                <a href="#" className="list-group-item list-group-item-action">
                  <div className="d-flex justify-content-between">
                    <h6 className="mb-1">Mobile App Development</h6>
                    <small>5 days ago</small>
                  </div>
                  <small className="text-muted">On Hold</small>
                </a>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title>Project Status Overview</Card.Title>
              <div className="mt-4">
                <h6>Website Redesign</h6>
                <div className="progress mb-3">
                  <div className="progress-bar" role="progressbar" style={{ width: '75%' }} aria-valuenow="75" aria-valuemin="0" aria-valuemax="100">75%</div>
                </div>
                <h6>Mobile App Development</h6>
                <div className="progress mb-3">
                  <div className="progress-bar" role="progressbar" style={{ width: '45%' }} aria-valuenow="45" aria-valuemin="0" aria-valuemax="100">45%</div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;