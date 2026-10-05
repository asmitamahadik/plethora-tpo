import { Button, Input, Modal, Typography, message } from 'antd';
import { CopyOutlined } from '@ant-design/icons';

export default function PasswordRevealModal({ open, title, password, onClose }) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(password || '');
      message.success('Password copied to clipboard');
    } catch {
      message.error('Could not copy — please copy it manually');
    }
  };

  return (
    <Modal title={title} open={open} onCancel={onClose} onOk={onClose} okText="Done" cancelButtonProps={{ style: { display: 'none' } }}>
      <Typography.Paragraph type="secondary">
        This password is only shown once. Share it securely with the account holder.
      </Typography.Paragraph>
      <Input.Password readOnly value={password || ''} />
      <Button type="link" icon={<CopyOutlined />} onClick={handleCopy} style={{ paddingLeft: 0, marginTop: 8 }}>
        Copy to clipboard
      </Button>
    </Modal>
  );
}
