"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { getPackages, registerUser, verifyOtp, updateProfile, selectPackage } from "../lib/api";

interface Package {
  id: number;
  name: string;
  os: string;
  cpu: string;
  ram: string;
  storage: string;
  price: string;
}

export default function Home() {
  const { t, i18n } = useTranslation();
  const [packages, setPackages] = useState<Package[]>([]);
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [kycFile, setKycFile] = useState<File | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const [step, setStep] = useState<"register" | "verify" | "profile" | "select">("register");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await getPackages();
        setPackages(response.data);
      } catch (err) {
        setError("Failed to load packages");
      }
    };
    fetchPackages();
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await registerUser(mobile);
      setSuccess("Registration successful. Please verify your OTP.");
      setStep("verify");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Registration failed");
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await verifyOtp(mobile, otp);
      setSuccess("OTP verified successfully. Please update your profile.");
      setStep("profile");
    } catch (err: any) {
      setError(err.response?.data?.detail || "OTP verification failed");
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("mobile", mobile);
    formData.append("name", name);
    formData.append("id_number", idNumber);
    if (kycFile) formData.append("kyc_file", kycFile);

    try {
      await updateProfile(formData);
      setSuccess("Profile updated successfully. Please select a package.");
      setStep("select");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Profile update failed");
    }
  };

  const handlePackageSelect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPackage) {
      setError("Please select a package");
      return;
    }
    try {
      await selectPackage(mobile, selectedPackage);
      setSuccess("Package selected successfully!");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Package selection failed");
    }
  };

  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col>
          <h1>{t("welcome")}</h1>
          <Button onClick={() => i18n.changeLanguage("en")} className="me-2">English</Button>
          <Button onClick={() => i18n.changeLanguage("fa")}>فارسی</Button>
        </Col>
      </Row>

      {/* Display Packages */}
      <Row className="mb-4">
        <Col>
          <h2>{t("packages")}</h2>
          <Row>
            {packages.map((pkg) => (
              <Col md={4} key={pkg.id} className="mb-4">
                <Card>
                  <Card.Body>
                    <Card.Title>{pkg.name}</Card.Title>
                    <Card.Text>
                      OS: {pkg.os}<br />
                      CPU: {pkg.cpu}<br />
                      RAM: {pkg.ram}<br />
                      Storage: {pkg.storage}<br />
                      Price: {pkg.price}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>

      {/* User Flow */}
      {step === "register" && (
        <Row>
          <Col md={6}>
            <h2>{t("register")}</h2>
            <Form onSubmit={handleRegister}>
              <Form.Group className="mb-3">
                <Form.Label>{t("mobile")}</Form.Label>
                <Form.Control
                  type="text"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  required
                />
              </Form.Group>
              {error && <p className="text-danger">{error}</p>}
              {success && <p className="text-success">{success}</p>}
              <Button type="submit">{t("submit")}</Button>
            </Form>
          </Col>
        </Row>
      )}

      {step === "verify" && (
        <Row>
          <Col md={6}>
            <h2>{t("verify_otp")}</h2>
            <Form onSubmit={handleVerify}>
              <Form.Group className="mb-3">
                <Form.Label>{t("otp")}</Form.Label>
                <Form.Control
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </Form.Group>
              {error && <p className="text-danger">{error}</p>}
              {success && <p className="text-success">{success}</p>}
              <Button type="submit">{t("submit")}</Button>
            </Form>
          </Col>
        </Row>
      )}

      {step === "profile" && (
        <Row>
          <Col md={6}>
            <h2>{t("update_profile")}</h2>
            <Form onSubmit={handleProfileUpdate}>
              <Form.Group className="mb-3">
                <Form.Label>{t("name")}</Form.Label>
                <Form.Control
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>{t("id_number")}</Form.Label>
                <Form.Control
                  type="text"
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>{t("kyc_file")}</Form.Label>
                <Form.Control
                  type="file"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setKycFile(e.target.files ? e.target.files[0] : null)
                  }
                  required
                />
              </Form.Group>
              {error && <p className="text-danger">{error}</p>}
              {success && <p className="text-success">{success}</p>}
              <Button type="submit">{t("submit")}</Button>
            </Form>
          </Col>
        </Row>
      )}

      {step === "select" && (
        <Row>
          <Col md={6}>
            <h2>{t("select_package")}</h2>
            <Form onSubmit={handlePackageSelect}>
              <Form.Group className="mb-3">
                <Form.Label>{t("packages")}</Form.Label>
                <Form.Select
                  onChange={(e) => setSelectedPackage(Number(e.target.value))}
                  required
                >
                  <option value="">{t("select_package")}</option>
                  {packages.map((pkg) => (
                    <option key={pkg.id} value={pkg.id}>
                      {pkg.name} - {pkg.price}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              {error && <p className="text-danger">{error}</p>}
              {success && <p className="text-success">{success}</p>}
              <Button type="submit">{t("submit")}</Button>
            </Form>
          </Col>
        </Row>
      )}
    </Container>
  );
}