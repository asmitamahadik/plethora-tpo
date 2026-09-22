import { useEffect, useState } from 'react';
import { Button, Form, Input, Modal, Space, Table, Typography, message } from 'antd';
import { createCompanyByAdmin, listCompanies } from '../../api/companies';

export default function AdminCompanies() {
  const [companies, setCompanies] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();

  const load = () => {
    listCompanies().then(setCompanies).catch(() => {});
  };

  useEffect(load, []);

  const onFinish = async (values) => {
    try {
      await createCompanyByAdmin(values);
      message.success('Company account created');
      setModalOpen(false);
      form.resetFields();
      load();
    } catch (err) {
      message.error(err.response?.data?.message || 'Could not create company account');
    }
  };

  const columns = [
    { title: 'Company', dataIndex: 'companyName' },
    { title: 'Industry', dataIndex: 'industry' },
    { title: 'Contact person', dataIndex: 'contactPerson' },
    { title: 'Website', dataIndex: 'website' },
    { title: 'Email', dataIndex: 'email' },
  ];

  return (
    <div>
      <Space style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Typography.Title level={3} style={{ margin: 0 }}>Companies</Typography.Title>
        <Button type="primary" onClick={() => setModalOpen(true)}>
          New Company
        </Button>
      </Space>
      <Table rowKey="id" columns={columns} dataSource={companies} />
      <Modal
        title="New Company Account"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        okText="Create"
        destroyOnHidden
      >
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Form.Item name="companyName" label="Company name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="password" label="Temporary password" rules={[{ required: true, min: 6 }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item name="contactPerson" label="Contact person">
            <Input />
          </Form.Item>
          <Form.Item name="website" label="Website">
            <Input placeholder="https://" />
          </Form.Item>
          <Form.Item name="industry" label="Industry">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
