import { useEffect, useState } from 'react';
import { Button, Descriptions, Drawer, Form, Input, Modal, Select, Table, Tag, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { createCompanyByAdmin, listCompanies } from '../../api/companies';
import { updateUser } from '../../api/adminUsers';
import BackButton from '../../components/BackButton';
import EntityCell from '../../components/EntityCell';
import PageHeader from '../../components/PageHeader';
import PasswordRevealModal from '../../components/PasswordRevealModal';
import ResetPasswordAction from '../../components/ResetPasswordAction';

export default function AdminCompanies() {
  const [companies, setCompanies] = useState([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [createdPassword, setCreatedPassword] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [editing, setEditing] = useState(null);
  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const load = () => {
    listCompanies().then(setCompanies).catch(() => {});
  };

  useEffect(load, []);

  const onCreate = async (values) => {
    try {
      await createCompanyByAdmin(values);
      message.success('Company account created');
      setCreateOpen(false);
      createForm.resetFields();
      setCreatedPassword(values.password);
      load();
    } catch (err) {
      message.error(err.response?.data?.message || 'Could not create company account');
    }
  };

  const openEdit = (record) => {
    setEditing(record);
    editForm.setFieldsValue({
      companyName: record.companyName,
      contactPerson: record.contactPerson,
      website: record.website,
      industry: record.industry,
      enabled: record.enabled ? 'true' : 'false',
    });
  };

  const onEdit = async (values) => {
    try {
      await updateUser(editing.userId, {
        name: values.companyName,
        contactPerson: values.contactPerson,
        website: values.website,
        industry: values.industry,
        enabled: values.enabled === 'true',
      });
      message.success('Company updated');
      setEditing(null);
      load();
    } catch (err) {
      message.error(err.response?.data?.message || 'Could not update company');
    }
  };

  const columns = [
    {
      title: 'Company',
      dataIndex: 'companyName',
      render: (_, record) => <EntityCell name={record.companyName} secondary={record.email} color="#722ed1" />,
    },
    { title: 'Industry', dataIndex: 'industry' },
    { title: 'Contact person', dataIndex: 'contactPerson' },
    { title: 'Website', dataIndex: 'website' },
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
          <ResetPasswordAction userId={record.userId} label={record.companyName} />
        </div>
      ),
    },
  ];

  return (
    <div>
      <BackButton />
      <PageHeader
        title="Companies"
        subtitle="Recruiting partners and their contact details"
        actions={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateOpen(true)}>
            New Company
          </Button>
        }
      />
      <Table rowKey="id" columns={columns} dataSource={companies} />

      <Modal
        title="New Company Account"
        open={createOpen}
        onCancel={() => setCreateOpen(false)}
        onOk={() => createForm.submit()}
        okText="Create"
        destroyOnHidden
      >
        <Form layout="vertical" form={createForm} onFinish={onCreate}>
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

      <PasswordRevealModal
        open={!!createdPassword}
        title="Company account created"
        password={createdPassword}
        onClose={() => setCreatedPassword(null)}
      />

      <Drawer title="Company Details" open={!!viewing} onClose={() => setViewing(null)} width={420}>
        {viewing && (
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Company">{viewing.companyName}</Descriptions.Item>
            <Descriptions.Item label="Email">{viewing.email}</Descriptions.Item>
            <Descriptions.Item label="Industry">{viewing.industry || '—'}</Descriptions.Item>
            <Descriptions.Item label="Website">{viewing.website || '—'}</Descriptions.Item>
            <Descriptions.Item label="Contact person">{viewing.contactPerson || '—'}</Descriptions.Item>
            <Descriptions.Item label="Description">{viewing.description || '—'}</Descriptions.Item>
            <Descriptions.Item label="Status">{viewing.enabled ? 'Active' : 'Disabled'}</Descriptions.Item>
            <Descriptions.Item label="Created At">{new Date(viewing.createdAt).toLocaleString()}</Descriptions.Item>
          </Descriptions>
        )}
      </Drawer>

      <Modal
        title={editing ? `Edit ${editing.companyName}` : ''}
        open={!!editing}
        onCancel={() => setEditing(null)}
        onOk={() => editForm.submit()}
        okText="Save changes"
        destroyOnHidden
      >
        <Form layout="vertical" form={editForm} onFinish={onEdit}>
          <Form.Item name="companyName" label="Company name" rules={[{ required: true }]}>
            <Input />
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
