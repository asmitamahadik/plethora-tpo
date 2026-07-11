import { useEffect, useState } from 'react';
import { Button, Form, Input, Modal, Space, Table, Typography, message } from 'antd';
import { createHod, listHods } from '../../api/hods';

export default function AdminHods() {
  const [hods, setHods] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();

  const load = () => {
    listHods().then(setHods).catch(() => {});
  };

  useEffect(load, []);

  const onFinish = async (values) => {
    try {
      await createHod(values);
      message.success('HOD account created');
      setModalOpen(false);
      form.resetFields();
      load();
    } catch (err) {
      message.error(err.response?.data?.message || 'Could not create HOD account');
    }
  };

  const columns = [
    { title: 'Name', dataIndex: 'fullName' },
    { title: 'Department', dataIndex: 'department' },
    { title: 'Email', dataIndex: 'email' },
    { title: 'Phone', dataIndex: 'phone' },
  ];

  return (
    <div>
      <Space style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Typography.Title level={3} style={{ margin: 0 }}>Manage HODs</Typography.Title>
        <Button type="primary" onClick={() => setModalOpen(true)}>
          New HOD
        </Button>
      </Space>
      <Table rowKey="id" columns={columns} dataSource={hods} />
      <Modal
        title="New HOD Account"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        okText="Create"
        destroyOnHidden
      >
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Form.Item name="fullName" label="Full name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="department" label="Department" rules={[{ required: true }]}
            extra="Must match the department string used by students, e.g. 'Computer Engineering'">
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="password" label="Password" rules={[{ required: true, min: 6 }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item name="phone" label="Phone">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
