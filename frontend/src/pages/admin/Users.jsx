import { useEffect, useState } from 'react';
import {
  Button,
  Descriptions,
  Drawer,
  Form,
  Input,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  Typography,
  message,
} from 'antd';
import { deleteUser, listUsers, updateUser } from '../../api/adminUsers';
import { useAuth } from '../../auth/AuthContext';

const ROLE_OPTIONS = [
  { value: 'STUDENT', label: 'Student' },
  { value: 'COMPANY', label: 'Company' },
  { value: 'HOD', label: 'HOD' },
  { value: 'TPO_ADMIN', label: 'TPO Admin' },
];

export default function AdminUsers() {
  const { user: currentUser } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [role, setRole] = useState(undefined);
  const [search, setSearch] = useState('');
  const [viewing, setViewing] = useState(null);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();

  const load = (page, pageSize, roleFilter, searchFilter) => {
    setLoading(true);
    listUsers({ role: roleFilter, search: searchFilter || undefined, page: page - 1, size: pageSize })
      .then((res) => {
        setData(res.content);
        setPagination({ current: res.page + 1, pageSize: res.size, total: res.totalElements });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load(1, pagination.pageSize, role, search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]);

  const handleTableChange = (paginationConfig) => {
    load(paginationConfig.current, paginationConfig.pageSize, role, search);
  };

  const handleSearch = () => {
    load(1, pagination.pageSize, role, search);
  };

  const openEdit = (record) => {
    setEditing(record);
    form.setFieldsValue({
      name: record.name,
      department: record.department,
      enabled: record.enabled ? 'true' : 'false',
    });
  };

  const submitEdit = async (values) => {
    try {
      await updateUser(editing.id, {
        name: values.name,
        department: values.department,
        enabled: values.enabled === 'true',
      });
      message.success('User updated');
      setEditing(null);
      load(pagination.current, pagination.pageSize, role, search);
    } catch (err) {
      message.error(err.response?.data?.message || 'Could not update user');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteUser(id);
      message.success('User disabled');
      load(pagination.current, pagination.pageSize, role, search);
    } catch (err) {
      message.error(err.response?.data?.message || 'Could not delete user');
    }
  };

  const columns = [
    { title: 'Name', dataIndex: 'name' },
    { title: 'Email', dataIndex: 'email' },
    { title: 'Role', dataIndex: 'role', render: (r) => <Tag>{r.replaceAll('_', ' ')}</Tag> },
    {
      title: 'Status',
      dataIndex: 'enabled',
      render: (enabled) => <Tag color={enabled ? 'green' : 'red'}>{enabled ? 'Active' : 'Disabled'}</Tag>,
    },
    { title: 'Created At', dataIndex: 'createdAt', render: (v) => new Date(v).toLocaleString() },
    {
      title: 'Actions',
      render: (_, record) => (
        <Space>
          <Button size="small" onClick={() => setViewing(record)}>View</Button>
          <Button size="small" onClick={() => openEdit(record)}>Edit</Button>
          <Popconfirm
            title="Delete this user?"
            description="This disables the account; it can be re-enabled later via Edit."
            onConfirm={() => handleDelete(record.id)}
            disabled={record.id === currentUser?.userId}
          >
            <Button size="small" danger disabled={record.id === currentUser?.userId}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const showDepartment = editing && (editing.role === 'STUDENT' || editing.role === 'HOD');
  const showName = editing && editing.role !== 'TPO_ADMIN';

  return (
    <div>
      <Typography.Title level={3}>User Management</Typography.Title>
      <Space style={{ marginBottom: 16 }}>
        <Select
          allowClear
          placeholder="Filter by role"
          style={{ width: 180 }}
          options={ROLE_OPTIONS}
          value={role}
          onChange={setRole}
        />
        <Input.Search
          placeholder="Search by email"
          style={{ width: 240 }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onSearch={handleSearch}
          allowClear
        />
      </Space>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
      />

      <Drawer title="User Details" open={!!viewing} onClose={() => setViewing(null)} width={420}>
        {viewing && (
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Name">{viewing.name}</Descriptions.Item>
            <Descriptions.Item label="Email">{viewing.email}</Descriptions.Item>
            <Descriptions.Item label="Role">{viewing.role.replaceAll('_', ' ')}</Descriptions.Item>
            <Descriptions.Item label="Status">{viewing.enabled ? 'Active' : 'Disabled'}</Descriptions.Item>
            <Descriptions.Item label="Created At">{new Date(viewing.createdAt).toLocaleString()}</Descriptions.Item>
            {viewing.department && <Descriptions.Item label="Department">{viewing.department}</Descriptions.Item>}
            {viewing.rollNumber && <Descriptions.Item label="Roll number">{viewing.rollNumber}</Descriptions.Item>}
            {viewing.cgpa != null && <Descriptions.Item label="CGPA">{viewing.cgpa}</Descriptions.Item>}
            {viewing.graduationYear && <Descriptions.Item label="Graduation year">{viewing.graduationYear}</Descriptions.Item>}
            {viewing.phone && <Descriptions.Item label="Phone">{viewing.phone}</Descriptions.Item>}
            {viewing.companyName && <Descriptions.Item label="Company">{viewing.companyName}</Descriptions.Item>}
            {viewing.industry && <Descriptions.Item label="Industry">{viewing.industry}</Descriptions.Item>}
            {viewing.website && <Descriptions.Item label="Website">{viewing.website}</Descriptions.Item>}
            {viewing.contactPerson && <Descriptions.Item label="Contact person">{viewing.contactPerson}</Descriptions.Item>}
          </Descriptions>
        )}
      </Drawer>

      <Modal
        title={editing ? `Edit ${editing.name}` : ''}
        open={!!editing}
        onCancel={() => setEditing(null)}
        onOk={() => form.submit()}
        okText="Save changes"
        destroyOnHidden
      >
        {editing && (
          <Form layout="vertical" form={form} onFinish={submitEdit}>
            <Form.Item label="Role">
              <Input value={editing.role.replaceAll('_', ' ')} disabled />
            </Form.Item>
            {showName && (
              <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            )}
            {showDepartment && (
              <Form.Item name="department" label="Department">
                <Input />
              </Form.Item>
            )}
            <Form.Item name="enabled" label="Status" rules={[{ required: true }]}>
              <Select
                options={[
                  { value: 'true', label: 'Active' },
                  { value: 'false', label: 'Disabled' },
                ]}
              />
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
}
