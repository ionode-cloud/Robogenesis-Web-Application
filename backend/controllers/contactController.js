import { Storage } from '../services/storage.js';

export const ContactController = {
  submit(req, res) {
    try {
      const { fullName, email, phone, enquiryType, domain, message, sourceTab } = req.body;

      if (!fullName || !fullName.trim()) {
        return res.status(400).json({ error: 'Full name is required.' });
      }
      if (!email || !email.trim()) {
        return res.status(400).json({ error: 'Email address is required.' });
      }
      if (!message || !message.trim()) {
        return res.status(400).json({ error: 'Message cannot be empty.' });
      }

      const newEnquiry = Storage.addEnquiry({
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone ? phone.trim() : '',
        enquiryType: enquiryType || 'General Consultation',
        domain: domain || 'General Robotics',
        sourceTab: sourceTab || 'Contact Us',
        message: message.trim(),
      });

      return res.status(201).json({
        message: 'Your enquiry has been successfully submitted! Our engineering team will get back to you shortly.',
        enquiryId: newEnquiry.id,
      });
    } catch (err) {
      console.error('[ContactController.submit] Error:', err);
      return res.status(500).json({ error: 'Failed to submit enquiry. Please try again.' });
    }
  },

  // Get enquiries for logged-in user
  getUserEnquiries(req, res) {
    try {
      const email = req.user?.email || req.query?.email;
      if (!email || !email.trim()) {
        return res.status(400).json({ error: 'User email is required.' });
      }

      const cleanEmail = email.toLowerCase().trim();
      const allEnquiries = Storage.getEnquiries();
      const userEnquiries = allEnquiries.filter(
        (e) => (e.email || '').toLowerCase().trim() === cleanEmail
      );

      return res.json({
        total: userEnquiries.length,
        enquiries: userEnquiries,
      });
    } catch (err) {
      console.error('[ContactController.getUserEnquiries] Error:', err);
      return res.status(500).json({ error: 'Failed to retrieve enquiries history.' });
    }
  },
};
