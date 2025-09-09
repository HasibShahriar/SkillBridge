// home.js
import React from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import "./home.css";

export default function Home() {
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero d-flex align-items-center text-center">
        <Container>
          <h1 className="hero-title">SkillBridge</h1>
          <p className="hero-subtitle">
            A personalized learning and opportunity platform that helps
            <br />
            students and unemployed youth in Bangladesh build real-world
            skills
            <br />
            and directly access jobs, gigs, and scholarships all in one place.
          </p>
          <Button variant="primary" size="lg" className="rounded-pill px-4 mt-3" href="/login">
            Get Started
          </Button>
        </Container>
      </section>

      {/* Features Section */}
      <section className="features py-5">
        <Container>
          <Row className="text-center mb-4">
            <h2 className="section-title">Why Choose SkillBridge?</h2>
            <p className="section-subtitle">
              Unlock opportunities and grow your skills with our platform.
            </p>
          </Row>
          <Row className="g-4">
            <Col md={4}>
              <Card className="feature-card h-100 shadow-sm">
                <Card.Body>
                  <h5 className="feature-title">Learn Real-World Skills</h5>
                  <p className="feature-text">
                    Access personalized courses designed to meet the demands of
                    today’s job market.
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="feature-card h-100 shadow-sm">
                <Card.Body>
                  <h5 className="feature-title">Jobs & Gigs</h5>
                  <p className="feature-text">
                    Get direct access to jobs and freelancing gigs that match
                    your skills.
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="feature-card h-100 shadow-sm">
                <Card.Body>
                  <h5 className="feature-title">Scholarships</h5>
                  <p className="feature-text">
                    Explore scholarships that help you fund your education and
                    career growth.
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Call to Action */}
      <section className="cta text-center py-5">
        <Container>
          <h2 className="cta-title">
            Start Your Journey with SkillBridge Today!
          </h2>
          <p className="cta-subtitle">
            Build skills, find opportunities, and unlock your future.
          </p>
          <Button variant="success" size="lg" className="rounded-pill px-5" href="/register">
            Join Now
          </Button>
        </Container>
      </section>
    </div>
  );
}
