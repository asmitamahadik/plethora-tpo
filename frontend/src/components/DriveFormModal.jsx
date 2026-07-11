import { useEffect } from 'react';
import { DatePicker, Form, Input, InputNumber, Modal, message } from 'antd';
import dayjs from 'dayjs';
import { createDrive, updateDrive } from '../api/drives';

export default function DriveFormModal({ open, onClose, onSaved, drive, companyId }) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open) {
      if (drive) {
        form.setFieldsValue({
          ...drive,
          applicationDeadline: drive.applicationDeadline ? dayjs(drive.applicationDeadline) : null,
          driveDate: drive.driveDate ? dayjs(drive.driveDate) : null,
        });
      } else {
        form.resetFields();
      }
    }
  }, [open, drive, form]);

  const onFinish = async (values) => {
    const payload = {
      ...values,
      companyId: companyId ?? values.companyId,
      applicationDeadline: values.applicationDeadline ? values.applicationDeadline.format('YYYY-MM-DD') : null,
      driveDate: values.driveDate ? values.driveDate.format('YYYY-MM-DD') : null,
    };
    try {
      if (drive) {
        await updateDrive(drive.id, payload);
        message.success('Drive updated');
      } else {
        await createDrive(payload);
        message.success('Drive created as draft');
      }
      onSaved();
    } catch (err) {
      message.error(err.response?.data?.message || 'Could not save drive');
    }
  };

  return (
    <Modal
      title={drive ? 'Edit Drive' : 'New Placement Drive'}
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()}
      okText={drive ? 'Save changes' : 'Create draft'}
      destroyOnHidden
    >
      <Form layout="vertical" form={form} onFinish={onFinish}>
        {!companyId && (
          <Form.Item name="companyId" label="Company ID" rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        )}
        <Form.Item name="title" label="Title" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="jobDescription" label="Job description" rules={[{ required: true }]}>
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item name="ctcPackage" label="CTC (LPA)">
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="minCgpa" label="Minimum CGPA" rules={[{ required: true }]}>
          <InputNumber min={0} max={10} step={0.01} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="allowedDepartments" label="Eligible departments" rules={[{ required: true }]}
          extra="Comma-separated (e.g. Computer Engineering, IT) or 'ALL'">
          <Input />
        </Form.Item>
        <Form.Item name="maxBacklogs" label="Max allowed backlogs" initialValue={0}>
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="applicationDeadline" label="Application deadline">
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="driveDate" label="Drive date">
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
