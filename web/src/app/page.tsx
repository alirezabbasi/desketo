"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import { getPackages, registerUser, verifyOtp, updateProfile, selectPackage } from "../lib/api";

interface Package {
  id: number;
  name: string;
  os: string;
  cpu: string;
  ram: string;
  storage: string;
  price: string;
  created_at: string;
  updated_at: string;
}

export default function Home() {
  const { t } = useTranslation();
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
      {/* Packages Section */}
      <Row className="mb-5">
        <Col>
          <h2 className="mb-4">{t("packages")}</h2>
          <Row>
            {packages.map((pkg) => (
              <Col md={4} key={pkg.id} className="mb-4">
                <Card className="shadow-sm border-0">
                  <Card.Body>
                    <Card.Title>{pkg.name}</Card.Title>
                    <Card.Text>
                      <strong>OS:</strong> {pkg.os}<br />
                      <strong>CPU:</strong> {pkg.cpu}<br />
                      <strong>RAM:</strong> {pkg.ram}<br />
                      <strong>Storage:</strong> {pkg.storage}<br />
                      <strong>Price:</strong> {pkg.price}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>

      {/* User Flow Section */}
      <Row>
        <Col md={6} className="mx-auto">
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          {step === "register" && (
            <>
              <h2 className="mb-4">{t("register")}</h2>
              <Form onSubmit={handleRegister}>
                <Form.Group className="mb-3">
                  <Form.Label>{t("mobile")}</Form.Label>
                  <Form.Control
                    type="text"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    required
                    className="form-control-lg"
                  />
                </Form.Group>
                <Button variant="primary" type="submit" size="lg">
                  {t("submit")}
                </Button>
              </Form>
            </>
          )}

          {step === "verify" && (
            <>
              <h2 className="mb-4">{t("verify_otp")}</h2>
              <Form onSubmit={handleVerify}>
                <Form.Group className="mb-3">
                  <Form.Label>{t("otp")}</Form.Label>
                  <Form.Control
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    className="form-control-lg"
                  />
                </Form.Group>
                <Button variant="primary" type="submit" size="lg">
                  {t("submit")}
                </Button>
              </Form>
            </>
          )}

          {step === "profile" && (
            <>
              <h2 className="mb-4">{t("update_profile")}</h2>
              <Form onSubmit={handleProfileUpdate}>
                <Form.Group className="mb-3">
                  <Form.Label>{t("name")}</Form.Label>
                  <Form.Control
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="form-control-lg"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>{t("id_number")}</Form.Label>
                  <Form.Control
                    type="text"
                    value={idNumber}
                    onChange={(e) => setIdNumber(e.target.value)}
                    required
                    className="form-control-lg"
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
                <Button variant="primary" type="submit" size="lg">
                  {t("submit")}
                </Button>
              </Form>
            </>
          )}

          {step === "select" && (
            <>
              <h2 className="mb-4">{t("select_package")}</h2>
              <Form onSubmit={handlePackageSelect}>
                <Form.Group className="mb-3">
                  <Form.Label>{t("packages")}</Form.Label>
                  <Form.Select
                    onChange={(e) => setSelectedPackage(Number(e.target.value))}
                    required
                    className="form-select-lg"
                  >
                    <option value="">{t("select_package")}</option>
                    {packages.map((pkg) => (
                      <option key={pkg.id} value={pkg.id}>
                        {pkg.name} - {pkg.price}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Button variant="primary" type="submit" size="lg">
                  {t("submit")}
                </Button>
              </Form>
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
}