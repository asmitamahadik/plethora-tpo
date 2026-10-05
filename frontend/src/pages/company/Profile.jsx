import { useEffect, useState } from 'react';
import { Button, Card, Form, Input, message } from 'antd';
import { getMyCompanyProfile, updateMyCompanyProfile } from '../../api/companies';
import BackButton from '../../components/BackButton';
import PageHeader from '../../components/PageHeader';

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
      <BackButton />
      <PageHeader title="Company Profile" subtitle="Keep your recruiting contact details up to date" />
      <Card bordered={false} style={{ maxWidth: 560 }}>
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
