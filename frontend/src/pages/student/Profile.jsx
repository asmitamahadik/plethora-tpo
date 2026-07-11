import { useEffect, useState } from 'react';
import { Button, Card, Form, Input, InputNumber, Typography, message } from 'antd';
import { getMyStudentProfile, updateMyStudentProfile } from '../../api/students';

export default function StudentProfile() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [rollNumber, setRollNumber] = useState('');

  useEffect(() => {
    getMyStudentProfile().then((profile) => {
      setRollNumber(profile.rollNumber);
      form.setFieldsValue(profile);
    });
  }, [form]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await updateMyStudentProfile(values);
      message.success('Profile updated');
    } catch (err) {
      message.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Typography.Title level={3}>My Profile</Typography.Title>
      <Card style={{ maxWidth: 560 }}>
        <Typography.Text type="secondary">Roll number: {rollNumber}</Typography.Text>
        <Form layout="vertical" form={form} onFinish={onFinish} style={{ marginTop: 16 }}>
          <Form.Item name="fullName" label="Full name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="department" label="Department" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="cgpa" label="CGPA" rules={[{ required: true }]}>
            <InputNumber min={0} max={10} step={0.01} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="graduationYear" label="Graduation year" rules={[{ required: true }]}>
            <InputNumber min={2020} max={2035} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="backlogs" label="Active backlogs">
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="phone" label="Phone">
            <Input />
          </Form.Item>
          <Form.Item name="resumeUrl" label="Resume URL">
            <Input placeholder="Link to your resume" />
          </Form.Item>
          <Form.Item name="skills" label="Skills">
            <Input.TextArea rows={3} placeholder="Comma-separated skills" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Save changes
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
