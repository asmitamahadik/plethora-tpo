import { useEffect, useState } from 'react';
import { Button, Descriptions, Drawer, Form, Input, Modal, Select, Table, Tag, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { createHod, listHods } from '../../api/hods';
import { updateUser } from '../../api/adminUsers';
import BackButton from '../../components/BackButton';
import EntityCell from '../../components/EntityCell';
import PageHeader from '../../components/PageHeader';
import PasswordRevealModal from '../../components/PasswordRevealModal';
import ResetPasswordAction from '../../components/ResetPasswordAction';

export default function AdminHods() {
  const [hods, setHods] = useState([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [createdPassword, setCreatedPassword] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [editing, setEditing] = useState(null);
  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const load = () => {
    listHods().then(setHods).catch(() => {});
  };

  useEffect(load, []);

  const onCreate = async (values) => {
    try {
      await createHod(values);
      message.success('HOD account created');
      setCreateOpen(false);
      createForm.resetFields();
      setCreatedPassword(values.password);
      load();
    } catch (err) {
      message.error(err.response?.data?.message || 'Could not create HOD account');
    }
  };

  const openEdit = (record) => {
    setEditing(record);
    editForm.setFieldsValue({
      fullName: record.fullName,
      department: record.department,
      phone: record.phone,
      enabled: record.enabled ? 'true' : 'false',
    });
  };

  const onEdit = async (values) => {
    try {
      await updateUser(editing.userId, {
        name: values.fullName,
        department: values.department,
        phone: values.phone,
        enabled: values.enabled === 'true',
      });
      message.success('HOD updated');
      setEditing(null);
      load();
    } catch (err) {
      message.error(err.response?.data?.message || 'Could not update HOD');
    }
  };

  const columns = [
    {
      title: 'HOD',
      dataIndex: 'fullName',
      render: (_, record) => <EntityCell name={record.fullName} secondary={record.email} color="#13c2c2" />,
    },
    { title: 'Department', dataIndex: 'department' },
    { title: 'Phone', dataIndex: 'phone' },
    {
      title: 'Status',
      dataIndex: 'enabled',
      render: (enabled) => <Tag color={enabled ? 'green' : 'red'}>{enabled ? 'Active' : 'Disabled'}</Tag>,
    },
    {
      title: 'Actions',
      render: (_, record) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <Button size="small" onClick={() => setViewing(record)}>View</Button>
          <Button size="small" onClick={() => openEdit(record)}>Edit</Button>
          <ResetPasswordAction userId={record.userId} label={record.fullName} />
        </div>
      ),
    },
  ];

  return (
    <div>
      <BackButton />
      <PageHeader
        title="Manage HODs"
        subtitle="Department heads provisioned by the TPO office"
        actions={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateOpen(true)}>
            New HOD
          </Button>
        }
      />
      <Table rowKey="id" columns={columns} dataSource={hods} />

      <Modal
        title="New HOD Account"
        open={createOpen}
        onCancel={() => setCreateOpen(false)}
        onOk={() => createForm.submit()}
        okText="Create"
        destroyOnHidden
      >
        <Form layout="vertical" form={createForm} onFinish={onCreate}>
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

      <PasswordRevealModal
        open={!!createdPassword}
        title="HOD account created"
        password={createdPassword}
        onClose={() => setCreatedPassword(null)}
      />

      <Drawer title="HOD Details" open={!!viewing} onClose={() => setViewing(null)} width={420}>
        {viewing && (
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Name">{viewing.fullName}</Descriptions.Item>
            <Descriptions.Item label="Email">{viewing.email}</Descriptions.Item>
            <Descriptions.Item label="Department">{viewing.department}</Descriptions.Item>
            <Descriptions.Item label="Phone">{viewing.phone || '—'}</Descriptions.Item>
            <Descriptions.Item label="Status">{viewing.enabled ? 'Active' : 'Disabled'}</Descriptions.Item>
            <Descriptions.Item label="Created At">{new Date(viewing.createdAt).toLocaleString()}</Descriptions.Item>
          </Descriptions>
        )}
      </Drawer>

      <Modal
        title={editing ? `Edit ${editing.fullName}` : ''}
        open={!!editing}
        onCancel={() => setEditing(null)}
        onOk={() => editForm.submit()}
        okText="Save changes"
        destroyOnHidden
      >
        <Form layout="vertical" form={editForm} onFinish={onEdit}>
          <Form.Item name="fullName" label="Full name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="department" label="Department" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="Phone">
            <Input />
          </Form.Item>
          <Form.Item name="enabled" label="Status" rules={[{ required: true }]}>
            <Select
              options={[
                { value: 'true', label: 'Active' },
                { value: 'false', label: 'Disabled' },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
