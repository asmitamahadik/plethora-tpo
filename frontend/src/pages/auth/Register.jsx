import { useState } from 'react';
import { Button, Card, Form, Input, InputNumber, Tabs, Typography, message, theme as antdTheme } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { registerStudent, registerTpo } from '../../api/auth';
import { useAuth } from '../../auth/AuthContext';

export default function Register() {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('student');
  const { applyAuth } = useAuth();
  const navigate = useNavigate();
  const { token } = antdTheme.useToken();

  const submitStudent = async (values) => {
    setLoading(true);
    try {
      const auth = await registerStudent(values);
      applyAuth(auth);
      message.success('Welcome to Plethora!');
      navigate('/student');
    } catch (err) {
      message.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const submitTpo = async (values) => {
    setLoading(true);
    try {
      const auth = await registerTpo(values);
      applyAuth(auth);
      message.success('Welcome to Plethora!');
      navigate('/admin');
    } catch (err) {
      message.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: token.colorBgLayout, padding: 24 }}>
      <Card style={{ width: 460 }}>
        <Typography.Title level={3} style={{ textAlign: 'center', marginBottom: 8 }}>
          Create your Plethora account
        </Typography.Title>
        <Typography.Paragraph type="secondary" style={{ textAlign: 'center', marginBottom: 16 }}>
          Company and HOD accounts are provisioned internally by the TPO office.
        </Typography.Paragraph>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: 'student',
              label: 'Student',
              children: (
                <Form layout="vertical" onFinish={submitStudent}>
                  <Form.Item name="fullName" label="Full name" rules={[{ required: true }]}>
                    <Input />
                  </Form.Item>
                  <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
                    <Input />
                  </Form.Item>
                  <Form.Item name="password" label="Password" rules={[{ required: true, min: 6 }]}>
                    <Input.Password />
                  </Form.Item>
                  <Form.Item name="rollNumber" label="Roll number" rules={[{ required: true }]}>
                    <Input />
                  </Form.Item>
                  <Form.Item name="department" label="Department" rules={[{ required: true }]}>
                    <Input placeholder="e.g. Computer Engineering" />
                  </Form.Item>
                  <Form.Item name="cgpa" label="CGPA" rules={[{ required: true }]}>
                    <InputNumber min={0} max={10} step={0.01} style={{ width: '100%' }} />
                  </Form.Item>
                  <Form.Item name="graduationYear" label="Graduation year" rules={[{ required: true }]}>
                    <InputNumber min={2020} max={2035} style={{ width: '100%' }} />
                  </Form.Item>
                  <Form.Item name="backlogs" label="Active backlogs" initialValue={0}>
                    <InputNumber min={0} style={{ width: '100%' }} />
                  </Form.Item>
                  <Form.Item name="phone" label="Phone">
                    <Input />
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" htmlType="submit" block loading={loading}>
                      Register as Student
                    </Button>
                  </Form.Item>
                </Form>
              ),
            },
            {
              key: 'tpo',
              label: 'TPO Admin',
              children: (
                <Form layout="vertical" onFinish={submitTpo}>
                  <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
                    <Input />
                  </Form.Item>
                  <Form.Item name="password" label="Password" rules={[{ required: true, min: 6 }]}>
                    <Input.Password />
                  </Form.Item>
                  <Form.Item name="inviteCode" label="Invite code" rules={[{ required: true }]}
                    extra="Provided by your institution's system administrator">
                    <Input.Password />
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" htmlType="submit" block loading={loading}>
                      Register as TPO Admin
                    </Button>
                  </Form.Item>
                </Form>
              ),
            },
          ]}
        />
        <Typography.Paragraph style={{ textAlign: 'center', marginTop: 8 }}>
          Already have an account? <Link to="/login">Sign in</Link>
        </Typography.Paragraph>
      </Card>
    </div>
  );
}
