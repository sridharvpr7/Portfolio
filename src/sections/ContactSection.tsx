import React from 'react';
import { Mail, Send } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../components/BrandIcons';
import { useReveal } from '../hooks/useReveal';
import type { ContactData, SocialLink } from '../services/contentLoader';
import './ContactSection.css';

interface ContactSectionProps {
  contact: ContactData;
  socialLinks: SocialLink[];
}

export const ContactSection: React.FC<ContactSectionProps> = ({ contact, socialLinks }) => {
  const { ref, isVisible } = useReveal<HTMLDivElement>({ threshold: 0.1 });
  const contactLinks = socialLinks.filter(l => l.visible && l.showInContact);

  return (
    <section id="contact" className="section contact-section" aria-labelledby="contact-title">
      <div className="container contact-container" ref={ref}>

        <div className={`contact-left ${isVisible ? 'revealed' : ''}`}>
          <div className="section-label">Get in Touch</div>
          <h2 className="section-title" id="contact-title">
            Let's Build<br/><span className="text-gradient">Something</span>
          </h2>

          <p className="contact-note">{contact.contactNote}</p>

          <div className="contact-links">
            {contact.email && (
              <a
                href={`mailto:${contact.email}`}
                id="contact-email-link"
                className="contact-link-item"
                aria-label={`Email: ${contact.displayEmail}`}
              >
                <div className="contact-link-icon">
                  <Mail size={18} />
                </div>
                <div>
                  <div className="contact-link-label">Email</div>
                  <div className="contact-link-value">{contact.displayEmail}</div>
                </div>
              </a>
            )}

            {contactLinks.map(link => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-link-item"
                aria-label={`${link.label} profile`}
              >
                <div className="contact-link-icon">
                  {link.id === 'github' ? <GithubIcon size={18} /> : <LinkedinIcon size={18} />}
                </div>
                <div>
                  <div className="contact-link-label">{link.platform}</div>
                  <div className="contact-link-value">{link.label}</div>
                </div>
              </a>
            ))}
          </div>
        </div>

        <div className={`contact-right ${isVisible ? 'revealed' : ''}`}>
          <div className="contact-card card">
            <div className="contact-card-header">
              <div className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--accent-blue)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                &gt; Send a message
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                The best way to reach me is email. I reply to all genuine messages, usually within 24 hours.
              </p>
            </div>

            <a
              href={`mailto:${contact.email}?subject=Hello from your portfolio`}
              id="contact-email-cta"
              className="btn btn-primary contact-email-btn"
              aria-label="Open email composer"
            >
              <Mail size={17} />
              Compose Email
              <Send size={14} />
            </a>

            <div className="contact-card-divider" aria-hidden="true">
              <span>or connect on</span>
            </div>

            <div className="contact-social-row">
              {contactLinks.map(link => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-social-btn"
                  aria-label={`${link.platform} profile`}
                >
                  {link.id === 'github' ? <GithubIcon size={17} /> : <LinkedinIcon size={17} />}
                  {link.platform}
                </a>
              ))}
            </div>

            <div className="contact-availability-note">
              <div className="status-badge" style={{ alignSelf: 'flex-start' }}>
                <span className="status-dot" />
                Open to Internships & Collaborations
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
