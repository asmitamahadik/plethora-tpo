import { useState } from 'react';
import { Button, Form, Input, Modal, message } from 'antd';
import { KeyOutlined } from '@ant-design/icons';
import { resetUserPassword } from '../api/adminUsers';
import PasswordRevealModal from './PasswordRevealModal';

export default function ResetPasswordAction({ userId, label }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [revealedPassword, setRevealedPassword] = useState(null);
  const [form] = Form.useForm();

  const handleGenerate = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%';
    let generated = '';
    for (let i = 0; i < 12; i += 1) {
      generated += chars[Math.floor(Math.random() * chars.length)];
    }
    form.setFieldsValue({ newPassword: generated });
  };

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      const res = await resetUserPassword(userId, values.newPassword || undefined);
      setModalOpen(false);
      form.resetFields();
      setRevealedPassword(res.password);
    } catch (err) {
      message.error(err.response?.data?.message || 'Could not reset password');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Button size="small" icon={<KeyOutlined />} onClick={() => setModalOpen(true)}>
        Reset Password
      </Button>
      <Modal
        title={`Reset password${label ? ` — ${label}` : ''}`}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        okText="Reset Password"
        okButtonProps={{ loading: submitting }}
        destroyOnHidden
      >
        <Form layout="vertical" form={form} onFinish={handleSubmit}>
          <Form.Item
            name="newPassword"
            label="New password"
            extra="Leave blank to auto-generate a secure password."
            rules={[{ min: 6, message: 'Password must be at least 6 characters' }]}
          >
            <Input.Password placeholder="Leave blank to generate automatically" />
          </Form.Item>
          <Button onClick={handleGenerate}>Generate secure password</Button>
        </Form>
      </Modal>
      <PasswordRevealModal
        open={!!revealedPassword}
        title="Password reset successfully"
        password={revealedPassword}
        onClose={() => setRevealedPassword(null)}
      />
    </>
  );
}
