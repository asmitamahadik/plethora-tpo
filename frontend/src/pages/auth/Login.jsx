import { useState } from 'react';
import { Button, Card, Form, Input, Typography, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { login as loginApi } from '../../api/auth';
import { useAuth } from '../../auth/AuthContext';

const HOME_BY_ROLE = {
  STUDENT: '/student',
  TPO_ADMIN: '/admin',
  COMPANY: '/company',
  HOD: '/hod',
};

export default function Login() {
  const [loading, setLoading] = useState(false);
  const { applyAuth } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const auth = await loginApi(values);
      applyAuth(auth);
      navigate(HOME_BY_ROLE[auth.role] || '/');
    } catch (err) {
      message.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' }}>
      <Card style={{ width: 380 }}>
        <Typography.Title level={3} style={{ textAlign: 'center', marginBottom: 24 }}>
          Plethora — Sign In
        </Typography.Title>
        <Form
          layout="vertical"
          onFinish={onFinish}
          initialValues={import.meta.env.DEV ? { email: 'admin@plethora.local', password: 'Admin@123' } : undefined}
        >
          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
            <Input placeholder="you@example.com" />
          </Form.Item>
          <Form.Item name="password" label="Password" rules={[{ required: true }]}>
            <Input.Password placeholder="••••••••" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Sign In
            </Button>
          </Form.Item>
        </Form>
        <Typography.Paragraph style={{ textAlign: 'center', marginTop: 8 }}>
          New here? <Link to="/register">Create an account</Link>
        </Typography.Paragraph>
      </Card>
    </div>
  );
}
