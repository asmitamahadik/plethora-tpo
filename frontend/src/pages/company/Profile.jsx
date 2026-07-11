import { useEffect, useState } from 'react';
import { Button, Card, Form, Input, Typography, message } from 'antd';
import { getMyCompanyProfile, updateMyCompanyProfile } from '../../api/companies';

export default function CompanyProfile() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getMyCompanyProfile().then((profile) => form.setFieldsValue(profile));
  }, [form]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await updateMyCompanyProfile(values);
      message.success('Profile updated');
    } catch (err) {
      message.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Typography.Title level={3}>Company Profile</Typography.Title>
      <Card style={{ maxWidth: 560 }}>
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Form.Item name="companyName" label="Company name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="industry" label="Industry">
            <Input />
          </Form.Item>
          <Form.Item name="website" label="Website">
            <Input />
          </Form.Item>
          <Form.Item name="contactPerson" label="Contact person">
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={4} />
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
