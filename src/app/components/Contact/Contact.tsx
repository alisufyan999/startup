"use client";

import Container from "../Container";
import styles from "./Contact.module.css";

export default function Contact() {
  return (
    <section className={styles.contactSection}>
      <Container maxWidth="xl" className="px-0">
        <div className={styles.contactCard}>
          {/* Left Section - Information */}
          <div className={styles.leftSection}>
            <div className={styles.infoContent}>
              {/* Heading 1 */}
              <div className={styles.headingWithIcon}>
                <div className={styles.globeIcon}>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#0fdac2"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                </div>
                <h2 className={styles.heading1}>Fill Up Your Details</h2>
              </div>

              {/* Heading 2 */}
              <div className={styles.headingWithIcon}>
                <div className={styles.globeIcon}>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#0fdac2"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                </div>
                <h3 className={styles.heading2}>
                  One of Our Account Managers Will Contact You Shortly.
                </h3>
              </div>

              <img src="/assets/images/contact-client.webp" className={`img-fluid ${styles.client_image}`}/>

              {/* Lorem Ipsum Text */}
              <p className={styles.descriptionText}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur.
              </p>
            </div>
          </div>

          {/* Right Section - Contact Form */}
          <div className={styles.rightSection}>
            <div className={styles.formContent}>
              {/* Form Heading */}
              <h2 className={styles.formHeading}>
                Ready To <span className={styles.highlightText}>Connect</span>?
              </h2>

              {/* Form */}
              <form className={styles.contactForm}>
                {/* Name and Email Row */}
                <div className={styles.formRow}>
                  <div className={styles.formField}>
                    <input
                      type="text"
                      placeholder="Name*"
                      className={styles.inputField}
                      required
                    />
                  </div>
                  <div className={styles.formField}>
                    <input
                      type="email"
                      placeholder="Email*"
                      className={styles.inputField}
                      required
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div className={styles.formRow}>
                  <div className={styles.formFieldFull}>
                    <input
                      type="tel"
                      placeholder="Phone Number*"
                      className={styles.inputField}
                      required
                    />
                  </div>
                </div>

                {/* Company Name */}
                <div className={styles.formRow}>
                  <div className={styles.formFieldFull}>
                    <input
                      type="text"
                      placeholder="Company Name*"
                      className={styles.inputField}
                      required
                    />
                  </div>
                </div>

                {/* Message */}
                <div className={styles.formRow}>
                  <div className={styles.formFieldFull}>
                    <textarea
                      placeholder="Message*"
                      rows={5}
                      className={styles.textareaField}
                      required
                    ></textarea>
                  </div>
                </div>

                {/* Submit Button */}
                <button type="submit" className={styles.submitButton}>
                  <span>Submit</span>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>
              </form>
            </div>
          </div>
        </div>
      </Container>
      <img src="/assets/images/rocket1.webp" className={`img-fluid ${styles.rocket1}`}/>
    </section>
  );
}

