"use client";

import { useTranslation } from "react-i18next";
import { Navbar, Container, Nav } from "react-bootstrap";

export default function Header() {
  const { t, i18n } = useTranslation();

  return (
    <Navbar bg="light" expand="lg" className="shadow-sm">
      <Container>
        <Navbar.Brand href="/">{t("welcome")}</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link onClick={() => i18n.changeLanguage("en")}>
              English
            </Nav.Link>
            <Nav.Link onClick={() => i18n.changeLanguage("fa")}>
              فارسی
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}