import { useState } from 'react';
import { apiRequest } from '../api/client';
import { logError, logInfo } from '../utils/logger';

const initialForm = {
  title: '',
  message: '',
};

function CreateNotificationForm() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      void logInfo('create-form', 'Submit notification form');
      await apiRequest('/notifications', {
        method: 'POST',
        body: JSON.stringify(form),
      });
      setForm(initialForm);
      setStatus({ type: 'success', message: 'Notification created successfully.' });
      void logInfo('create-form', 'Notification created successfully');
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
      void logError('create-form', `Notification creation failed: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="page">
      <div className="card form-card">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Create</span>
            <h2>New notification</h2>
          </div>
        </div>

        <form className="form-grid" onSubmit={handleSubmit}>
          <label>
            Title
            <input
              name="title"
              value={form.title}
              onChange={updateField}
              placeholder="Service interruption alert"
              required
            />
          </label>
          <label>
            Message
            <textarea
              name="message"
              value={form.message}
              onChange={updateField}
              placeholder="Write the notification message here"
              rows="6"
              required
            />
          </label>
          <button className="button primary" type="submit" disabled={submitting}>
            {submitting ? 'Sending...' : 'Create Notification'}
          </button>
        </form>

        {status.message ? <div className={`flash ${status.type}`}>{status.message}</div> : null}
      </div>
    </section>
  );
}

export default CreateNotificationForm;
